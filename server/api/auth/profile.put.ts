import { createError, defineEventHandler, readBody } from "h3";
import bcrypt from "bcrypt";
import { getSupabaseServer } from "../../utils/supabase";

interface ProfileUpdateBody {
  userId?: number | string;
  fullName?: string;
  currentPassword?: string;
  newPassword?: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ProfileUpdateBody>(event);

  const userId = body.userId;
  const fullName = (body.fullName || "").trim();
  const currentPassword = (body.currentPassword || "").trim();
  const newPassword = (body.newPassword || "").trim();

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required.",
    });
  }

  if (!fullName && !newPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: "Nothing to update.",
    });
  }

  const supabase = await getSupabaseServer(event);

  const { data: existing, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (fetchError || !existing) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found.",
    });
  }

  const updates: Record<string, any> = {};

  if (fullName) {
    updates.full_name = fullName;
  }

  if (newPassword) {
    if (!currentPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: "Current password is required to change password.",
      });
    }

    const match = await bcrypt.compare(currentPassword, existing.password_hash);
    if (!match) {
      throw createError({
        statusCode: 401,
        statusMessage: "Current password is incorrect.",
      });
    }

    if (newPassword.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: "New password must be at least 6 characters.",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    updates.password_hash = hashedPassword;
  }

  if (Object.keys(updates).length === 0) {
    return {
      id: existing.id,
      email: existing.email,
      fullName: existing.full_name,
      createdAt: existing.created_at,
    };
  }

  const { data: updatedRows, error: updateError } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select("*");

  if (updateError || !updatedRows || updatedRows.length === 0) {
    console.error("Profile update error:", updateError, updatedRows);
    throw createError({
      statusCode: 500,
      statusMessage: updateError?.message || "Failed to update profile.",
    });
  }

  const updated = updatedRows[0];

  return {
    id: updated.id,
    email: updated.email,
    fullName: updated.full_name,
    createdAt: updated.created_at,
  };
});

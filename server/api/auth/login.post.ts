import { createError, defineEventHandler, readBody } from "h3";
import { validateUserInDB } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event);

  const email = (body.email || "").trim();
  const password = (body.password || "").trim();

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required.",
    });
  }

  // Pass the event parameter here! ↓
  const user = await validateUserInDB(event, email, password);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid email or password.",
    });
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    createdAt: user.createdAt,
  };
});
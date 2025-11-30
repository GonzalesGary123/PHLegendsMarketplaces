// server/api/auth/register.post.ts
import { createError, defineEventHandler, readBody } from "h3";
import { createUserInDB } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    email?: string;
    password?: string;
    fullName?: string;
  }>(event);

  const email = (body.email || "").trim();
  const password = (body.password || "").trim();
  const fullName = (body.fullName || "").trim();

  if (!email || !password || !fullName) {
    throw createError({
      statusCode: 400,
      statusMessage: "Full name, email and password are required.",
    });
  }

  const emailPattern = /^\S+@\S+\.\S+$/;
  if (!emailPattern.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid email address.",
    });
  }

  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: "Password must be at least 6 characters.",
    });
  }

  try {
    const user = await createUserInDB(event, email, password, fullName);
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
      }
    };
  } catch (err: any) {
    console.error('Registration error:', err);
    
    if (err.message === "Email is already registered.") {
      throw createError({
        statusCode: 400,
        statusMessage: "Email is already registered.",
      });
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: "Registration failed: " + err.message,
    });
  }
});
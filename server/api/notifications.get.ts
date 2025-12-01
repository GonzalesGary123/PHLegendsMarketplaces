import { createError, defineEventHandler, getQuery } from "h3";
import { getNotificationsForUser } from "../utils/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const userId = query.userId as string;

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "User ID is required.",
    });
  }

  try {
    return await getNotificationsForUser(event, userId);
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err?.message || "Failed to fetch notifications.",
    });
  }
});

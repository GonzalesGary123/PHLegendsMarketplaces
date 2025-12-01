import { createError, defineEventHandler, readBody } from "h3";
import { markAllNotificationsAsRead } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ 
    userId?: string;
  }>(event);

  const { userId } = body;

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required.",
    });
  }

  try {
    await markAllNotificationsAsRead(event, userId);
    return {
      success: true,
    };
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err?.message || "Failed to mark all notifications as read.",
    });
  }
});

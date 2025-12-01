import { createError, defineEventHandler, readBody } from "h3";
import { markNotificationAsRead } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ 
    notificationId?: string;
  }>(event);

  const { notificationId } = body;

  if (!notificationId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Notification ID is required.",
    });
  }

  try {
    const notification = await markNotificationAsRead(event, notificationId);
    return {
      success: true,
      notification,
    };
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err?.message || "Failed to mark notification as read.",
    });
  }
});

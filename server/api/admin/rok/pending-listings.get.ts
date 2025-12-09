import { createError, defineEventHandler, getQuery, setResponseHeader } from "h3";
import { getRokListingsFromDB, isAdminUser } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const userId = query.userId as string;
  const status = (query.status as string) || 'pending';

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "User ID is required.",
    });
  }

  const isAdmin = await isAdminUser(event, userId);
  if (!isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: "Access denied. Admin privileges required.",
    });
  }

  const validStatuses = ['pending', 'approved', 'rejected', 'sold'];
  if (!validStatuses.includes(status)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  try {
    setResponseHeader(event, 'Cache-Control', 'no-store')
    return await getRokListingsFromDB(event, status as any);
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch ROK listings. Please try again.",
    });
  }
});

import { createError, defineEventHandler, getQuery } from "h3";
import { getListingsFromDB } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const userId = query.userId as string;

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required.",
    });
  }

  try {
    // Get all listings for this user (regardless of status)
    const allListings = await getListingsFromDB(event);
    const userListings = allListings.filter(listing => listing.userId === userId);
    
    return userListings;
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err?.message || "Failed to fetch user listings.",
    });
  }
});

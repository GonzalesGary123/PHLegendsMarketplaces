import { createError, defineEventHandler, readBody } from "h3";
import { isAdminUser, updateRokListingStatus, createNotification } from "../../../utils/db";
import { sanitizeString } from "../../../utils/security";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ listingId?: string; userId?: string }>(event);

  let listingId: string;
  let userId: string;

  try {
    listingId = sanitizeString(String(body.listingId || ""), 50);
    userId = sanitizeString(String(body.userId || ""), 50);
  } catch (err: any) {
    throw createError({ statusCode: 400, statusMessage: "Invalid input data." });
  }

  if (!listingId || !userId) {
    throw createError({ statusCode: 400, statusMessage: "Listing ID and User ID are required." });
  }

  const isAdmin = await isAdminUser(event, userId);
  if (!isAdmin) {
    throw createError({ statusCode: 403, statusMessage: "Access denied. Admin privileges required." });
  }

  try {
    const updatedListing = await updateRokListingStatus(event, listingId, 'rejected');

    if (updatedListing.userId) {
      try {
        await createNotification(
          event,
          updatedListing.userId,
          undefined,
          'rejected',
          'Rise of Kingdoms Listing Rejected',
          'Your Rise of Kingdoms listing was rejected. Please review requirements and resubmit.'
        );
      } catch {}
    }

    return { success: true, listing: updatedListing };
  } catch (err: any) {
    if (err.statusCode) throw err;
    throw createError({ statusCode: 500, statusMessage: "Failed to reject ROK listing. Please try again." });
  }
});

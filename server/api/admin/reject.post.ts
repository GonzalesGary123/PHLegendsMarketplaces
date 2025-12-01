import { createError, defineEventHandler, readBody } from "h3";
import { isAdminUser, updateListingStatus, createNotification } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ 
    listingId?: string; 
    userId?: string;
  }>(event);

  const { listingId, userId } = body;

  if (!listingId || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Listing ID and User ID are required.",
    });
  }

  // Check if user is admin
  const isAdmin = await isAdminUser(event, userId);
  if (!isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: "Access denied. Admin privileges required.",
    });
  }

  // Reject the listing
  const updatedListing = await updateListingStatus(event, listingId, 'rejected', userId);
  
  // Create notification for the listing owner
  if (updatedListing.userId) {
    try {
      await createNotification(
        event,
        updatedListing.userId,
        listingId,
        'rejected',
        'Listing Rejected',
        `Unfortunately, your listing for "${updatedListing.nickname}" has been rejected. Please review your listing and submit a new one if needed.`
      );
    } catch (notifError) {
      console.error('Failed to create notification:', notifError);
      // Don't fail the rejection if notification fails
    }
  }
  
  return {
    success: true,
    listing: updatedListing,
  };
});

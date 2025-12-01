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

  // Mark the listing as sold
  const updatedListing = await updateListingStatus(event, listingId, 'sold', userId);
  
  // Create notification for the listing owner
  if (updatedListing.userId) {
    try {
      await createNotification(
        event,
        updatedListing.userId,
        listingId,
        'sold',
        'Listing Marked as Sold',
        `Your listing for "${updatedListing.nickname}" has been marked as sold. Thank you for using our marketplace!`
      );
    } catch (notifError) {
      console.error('Failed to create notification:', notifError);
      // Don't fail the mark-sold if notification fails
    }
  }
  
  return {
    success: true,
    listing: updatedListing,
  };
});

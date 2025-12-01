import { createError, defineEventHandler, readMultipartFormData } from "h3";
import { addListingToDB, createNotification } from "../utils/db";

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);

  if (!form) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid or missing form data.",
    });
  }

  let nickname = "";
  let server = "";
  let growthPower = "";
  let classes = "";
  let askingPrice = "";
  let contactLink = "";
  let contactNumber = "";
  let userId = "";
  const images: string[] = [];

  const phonePattern = /^[0-9+()\-\s]{7,20}$/;

  for (const field of form) {
    const value = field.data.toString("utf8");

    switch (field.name) {
      case "nickname":
        nickname = value;
        break;
      case "server":
        server = value;
        break;
      case "growthPower":
        growthPower = value;
        break;
      case "classes":
        classes = value;
        break;
      case "askingPrice":
        askingPrice = value;
        break;
      case "contactLink":
        contactLink = value;
        break;
      case "contactNumber":
        contactNumber = value;
        break;
      case "userId":
        userId = value;
        break;
      case "images":
        if (field.data.length) {
          const mime = field.type || "image/png";
          const base64 = field.data.toString("base64");
          images.push(`data:${mime};base64,${base64}`);
        }
        break;
      default:
        break;
    }
  }

  if (!nickname || !server || !growthPower || !askingPrice || !contactNumber) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields.",
    });
  }

  if (!phonePattern.test(contactNumber.trim())) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid contact number format.",
    });
  }

  if (!classes) {
    throw createError({
      statusCode: 400,
      statusMessage: "Class is required.",
    });
  }

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required.",
    });
  }

  const classesList = classes
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  // Pass the event parameter here! ↓
  const listing = await addListingToDB(event, {
    userId,
    nickname,
    server,
    growthPower,
    classesList,
    askingPrice,
    contactLink,
    contactNumber,
    images,
  });

  // Create notification for the user that their listing is pending review
  try {
    await createNotification(
      event,
      userId,
      listing.id,
      'pending_review',
      'Listing Submitted for Review',
      `Your listing for "${nickname}" has been submitted and is pending admin review. You'll be notified once it's approved.`
    );
  } catch (notifError) {
    console.error('Failed to create notification:', notifError);
    // Don't fail the listing creation if notification fails
  }

  return listing;
});
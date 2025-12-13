import { createError, defineEventHandler, readMultipartFormData } from "h3";
import { addRokListingToDB, createNotification } from "../../utils/db";
import {
  sanitizeString,
  sanitizePhone,
  sanitizeUrl,
  sanitizePrice,
  validateImageData,
} from "../../utils/security";

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);

  if (!form) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid or missing form data.",
    });
  }

  let userId = "";
  let askingPrice = "";
  let passportReady = "";
  let passportNeeded = "";
  let readyToMigrate = "";
  let focusType = "";
  let vipLevel = "";
  let currentGoldHeads = "";
  let troopCount = "";
  let currentPower = "";
  let firstPurchaseReceipt = "";
  let hasVipSupport = "";
  let kvkSeason = "";
  let universalSpeedupsDays = "";
  let equipment = "";
  let topCommanders = "";
  let contactLink = "";
  let contactNumber = "";
  let farmAccounts = "";
  let middlemanId = "";
  const images: string[] = [];

  try {
    for (const field of form) {
      const value = field.data.toString("utf8");
      switch (field.name) {
        case "userId":
          userId = sanitizeString(value, 50);
          break;
        case "askingPrice":
          askingPrice = sanitizePrice(value);
          break;
        case "passportReady":
          passportReady = sanitizeString(value, 10);
          break;
        case "passportNeeded":
          passportNeeded = sanitizeString(value, 10);
          break;
        case "readyToMigrate":
          readyToMigrate = sanitizeString(value, 10);
          break;
        case "focusType":
          focusType = sanitizeString(value, 20);
          break;
        case "vipLevel":
          vipLevel = sanitizeString(value, 10);
          break;
        case "currentGoldHeads":
          currentGoldHeads = sanitizeString(value, 10);
          break;
        case "troopCount":
          troopCount = sanitizeString(value, 30);
          break;
        case "currentPower":
          currentPower = sanitizeString(value, 10);
          break;
        case "firstPurchaseReceipt":
          firstPurchaseReceipt = sanitizeString(value, 15);
          break;
        case "hasVipSupport":
          hasVipSupport = sanitizeString(value, 15);
          break;
        case "kvkSeason":
          kvkSeason = sanitizeString(value, 10);
          break;
        case "universalSpeedupsDays":
          universalSpeedupsDays = sanitizeString(value, 12);
          break;
        case "equipment":
          equipment = sanitizeString(value, 2000);
          break;
        case "topCommanders":
          topCommanders = sanitizeString(value, 2000);
          break;
        case "contactLink":
          if (value && value.trim()) {
            contactLink = sanitizeUrl(value) || "";
          }
          break;
        case "contactNumber":
          contactNumber = sanitizePhone(value);
          break;
        case "farmAccounts":
          farmAccounts = sanitizeString(value, 20);
          break;
        case "middlemanId":
          middlemanId = sanitizeString(value, 50);
          break;
        case "images":
          if (field.data.length) {
            const mime = field.type || "image/png";
            const base64 = field.data.toString("base64");
            const imageData = `data:${mime};base64,${base64}`;
            validateImageData(imageData, 5);
            if (images.length >= 5) {
              throw new Error("Maximum 5 images allowed");
            }
            images.push(imageData);
          }
          break;
        default:
          break;
      }
    }

    if (!userId) {
      throw createError({ statusCode: 400, statusMessage: "User ID is required." });
    }
    if (!askingPrice) {
      throw createError({ statusCode: 400, statusMessage: "Asking Price is required." });
    }
    if (!contactNumber) {
      throw createError({ statusCode: 400, statusMessage: "Contact Number is required." });
    }
    if (!middlemanId) {
      throw createError({ statusCode: 400, statusMessage: "Middleman selection is required." });
    }

    const focusOptions = ["Cavalry", "Infantry", "Archer", "Engineering"];
    if (focusType && !focusOptions.includes(focusType)) {
      throw createError({ statusCode: 400, statusMessage: "Invalid Focus Type." });
    }

    if (passportReady) {
      const pr = passportReady.toLowerCase();
      if (pr !== "yes" && pr !== "no") {
        throw createError({ statusCode: 400, statusMessage: "Passport Ready must be Yes/No." });
      }
    }

    if (readyToMigrate) {
      const rm = readyToMigrate.toLowerCase();
      if (rm !== "yes" && rm !== "no") {
        throw createError({ statusCode: 400, statusMessage: "Ready to Migrate must be Yes/No." });
      }
    }

    if (firstPurchaseReceipt) {
      const fpr = firstPurchaseReceipt.toLowerCase();
      if (fpr !== "available" && fpr !== "not") {
        throw createError({ statusCode: 400, statusMessage: "First Purchase Receipt must be available/not." });
      }
    }

    if (hasVipSupport) {
      const hv = hasVipSupport.toLowerCase();
      if (hv !== "available" && hv !== "not") {
        throw createError({ statusCode: 400, statusMessage: "Has VIP Support must be available/not." });
      }
    }

    if (kvkSeason) {
      const kvkOptions = ["kvk1", "kvk2", "kvk3", "kvk4", "SOC"];
      if (!kvkOptions.includes(kvkSeason)) {
        throw createError({ statusCode: 400, statusMessage: "Invalid KvK Season." });
      }
    }
  } catch (err: any) {
    if (err.statusCode) {
      throw err;
    }
    throw createError({
      statusCode: 400,
      statusMessage: err.message || "Invalid input data.",
    });
  }

  try {
    const listing = await addRokListingToDB(event, {
      userId,
      middlemanId,
      askingPrice,
      passportReady,
      passportNeeded,
      readyToMigrate,
      focusType,
      vipLevel,
      currentGoldHeads,
      troopCount,
      currentPower,
      firstPurchaseReceipt,
      hasVipSupport,
      kvkSeason,
      universalSpeedupsDays,
      equipment,
      topCommanders,
      contactLink,
      contactNumber,
      farmAccounts,
      images,
      status: "pending",
    });

    try {
      await createNotification(
        event,
        userId,
        undefined,
        "pending_review",
        "Rise of Kingdoms Listing Submitted",
        "Your Rise of Kingdoms listing has been submitted and is pending admin review."
      );
    } catch {}

    return listing;
  } catch (err: any) {
    if (err.statusCode) {
      throw err;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create Rise of Kingdoms listing.",
    });
  }
});


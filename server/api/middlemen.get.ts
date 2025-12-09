import { defineEventHandler, setResponseHeader, createError } from "h3";
import { getMiddlemenFromDB } from "../utils/db";

export default defineEventHandler(async (event) => {
  try {
    setResponseHeader(event, 'Cache-Control', 'no-store')
    const middlemen = await getMiddlemenFromDB(event);
    return middlemen;
  } catch (err: any) {
    console.error('Error fetching middlemen:', err);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch middlemen.",
    });
  }
});

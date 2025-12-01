import { defineEventHandler } from "h3";
import { getListingsFromDB } from "../utils/db";

export default defineEventHandler(async (event) => {
  // Return approved and sold listings for public marketplace
  const approved = await getListingsFromDB(event, 'approved');
  const sold = await getListingsFromDB(event, 'sold');
  return [...approved, ...sold];
});
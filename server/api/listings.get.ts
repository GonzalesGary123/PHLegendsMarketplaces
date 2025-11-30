import { defineEventHandler } from "h3";
import { getListingsFromDB } from "../utils/db";

export default defineEventHandler(async (event) => {
  return await getListingsFromDB(event);
});
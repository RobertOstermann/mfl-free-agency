import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import contractJson from "./codegen/contract.json" with { type: "json" };
import type { Contract } from "@/prisma/codegen/contract";

export const db = postgres<Contract>({
  contractJson,
  url: process.env["DATABASE_URL"]!,
});

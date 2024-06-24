import { db } from "@/database/db";

export default async function deleteContact(principal: string) {
  await db().deleteContact(principal, { sync: true });
}

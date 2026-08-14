import { db } from "../../db";
import { sql } from "drizzle-orm";
import { Hono } from "hono";

export const health = new Hono();

health.get("/", async (c) => {
  const configOk = Boolean(process.env.DATABASE_URL && process.env.JWT_SECRET);

  let databaseOk = false;
  try {
    await db.execute(sql`SELECT 1`);
    databaseOk = true;
  } catch {
    databaseOk = false;
  }
  return c.json({
    database: { ok: databaseOk },
    config: { ok: configOk },
  });
});

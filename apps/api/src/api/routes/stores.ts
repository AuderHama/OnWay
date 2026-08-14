import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { requireAuth } from "../middleware/auth";
import { db } from "../../db";
import {
  stores as storesTable,
  products as productsTable,
} from "../../db/schema";
import { and, eq, isNull } from "drizzle-orm";

export const stores = new Hono();

stores.use("*", requireAuth);

const createStoreSchema = z.object({
  name: z.string().min(1),
  city: z.string().min(1),
  isActive: z.boolean().optional(),
});

const updateStoreSchema = z.object({
  // id: z.int().min(1),
  name: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

const createProductsValidator = z.object({
  name: z.string().min(1),
  price: z.int().min(0),
  isAvailable: z.boolean().optional(),
});

stores.get("/", async (c) => {
  const rows = await db
    .select()
    .from(storesTable)
    .where(isNull(storesTable.deletedAt));
  return c.json({ success: true, stores: rows }, 200);
});

stores.post("/", zValidator("json", createStoreSchema), async (c) => {
  const body = c.req.valid("json");
  const [store] = await db.insert(storesTable).values(body).returning();
  return c.json({ store }, 200);
});
stores.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const [store] = await db
    .update(storesTable)
    .set({ deletedAt: new Date() })
    .where(eq(storesTable.id, Number(id)))
    .returning();

  if (!store) {
    return c.json({ message: "Store not found " }, 404);
  }
  return c.json({ store }, 200);
});

stores.patch("/:id", zValidator("json", updateStoreSchema), async (c) => {
  const id = c.req.param("id");
  const body = c.req.valid("json");

  const [store] = await db
    .update(storesTable)
    .set({ ...body, modifiedAt: new Date() })
    .where(eq(storesTable.id, Number(id)))
    .returning();

  if (!store) {
    return c.json({ message: "Store not found " }, 404);
  }
  return c.json({ store }, 200);
});

stores.get("/:storeId/products", async (c) => {
  const storeId = Number(c.req.param("storeId"));
  const products = await db
    .select()
    .from(productsTable)
    .where(
      and(eq(productsTable.storeId, storeId), isNull(productsTable.deletedAt)),
    );
  return c.json({ products }, 200);
});

stores.post(
  "/:storeId/product",
  zValidator("json", createProductsValidator),
  async (c) => {
    const storeId = c.req.param("storeId");
    const body = c.req.valid("json");
    const [product] = await db
      .insert(productsTable)
      .values({ ...body, storeId: Number(storeId) })
      .returning();
    return c.json({ product }, 201);
  },
);

import { products as productsTable } from "./../../db/schema";
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { requireAuth } from "../middleware/auth";
import { db } from "../../db";
import { eq, isNull } from "drizzle-orm";

export const products = new Hono();

products.use("*", requireAuth);

const createProductsValidator = z.object({
  name: z.string().min(1),
  price: z.int().min(0),
  storeId: z.int().min(1),
  isAvailable: z.boolean().optional(),
});
const updateProductsValidator = z.object({
  name: z.string().min(1),
  price: z.int().min(0),
  isAvailable: z.boolean().optional(),
});

products.get("/", async (c) => {
  const rows = await db
    .select()
    .from(productsTable)
    .where(isNull(productsTable.deletedAt));
  return c.json({ success: true, products: rows }, 200);
});

products.post("/", zValidator("json", createProductsValidator), async (c) => {
  const body = c.req.valid("json");
  const [product] = await db.insert(productsTable).values(body).returning();
  return c.json({ success: true, product }, 201);
});

products.patch(
  "/:id",
  zValidator("json", updateProductsValidator),
  async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const [product] = await db
      .update(productsTable)
      .set({ ...body, modifiedAt: new Date() })
      .where(eq(productsTable.id, Number(id)))
      .returning();
    if (!product) {
      return c.json({ message: "Product couldnot be found." }, 404);
    }

    return c.json({ success: true, product }, 200);
  },
);

products.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const [product] = await db
    .update(productsTable)
    .set({ deletedAt: new Date() })
    .where(eq(productsTable.id, Number(id)))
    .returning();

  if (!product) {
    return c.json({ message: "product not found " }, 404);
  }
  return c.json({ success: true, product }, 200);
});

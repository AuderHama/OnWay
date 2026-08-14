import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { requireAuth } from "../middleware/auth";
import { db } from "../../db";
import { orders as ordersTable } from "../../db/schema";
import { eq } from "drizzle-orm";

export const orders = new Hono();

const createOrdersSchema = z.object({
  customerName: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  storeId: z.int().min(1),
  item: z.array(
    z.object({
      productId: z.int().min(1),
      qty: z.int().min(1),
    }),
  ),
});
const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "accepted",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ]),
});

orders.get("/", requireAuth, async (c) => {
  const orders = await db.select().from(ordersTable);
  return c.json({ success: true, orders }, 200);
});

orders.post("/", zValidator("json", createOrdersSchema), async (c) => {
  const body = c.req.valid("json");
  const order = await db.insert(ordersTable).values(body).returning();
  return c.json({ success: true, order }, 200);
});

orders.patch(
  "/:id/status",
  requireAuth,
  zValidator("json", updateOrderStatusSchema),
  async (c) => {
    const id = c.req.param("id");
    const { status } = c.req.valid("json");
    const [order] = await db
      .update(ordersTable)
      .set({ status, modifiedAt: new Date() })
      .where(eq(ordersTable.id, Number(id)))
      .returning();
    if (!order) {
      return c.json({ message: "Order status change failed!" }, 404);
    }
    return c.json({ success: true, order }, 200);
  },
);

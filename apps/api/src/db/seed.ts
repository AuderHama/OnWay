import bcrypt from "bcryptjs";
import { users, stores, products, orders } from "./schema";
import "dotenv/config";
import { db } from "./";

async function seed() {
  const hashPassword = await bcrypt.hash("admin123", 10);

  await db
    .insert(users)
    .values({ email: "admin@example.com", passwordHash: hashPassword });
  const insertedStores = await db
    .insert(stores)
    .values([
      { name: "store1", city: "ranya" },
      { name: "store2", city: "ranya" },
    ])
    .returning();

  const insertedProducts = await db
    .insert(products)
    .values([
      { name: "pizza md", price: 4000, storeId: insertedStores[0].id },
      { name: "pizza lg", price: 5000, storeId: insertedStores[0].id },
      { name: "pizza sm", price: 3000, storeId: insertedStores[0].id },
      { name: "shawrma", price: 1000, storeId: insertedStores[0].id },
      { name: "pizza sm", price: 2500, storeId: insertedStores[1].id },
      { name: "pizza md", price: 3500, storeId: insertedStores[1].id },
      { name: "pizza lg", price: 4500, storeId: insertedStores[1].id },
      { name: "shawrma", price: 1000, storeId: insertedStores[1].id },
    ])
    .returning();

  await db.insert(orders).values([
    {
      customerName: "ahamad",
      address: "ranya",
      phone: "0750000000",
      item: [
        {
          productId: insertedProducts[0].id,
          qty: 2,
          price: insertedProducts[0].price,
        },
        {
          productId: insertedProducts[1].id,
          qty: 1,
          price: insertedProducts[1].price,
        },
      ],
      storeId: insertedStores[0].id,
    },
    {
      customerName: "ahamad",
      address: "ranya",
      phone: "0750000000",
      item: [
        {
          productId: insertedProducts[2].id,
          qty: 1,
          price: insertedProducts[2].price,
        },
      ],
      storeId: insertedStores[0].id,
    },
    {
      customerName: "mhamad",
      address: "ranya",
      phone: "0770000000",
      item: [
        {
          productId: insertedProducts[4].id,
          qty: 1,
          price: insertedProducts[4].price,
        },
      ],
      storeId: insertedStores[1].id,
    },
  ]);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

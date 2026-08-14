import { integer, pgTable, timestamp, varchar, json, boolean, PgEnum, pgEnum, primaryKey } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).unique().notNull(),
  passwordHash: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  modifiedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp(),
})

export const stores = pgTable("stores", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  city: varchar({ length: 255 }).notNull(),
  isActive: boolean().default(true).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  modifiedAt: timestamp(),
  deletedAt: timestamp(),
})

export const products = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  price: integer().notNull(),
  isAvailable: boolean().default(true).notNull(),
  storeId: integer()
    .references(() => stores.id)
    .notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  modifiedAt: timestamp(),
  deletedAt: timestamp(),
})

//orders from here
export const orderStatusEnum = pgEnum("order_status", ["pending", "accepted", "preparing", "out_for_delivery", "delivered", "cancelled"])

export const orderItems = pgTable("order_items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer()
    .references(() => orders.id)
    .notNull(),
  productId: integer()
    .references(() => products.id)
    .notNull(),
  qty: integer().notNull(),
  price: integer().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  modifiedAt: timestamp(),
  deletedAt: timestamp(),
})

export const orders = pgTable("orders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  customerName: varchar({ length: 255 }).notNull(),
  phone: varchar({ length: 255 }).notNull(),
  address: varchar({ length: 255 }).notNull(),
  storeId: integer()
    .references(() => stores.id)
    .notNull(),
  item: json().notNull(),
  status: orderStatusEnum().default("pending").notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  modifiedAt: timestamp(),
  deletedAt: timestamp(),
})

import { pgTable, serial, text, integer, timestamp, varchar, doublePrecision } from 'drizzle-orm/pg-core';

// Menu Items Table
export const menuItems = pgTable('menu_items', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description').notNull(),
    price: doublePrecision('price').notNull(),
    imageUrl: text('image_url').notNull(),
});

// Orders Table
// Statuses: Received, Preparing, OutForDelivery, Delivered
export const orders = pgTable('orders', {
    id: serial('id').primaryKey(),
    customerName: varchar('customer_name', { length: 255 }).notNull(),
    customerEmail: varchar('customer_email', { length: 255 }).notNull(),
    customerAddress: text('customer_address').notNull(),
    customerPhone: varchar('customer_phone', { length: 50 }).notNull(),
    status: varchar('status', { length: 50 }).default('Received').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Order Items Table (Many-to-Many junction essentially)
export const orderItems = pgTable('order_items', {
    id: serial('id').primaryKey(),
    orderId: integer('order_id').references(() => orders.id).notNull(),
    menuItemId: integer('menu_item_id').references(() => menuItems.id).notNull(),
    quantity: integer('quantity').notNull(),
});

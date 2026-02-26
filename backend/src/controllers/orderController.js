import { db } from '../config/db.js';
import { orders, orderItems, menuItems } from '../models/schema.js';
import { eq, inArray } from 'drizzle-orm';
import { sendOrderUpdateEmail } from '../../email/emails.js';

export const createOrder = async (req, res) => {
    try {
        // Body is already validated by Zod middleware
        const { customerName, customerEmail, customerAddress, customerPhone, items } = req.body;

        // Insert order
        const [newOrder] = await db.insert(orders).values({
            customerName,
            customerEmail,
            customerAddress,
            customerPhone,
            status: 'Received',
        }).returning();

        // Insert order items
        const orderItemsData = items.map((item) => ({
            orderId: newOrder.id,
            menuItemId: item.id,
            quantity: item.quantity,
        }));

        await db.insert(orderItems).values(orderItemsData);

        // Fetch full item details for the email receipt
        const itemIds = items.map(i => i.id);
        const dbItems = await db.select().from(menuItems).where(inArray(menuItems.id, itemIds));

        // Compute total amount for the email using prices from the database
        const totalAmount = items.reduce((sum, suppliedItem) => {
            const dbItem = dbItems.find(i => i.id === suppliedItem.id);
            const price = dbItem ? dbItem.price : 0;
            return sum + (price * suppliedItem.quantity);
        }, 0);

        // Build the email data object matching ORDER_UPDATE_TEMPLATE expectations
        const orderDetails = {
            customerName: newOrder.customerName,
            orderId: newOrder.id,
            orderStatus: newOrder.status,
            totalAmount: totalAmount.toFixed(2),
        };

        // Fire off email notification (asynchronously without awaiting if you prefer to not block the request)
        sendOrderUpdateEmail(newOrder.customerEmail, orderDetails).catch(e => console.error("Email failed:", e));

        res.status(201).json({ message: 'Order placed successfully', orderId: newOrder.id });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getOrderStatus = async (req, res) => {
    try {
        const orderId = parseInt(req.params.id, 10);
        const [order] = await db.select().from(orders).where(eq(orders.id, orderId));

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        // Body is validated by Zod
        const orderId = parseInt(req.params.id, 10);
        const { status } = req.body;

        const [updatedOrder] = await db
            .update(orders)
            .set({ status })
            .where(eq(orders.id, orderId))
            .returning();

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

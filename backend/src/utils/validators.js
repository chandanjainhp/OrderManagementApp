import { z } from 'zod';

export const createOrderSchema = z.object({
    customerName: z.string().min(1, 'Name is required').max(255),
    customerEmail: z.string().email('Invalid email address'),
    customerAddress: z.string().min(1, 'Address is required'),
    customerPhone: z.string().min(1, 'Phone number is required').max(50),
    items: z.array(
        z.object({
            id: z.number().positive(),
            quantity: z.number().int().positive(),
        })
    ).min(1, 'At least one item is required in the order'),
});

export const updateOrderStatusSchema = z.object({
    status: z.enum(['Received', 'Preparing', 'OutForDelivery', 'Delivered']),
});

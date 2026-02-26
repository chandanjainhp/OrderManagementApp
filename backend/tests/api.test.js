import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { db, connectDB, client } from '../src/config/db.js';
import { menuItems } from '../src/models/schema.js';

describe('API Endpoints Integration Tests', () => {
    let validItemId = 1;

    beforeAll(async () => {
        await connectDB(); // Establish PG connection

        // Fetch a valid menu item ID dynamically so the test passes regardless of the current seed sequence
        const items = await db.select().from(menuItems).limit(1);
        if (items.length > 0) {
            validItemId = items[0].id;
        }
    });

    afterAll(async () => {
        await client.end(); // Clean up DB connection after tests
    });

    it('GET /api/menu should return a 200 OK and a list of items', async () => {
        const res = await request(app).get('/api/menu');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        // We know we seeded 10 items, so verify length if not empty
        if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('name');
            expect(res.body[0]).toHaveProperty('price');
        }
    });

    it('POST /api/orders should reject invalid payloads (Zod validation)', async () => {
        const res = await request(app).post('/api/orders').send({
            customerName: '', // Missing name
            customerEmail: 'invalid-email', // Invalid email format
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('details');
    });

    it('POST /api/orders should successfully create an order with valid data', async () => {
        const res = await request(app).post('/api/orders').send({
            customerName: 'Test Automation Customer',
            customerEmail: 'test.automation@example.com',
            customerAddress: '123 Test St, Automation City',
            customerPhone: '9999999999',
            items: [{ id: validItemId, quantity: 2 }]
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('orderId');
        expect(res.body.message).toBe('Order placed successfully');
    });

    it('GET /api/orders/:id should retrieve the freshly created order', async () => {
        // First create an order
        const createRes = await request(app).post('/api/orders').send({
            customerName: 'Fetch Test Customer',
            customerEmail: 'fetch.automation@example.com',
            customerAddress: '456 Fetch St',
            customerPhone: '8888888888',
            items: [{ id: validItemId, quantity: 1 }]
        });

        const newOrderId = createRes.body.orderId;
        expect(newOrderId).toBeDefined();

        // Then fetch it
        const fetchRes = await request(app).get(`/api/orders/${newOrderId}`);
        expect(fetchRes.statusCode).toBe(200);
        expect(fetchRes.body.customerName).toBe('Fetch Test Customer');
        expect(fetchRes.body.status).toBe('Received');
    });
});


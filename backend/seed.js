// file: seed.js
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { menuItems, orderItems, orders } from './src/models/schema.js';
import 'dotenv/config';

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    console.log('Connecting to database...');
    await client.connect();
    const db = drizzle(client);

    console.log('Seeding database with menu items...');

    const initialData = [
        {
            name: 'Idli (2 pcs)',
            description: 'Soft, fluffy steamed rice and lentil cakes. Served with sambar and chutney.',
            price: 40.00,
            imageUrl: 'https://images.openai.com/static-rsc-3/ENn0LNjjFlhNOsXS40lCgu948dNC5GVUhu8EfbjV4d1mmNpZroaii0cOvDe01mUImRJ--spvuOgVzOeu0BfgjC-rxAdT2Z_Q7zASAE5fNZU?purpose=fullsize&v=1',
        },
        {
            name: 'Dosa (Plain)',
            description: 'Thin, crispy crepe made from a fermented batter of lentils and rice.',
            price: 60.00,
            imageUrl: 'https://images.openai.com/static-rsc-3/U-yQKSt9_cpVxTymGrBtMbu0C6RxOUPjZpDoibQ9UyTPDAyYW1W-CKJp8y6Vn3YkANuSIZngpL0BK1rOGHRSCkcZlabDvQ6-02f8VcM5WIE?purpose=fullsize&v=1',
        },
        {
            name: 'Masala Dosa',
            description: 'Crispy rice crepe stuffed with a mildly spiced, flavorful mashed potato filling.',
            price: 90.00,
            imageUrl: 'https://images.openai.com/static-rsc-3/AuA9qF4Lnp-sUwQ2437L9KdzoQQd0-tQY9vwuEDuLGSkVw4np48S91HPMXlCUJRJkSrwTK-H0iIpagTv-JBUdb5zNShjO_qnHv2trDuNxuU?purpose=fullsize&v=1',
        },
        {
            name: 'Vada (2 pcs)',
            description: 'Crispy on the outside, soft on the inside, deep-fried savory lentil donuts.',
            price: 50.00,
            imageUrl: 'https://images.openai.com/static-rsc-3/bTd6Tp68ugAunCuJv4kg-iz5hYIJl83wmUbN3FLFo5NLaAIWRJc78Gjjps6b6AYUo7btz1MoQII_ODbK1i_FPbkTu-OkQU5f16rbMLSu7K4?purpose=fullsize&v=1',
        },
        {
            name: 'Sambar Rice',
            description: 'Comforting mix of rice and traditional lentil stew cooked with fresh vegetables.',
            price: 80.00,
            imageUrl: 'https://images.openai.com/static-rsc-3/pfjXMZO6DzTJqS23n5kPqt4OgaAPzpf_bJ2dwp8ESG5syLHy1sJrzWHRarabO0yhnmNkFKDRIyEKNfoGJILGA8tOt9xlWMjLo4LaOVKYYdU?purpose=fullsize&v=1',
        },
        {
            name: 'Meals (Full)',
            description: 'A traditional South Indian thali featuring rice, sambar, rasam, curries, and papad.',
            price: 150.00,
            imageUrl: 'https://images.openai.com/static-rsc-3/hJrFyPP-41gv1qu86v1qQ8NjHwIr47Gr6z6lKgTKmCz4kmaXc8KYca7hDruMF7rQaPZRPEe5O-ZWcDU3EUwRHvuJd-KmRM_z_1L1Cs6QHvM?purpose=fullsize&v=1',
        },
        {
            name: 'Biryani',
            description: 'Aromatic basmati rice cooked with authentic spices and fresh herbs.',
            price: 220.00,
            imageUrl: 'https://images.openai.com/static-rsc-3/D3nfvIFbwHQ9-WJ4XAmn4wY2wFk6GV9Qzj3jhPpadWh6mVbyGI4f1XNpu1knQWeBXLJUKM_1BKV0QPfWGAoW_YJ_xcTYntro0I52lIrTkQ0?purpose=fullsize&v=1',
        },
        {
            name: 'Pongal',
            description: 'Savory rice and lentil porridge tempered with cumin, black pepper, and pure ghee.',
            price: 60.00,
            imageUrl: 'https://images.openai.com/static-rsc-3/cMaiF4L0Zyq7gMGiSW8cPvmQOLolaXRtR3shlSP1YsC-U48HdXzInq9urCGp_q7yKGbWTQJV-sP9ywX1AEBC-tJxo2HEo4V7UvJA2-EVHpo?purpose=fullsize&v=1',
        },
        {
            name: 'Payasam',
            description: 'Traditional festive sweet pudding made with milk, jaggery, and roasted nuts.',
            price: 70.00,
            imageUrl: 'https://images.openai.com/static-rsc-3/q-gF5uKurYjHeAQh5mKJ4jzoA-IGv92TKMjfn8kDG77ZxovE_YzgwNJcG3RFgDTfJrewCHWuMxGBceA4YAqSeF6EUjEv5NrI7P0iryGqtuY?purpose=fullsize&v=1',
        },
        {
            name: 'Filter Coffee',
            description: 'Strong, frothy, and authentic traditional South Indian filter coffee.',
            price: 30.00,
            imageUrl: 'https://images.openai.com/static-rsc-3/neB92CGQsqfHAtI-0RZkVtT7J9TbMgLrMlV2u5_0ByPa3W_mZLt8puIQW7xYiTPzN_435ExMuJErPZnDTPk8LI4IXg9C53EUIHBCvEOirlA?purpose=fullsize&v=1',
        }
    ];

    try {
        console.log('Clearing existing order data...');
        await db.delete(orderItems);
        await db.delete(orders);
        console.log('Clearing existing menu items...');
        await db.delete(menuItems); // Clear old pizza/burger data

        console.log('Inserting new spice data...');
        for (const item of initialData) {
            await db.insert(menuItems).values(item);
        }
        console.log('Seeding complete!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await client.end();
    }
}

main();

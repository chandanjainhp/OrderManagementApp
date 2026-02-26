import { db } from '../config/db.js';
import { menuItems } from '../models/schema.js';

export const getMenu = async (req, res) => {
    try {
        const items = await db.select().from(menuItems);
        res.json(items);
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

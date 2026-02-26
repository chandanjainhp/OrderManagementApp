import { Router } from 'express';
import { createOrder, getOrderStatus, updateOrderStatus } from '../controllers/orderController.js';
import { validate } from '../middlewares/validate.js';
import { createOrderSchema, updateOrderStatusSchema } from '../utils/validators.js';

const router = Router();

router.post('/', validate(createOrderSchema), createOrder);
router.get('/:id', getOrderStatus);
router.patch('/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);

export default router;

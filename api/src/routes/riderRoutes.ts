import { Router } from 'express';
import { getAssignedOrders, updateOrderStatus } from '../controllers/riderController';
import { authenticateJWT, requireRole } from '../middlewares/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/my-deliveries', requireRole(['RIDER']), getAssignedOrders);
router.patch('/orders/:id/status', requireRole(['RIDER', 'ADMIN']), updateOrderStatus);

export default router;

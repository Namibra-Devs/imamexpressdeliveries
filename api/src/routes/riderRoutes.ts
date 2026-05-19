import { Router } from 'express';
import { getAssignedOrders, updateOrderStatus, getDashboardStats } from '../controllers/riderController';
import { authenticateJWT, requireRole } from '../middlewares/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/dashboard-stats', requireRole(['RIDER']), getDashboardStats);
router.get('/my-deliveries', requireRole(['RIDER']), getAssignedOrders);
router.patch('/orders/:id/status', requireRole(['RIDER', 'ADMIN']), updateOrderStatus);

export default router;

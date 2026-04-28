import { Router } from 'express';
import { getDashboardMetrics, getAllOrders, assignRider, getRiders, getCustomers, updatePricing } from '../controllers/adminController';
import { authenticateJWT, requireRole } from '../middlewares/auth';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole(['ADMIN']));

router.get('/dashboard', getDashboardMetrics);
router.get('/orders', getAllOrders);
router.post('/orders/assign', assignRider);
router.get('/riders', getRiders);
router.get('/customers', getCustomers);
router.patch('/pricing', updatePricing);

export default router;

import { Router } from 'express';
import { subscribeNewsletter, submitContactForm } from '../controllers/publicController';

const router = Router();

router.post('/newsletter', subscribeNewsletter);
router.post('/contact', submitContactForm);

export default router;

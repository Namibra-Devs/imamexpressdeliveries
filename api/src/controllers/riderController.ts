import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/auth';
import { OrderStatus } from '@prisma/client';

export const getAssignedOrders = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const riderId = req.user.userId;
    const orders = await prisma.order.findMany({
      where: { riderId },
      orderBy: { updatedAt: 'desc' }
    });

    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching assigned orders', error: error.message });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    const riderId = req.user.userId;

    if (!Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    if (order.riderId !== riderId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: You are not assigned to this order' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.json({ message: 'Order status updated', order: updatedOrder });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

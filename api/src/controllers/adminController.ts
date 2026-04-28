import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/auth';
import { OrderStatus } from '@prisma/client';

export const getDashboardMetrics = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const totalDeliveries = await prisma.order.count({ where: { status: 'DELIVERED' } });
    
    const revenueResult = await prisma.order.aggregate({
      _sum: { price: true },
      where: { status: 'DELIVERED' }
    });
    const totalRevenue = revenueResult._sum.price || 0;

    const activeRiders = await prisma.user.count({
      where: { role: 'RIDER' } // We can enhance this later to check if they have active orders
    });

    res.json({ totalDeliveries, totalRevenue, activeRiders });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching metrics', error: error.message });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: { select: { name: true, email: true } },
        rider: { select: { name: true, phone: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

export const assignRider = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { orderId, riderId } = req.body;
    
    const rider = await prisma.user.findFirst({ where: { id: riderId, role: 'RIDER' } });
    if (!rider) return res.status(404).json({ message: 'Rider not found' });

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { riderId, status: OrderStatus.ASSIGNED }
    });

    res.json({ message: 'Rider assigned successfully', order });
  } catch (error: any) {
    res.status(500).json({ message: 'Error assigning rider', error: error.message });
  }
};

export const getRiders = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const riders = await prisma.user.findMany({ where: { role: 'RIDER' } });
    res.json({ riders });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching riders', error: error.message });
  }
};

export const getCustomers = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const customers = await prisma.user.findMany({ where: { role: 'CUSTOMER' } });
    res.json({ customers });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
};

export const updatePricing = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { baseRate, perKmRate, expressMultiplier } = req.body;
    let pricing = await prisma.pricingConfig.findFirst();
    
    if (pricing) {
      pricing = await prisma.pricingConfig.update({
        where: { id: pricing.id },
        data: { baseRate, perKmRate, expressMultiplier }
      });
    } else {
      pricing = await prisma.pricingConfig.create({
        data: { baseRate, perKmRate, expressMultiplier }
      });
    }

    res.json({ message: 'Pricing updated successfully', pricing });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating pricing', error: error.message });
  }
};

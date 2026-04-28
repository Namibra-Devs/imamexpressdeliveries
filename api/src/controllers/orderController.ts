import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/auth';

// Utility to calculate dummy distance and price
const calculatePrice = (distance: number, baseRate: number, perKmRate: number) => {
  return baseRate + (distance * perKmRate);
};

export const createOrder = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { pickupLocation, dropoffLocation, receiverName, receiverContact, packageDescription } = req.body;
    const customerId = req.user.userId;

    // Fetch pricing config (use first one or defaults)
    let pricing = await prisma.pricingConfig.findFirst();
    if (!pricing) {
      pricing = await prisma.pricingConfig.create({ data: {} }); // Creates with default values
    }

    // Dummy distance calculation between 2 and 20 km for estimation
    const distance = Math.floor(Math.random() * 18) + 2; 
    const price = calculatePrice(distance, pricing.baseRate, pricing.perKmRate);

    const order = await prisma.order.create({
      data: {
        pickupLocation,
        dropoffLocation,
        receiverName,
        receiverContact,
        packageDescription,
        price,
        distance,
        customerId
      }
    });

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

export const getCustomerOrders = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const customerId = req.user.userId;
    const orders = await prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        rider: { select: { name: true, phone: true } }
      }
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ order });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

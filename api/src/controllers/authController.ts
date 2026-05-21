import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../prisma';
import { sendVerificationEmail } from '../utils/mailer';

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, name, phone, role, homeAddress, workAddress } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Validate Ghana phone number
    const ghanaPhoneRegex = /^(?:\+233|0)[235][0-9]{8}$/;
    if (!ghanaPhoneRegex.test(phone.replace(/\s+/g, ''))) {
      return res.status(400).json({ message: 'Phone number must be a valid Ghana number' });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    const passwordSpecialRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!passwordSpecialRegex.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one special character' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        homeAddress,
        workAddress,
        role: role || 'CUSTOMER',
        verificationToken,
        verificationTokenExpiresAt,
      },
    });

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.', userId: user.id });
  } catch (error: any) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.emailVerified) {
      return res.status(403).json({ message: 'Please verify your email address before logging in.' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email, profileImage: user.profileImage } });
  } catch (error: any) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<any> => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token as string },
    });

    if (!user) {
      return res.status(404).json({ message: 'Invalid verification token' });
    }

    if (user.verificationTokenExpiresAt && user.verificationTokenExpiresAt < new Date()) {
      return res.status(400).json({ message: 'Verification token has expired' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
    });

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error verifying email', error: error.message });
  }
};

export const resendVerification = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken, verificationTokenExpiresAt },
    });

    await sendVerificationEmail(email, verificationToken);

    res.json({ message: 'Verification email resent successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error resending verification email', error: error.message });
  }
};

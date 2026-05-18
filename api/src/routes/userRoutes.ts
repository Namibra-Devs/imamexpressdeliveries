import { Router } from 'express';
import { getProfile, updateProfile, changePassword, uploadProfileImage } from '../controllers/userController';
import { authenticateJWT } from '../middlewares/auth';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/profiles/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const router = Router();

router.get('/profile', authenticateJWT, getProfile);
router.put('/profile', authenticateJWT, updateProfile);
router.put('/change-password', authenticateJWT, changePassword);
router.post('/upload-profile-image', authenticateJWT, upload.single('profileImage'), uploadProfileImage);

export default router;

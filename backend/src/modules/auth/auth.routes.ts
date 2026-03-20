import { Router } from 'express';
import { 
  register, 
  login, 
  refresh, 
  logout, 
  requestProfileUpdate,
  forgotPassword,       
  verifyResetCode, 
  resetPassword,   
  confirmAction         
} from './auth.controller';

const router = Router();

// Rutas existentes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/request-profile-update', requestProfileUpdate);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);
router.post('/confirm-action', confirmAction);

export default router;
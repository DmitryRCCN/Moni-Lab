import { Router } from 'express';
import { mailController } from './mail.controller';

const router = Router();

router.post('/test', mailController.sendTest);
router.post('/welcome', mailController.sendWelcome);
router.get('/tutor-reports', mailController.sendTutorReports);

export default router;
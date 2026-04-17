import { Router } from 'express';
import { mailController } from './mail.controller';

const router = Router();

router.post('/test', mailController.sendTest);
router.post('/welcome', mailController.sendWelcome);
router.get('/tutor-reports', mailController.sendTutorReports);

// Rutas de preview (sin necesidad de enviar realmente) // BORRAR DESPUES DE PRUEBAS
router.get('/preview/:type', (req, res) => mailController.previewEmail(req, res)); // BORRAR DESPUES DE PRUEBAS
router.get('/preview', (req, res) => mailController.indexPreviews(req, res)); // BORRAR DESPUES DE PRUEBAS

export default router;
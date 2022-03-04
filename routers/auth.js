import { Router } from 'express';
import { registar, autenticar, confirmar } from '../controllers/auth/authController.js';
import { olvidePassword, comprobarToken, nuevoPassword } from '../controllers/auth/resetPasswordController.js';


// Path de este router -> /api/auth
const router = Router();


// Autentificacion.
router.post('/', registar);
router.post('/login', autenticar);
router.get('/confirmar/:token', confirmar);

// Reset Password
router.post('/olvide-password', olvidePassword);

router.route('/olvide-password/:token')
    .get(comprobarToken)
    .post(nuevoPassword);




export default router;
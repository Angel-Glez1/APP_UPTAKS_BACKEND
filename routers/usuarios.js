import { Router } from 'express';
import { getPerfil } from '../controllers/usuarioController.js';
import checkAuth from '../middlewares/checkAuth.js';

// Path del router => /api/user
const router = Router();

router.get('/', checkAuth, getPerfil);




export default router;



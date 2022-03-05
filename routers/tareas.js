import { Router } from 'express';
import {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado,
} from '../controllers/tareasController.js'
import checkAuth from '../middlewares/checkAuth.js';


// Path de este router => /api/tareas
const router = Router();

router.use(checkAuth);

router.post('/', agregarTarea);

router.route('/:id')
    .get(obtenerTarea)
    .put(actualizarTarea)
    .delete(eliminarTarea);

router.post('/estado/:id', cambiarEstado);


export default router;



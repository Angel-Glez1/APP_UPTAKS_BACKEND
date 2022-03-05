import { Router } from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    obtenerTareas,
} from '../controllers/proyectoController.js';


// Path del router => /api/proyecto
const router = Router();


router.use(checkAuth); // con esto le agregamos el middleware de autentificacion a todas la rutas


router.route('/')
    .get(obtenerProyectos)
    .post(nuevoProyecto);


router.route('/:id')
    .get(obtenerProyecto)
    .put(editarProyecto)
    .delete(eliminarProyecto);


router.get('/tareas', obtenerTareas);
router.post('/agregar-colaborador', agregarColaborador);
router.post('/eliminar-colaborador/:id', eliminarColaborador);



export default router;
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
    buscarColaborador,
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


router.post('/colaboradoresSearch', buscarColaborador );
router.post('/colaboradores-eliminar/:id', eliminarColaborador);
router.post('/colaboradores/:id', agregarColaborador);



export default router;
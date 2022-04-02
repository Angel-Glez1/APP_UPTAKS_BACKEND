import { request, response } from 'express';
import { Proyecto, Tarea } from '../models/index.js';



const agregarTarea = async (req = request, res = response) => {

    const { body, usuario } = req;
    const { nombre, descripcion, prioridad, proyecto } = body;


    const existsDoc = await Proyecto.findById(proyecto);

    if (!existsDoc) {
        const e = new Error('No exite Proyecto');
        return res.status(404).json({ msg: e.message });
    }


    if (existsDoc.creador.toString() !== usuario._id.toString()) {
        const e = new Error('No cuentas con los permisos, para esta accion');
        return res.status(403).json({ msg: e.message });
    }


    try {

        // Almacenar la tarea
        const tarea = await Tarea.create({ nombre, descripcion, prioridad, proyecto });

        // Almacenar el id de la tarea al proyecto
        existsDoc.tareas.push(tarea._id);
        await existsDoc.save();

        return res.json(tarea);


    } catch (error) {
        console.log(error);
        const e = new Error('Error 500! Algo salio mal al momento de crear la tarea.');
        return res.status(500).json({ msg: e.message });
    }





}

const obtenerTarea = async (req = request, res = response) => {

    const { params, usuario } = req;
    const { id } = params;


    const tarea = await Tarea.findById(id).populate('proyecto');

    if (!tarea) {
        const e = new Error('No exite Proyecto');
        return res.status(404).json({ msg: e.message });
    }


    if (tarea.proyecto.creador.toString() !== usuario._id.toString()) {
        const e = new Error('No cuentas con los permisos, para esta accion');
        return res.status(403).json({ msg: e.message });
    }

    res.json(tarea);


}

const actualizarTarea = async (req = request, res = response) => {


    const { params, usuario } = req;
    const { id } = params;


    const tarea = await Tarea.findById(id).populate('proyecto');

    if (!tarea) {
        const e = new Error('No exite Proyecto');
        return res.status(404).json({ msg: e.message });
    }


    if (tarea.proyecto.creador.toString() !== usuario._id.toString()) {
        const e = new Error('No cuentas con los permisos, para esta accion');
        return res.status(403).json({ msg: e.message });
    }

    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;


    try {

        const tareaUpdated = await tarea.save();
        return res.json(tareaUpdated)

    } catch (error) {
        console.log(object);

    }
}

const eliminarTarea = async (req = request, res = response) => {


    const { params, usuario } = req;
    const { id } = params;


    const tarea = await Tarea.findById(id).populate('proyecto');

    if (!tarea) {
        const e = new Error('No exite Proyecto');
        return res.status(404).json({ msg: e.message });
    }


    if (tarea.proyecto.creador.toString() !== usuario._id.toString()) {
        const e = new Error('No cuentas con los permisos, para esta accion');
        return res.status(403).json({ msg: e.message });
    }

    try {

        const proyecto = await Proyecto.findById(tarea.proyecto);
        await Promise.allSettled([await proyecto.tareas.pull(tarea._id), await tarea.deleteOne()]);

        res.json({ msg: 'Tarea eliminada' });

    } catch (error) {
        console.log(error);
    }
}

const cambiarEstado = async (req = request, res = response) => {

    const { id } = req.params;

    const tarea = await Tarea.findById(id).populate('proyecto');
    if (!tarea) {
        const e = new Error('No exite Proyecto');
        return res.status(404).json({ msg: e.message });
    }

    // Validar que el proyecto le pertenesca al creador o un colaborador
    if (
        tarea.proyecto.creador.toString() !== req.usuario._id.toString()
        &&
        !tarea.proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())
    ) {
        const e = new Error('Accion no valida...');
        return res.status(401).json({ msg: e.message });
    }


    tarea.estado = !tarea.estado;
    tarea.completo = req.usuario._id
    await tarea.save();

    const tareaAlmacenada = await Tarea.findById(id).populate('proyecto').populate('completo', 'nombre');

    res.json(tareaAlmacenada);
}

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado,
}


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


        const tarea = await Tarea.create({ nombre, descripcion, prioridad, proyecto });
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

        await tarea.deleteOne();
        res.json({ msg: 'Tarea eliminada' });

    } catch (error) {
        console.log(error);
    }
}

const cambiarEstado = async (req = request, res = response) => { }

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado,
}


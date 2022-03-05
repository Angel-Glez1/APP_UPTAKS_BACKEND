import { request, response } from 'express';
import { Proyecto, Tarea } from '../models/index.js';



const obtenerProyectos = async (req = request, res = response) => {

    const { _id } = req.usuario;

    try {

        const proyectos = await Proyecto.find({ creador: _id });
        return res.json(proyectos);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error 500! Hubeo un problema al obtener los proyectos' });
    }

}

const nuevoProyecto = async (req = request, res = response) => {

    const { usuario } = req;
    const { nombre, descripcion, cliente } = req.body;

    try {

        const doc = new Proyecto({ nombre, descripcion, cliente, creador: usuario._id });
        const proyecto = await doc.save();

        return res.json(proyecto);


    } catch (error) {

        console.log(error);
        const e = new Error('Error 500! Hubeo un problema al obtener los proyectos');
        return res.status(500).json({ msg: e.message });
    }


}

const obtenerProyecto = async (req = request, res = response) => {

    const { id } = req.params;

    try {

        const proyecto = await Proyecto.findById(id);

        if (!proyecto) {
            const e = new Error('Recurso no encontrado');
            return res.status(404).json({ msg: e.message });
        }


        if (proyecto.creador.toString() !== req.usuario._id.toString()) {

            const e = new Error('Accion no valida');
            return res.status(401).json({ msg: e.message });
        }


        // Obtener la tareas del proyecto
        const tareas = await Tarea.find().where('proyecto').equals(proyecto._id);


        return res.json({
            proyecto,
            tareas
        });

    } catch (error) {

        console.log(error);

        const e = new Error('Error 500! Hubeo un problema al obtener los proyectos');
        return res.status(500).json({ msg: e.message });
    }
}

const editarProyecto = async (req = request, res = response) => {

    const { id } = req.params;
    const { creador, colaboradores, ...data } = req.body;

    try {

        const doc = await Proyecto.findById(id);

        if (!doc) {
            const e = new Error('Recurso no encontrado');
            return res.status(404).json({ msg: e.message });
        }

        if (doc.creador.toString() !== req.usuario._id.toString()) {
            const e = new Error('Accion no valida');
            return res.status(401).json({ msg: e.message });
        }


        const proyecto = await Proyecto.findByIdAndUpdate(id, data, { new: true });
        return res.json(proyecto);

    } catch (error) {

        console.log(error);
        const e = new Error('Error 500! Hubo un error al querer actulizar el proyecto');
        return res.status(500).json({ msg: e.message });

    }

}

const eliminarProyecto = async (req = request, res = response) => {


    const { id } = req.params;

    try {

        const doc = await Proyecto.findById(id);

        if (!doc) {
            const e = new Error('Recurso no encontrado');
            return res.status(404).json({ msg: e.message });
        }

        if (doc.creador.toString() !== req.usuario._id.toString()) {
            const e = new Error('Accion no valida');
            return res.status(401).json({ msg: e.message });
        }


        await Proyecto.deleteOne();
        return res.json({ msg: 'Proyecto eliminado' });

    } catch (error) {

        console.log(error);
        const e = new Error('Error 500! Hubo un error al querer elimiar proyecto');
        return res.status(500).json({ msg: e.message });

    }

}

const agregarColaborador = async (req = request, res = response) => { }

const eliminarColaborador = async (req = request, res = response) => { }

const obtenerTareas = async (req = request, res = response) => { }


export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    obtenerTareas,
}


import { request, response } from 'express';
import { Proyecto, Tarea, Usuario } from '../models/index.js';



const obtenerProyectos = async (req = request, res = response) => {

    try {

        const proyectos = await Proyecto.find({
            $or: [
                { colaboradores: { $in: req.usuario._id } },
                { creador: { $in: req.usuario._id } }
            ]
        }).select('-tareas');

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

        const proyecto = await Proyecto.findById(id)
            .populate({
                path: 'tareas', populate: {path: 'completo', select: 'nombre'}
            })
            .populate('colaboradores', 'nombre email _id');


        if (!proyecto) {
            const e = new Error('Recurso no encontrado');
            return res.status(404).json({ msg: e.message });
        }

        // Validar que el proyecto le pertenesca al creador o un colaborador
        if (
            proyecto.creador.toString() !== req.usuario._id.toString()
            &&
            !proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())
        ) {
            const e = new Error('Accion no valida...');
            return res.status(401).json({ msg: e.message });
        }


        return res.json(proyecto);

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

const buscarColaborador = async (req = request, res = response) => {

    const { email } = req.body;

    const usuario = await Usuario.findOne({ email }).select('nombre _id email');

    if (!usuario) {
        res.status(404).json({ msg: 'Usuario no encontrado' });
        return;
    }

    res.json(usuario);

}

const agregarColaborador = async (req = request, res = response) => {

    const { params, body, usuario } = req;
    const { email } = body;

    // Validar que el proyecto exita  
    const proyecto = await Proyecto.findById(params.id);
    if (!proyecto) {
        res.status(404).json({ msg: 'Proyecto no encontrado' });
        return;
    }

    // Validar que sea el creador el que esta agregando un colaborador
    if (usuario._id.toString() !== proyecto.creador.toString()) {
        res.status(403).json({ msg: 'Accion no valida' });
        return;
    }


    // Validar que exita el colaborador que se desea agregar.
    const user = await Usuario.findOne({ email }).select('nombre _id email');
    if (!user) {
        res.status(404).json({ msg: 'Usuario no encontrado' });
        return;
    }

    // Validar que no sea el creador al que se queire agregar.
    if (proyecto.creador.toString() === user._id.toString()) {
        res.status(404).json({ msg: 'El creador del proyecto no puede ser colaborador.' });
        return;
    }


    // Validar si el colaborador ya exite en el proyecto
    if (proyecto.colaboradores.includes(user._id)) {
        res.status(404).json({ msg: 'El usuario ya pertenece al proyecto como colaborador.' });
        return;
    }

    proyecto.colaboradores.push(user._id);
    await proyecto.save();

    res.json({ msg: 'Nuevo Colaborador agregado con exito.' });

}

const eliminarColaborador = async (req = request, res = response) => {

    const { params, body, usuario } = req;


    // Validar que el proyecto exita  
    const proyecto = await Proyecto.findById(params.id);
    if (!proyecto) {
        res.status(404).json({ msg: 'Proyecto no encontrado' });
        return;
    }

    // Validar que sea el creador el que esta agregando un colaborador
    if (usuario._id.toString() !== proyecto.creador.toString()) {
        res.status(403).json({ msg: 'Accion no valida' });
        return;
    }

    proyecto.colaboradores.pull(body.id);
    await proyecto.save();

    res.json({ msg: 'Colaborador eliminado' });

}

const obtenerTareas = async (req = request, res = response) => { }


export {
    buscarColaborador,
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    obtenerTareas,
}


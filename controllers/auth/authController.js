import { response, request } from "express";
import generarID from "../../helpers/generarID.js";
import generarJWT from "../../helpers/generar_JWT.js";
import { Usuario } from '../../models/index.js'



const registar = async (req = request, res = response) => {

    const { nombre, password, email } = req.body;


    const issetEmail = await Usuario.findOne({ email });
    if (issetEmail) {
        const error = new Error('Ya exite un usuario con esas credenciales');
        return res.status(400).json({ msg: error.message });
    }


    try {


        const usuario = new Usuario({ nombre, password, email, token: generarID() });
        const usuarioDB = await usuario.save();

        res.json(usuarioDB);

    } catch (error) {

        console.log(error);
        res.status(500).json({ msg: 'Error 505! No se logro guardar el usuario' });
    }


}


const autenticar = async (req = request, res = response) => {

    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            const e = new Error('El usuario no exite');
            return res.status(404).json({ msg: e.message });
        }

        if (!usuario.confirmado) {
            const e = new Error('Tu cuenta no ha sido confirmada');
            return res.status(403).json({ msg: e.message });
        }


        if (await usuario.comprobarPassword(password)) {

            const token = await generarJWT(usuario._id);

            res.status(200).json({
                _id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                token,
            });

        } else {

            const e = new Error('El password es incorrecto.');
            return res.status(404).json({ msg: e.message });

        }

    } catch (error) {
        console.log(error);

        const e = new Error('Error 500! Algo salio en la autentificacion');
        return res.status(500).json({ msg: e.message });


    }


}


const confirmar = async (req = request, res = response) => {


    const { token } = req.params;

    try {

        const usuario = await Usuario.findOne({ token });
        if (!usuario) {
            const e = new Error('Token invalido');
            return res.status(404).json({ msg: e.message });
        }

        usuario.token = '';
        usuario.confirmado = true;

        await usuario.save();

        return res.status(200).json({ msg: 'Usuario Confirmado' });


    } catch (error) {

        console.log(error);
        const e = new Error('Error 500! Algo salio mal al confirmar la cuenta');
        return res.status(500).json({ msg: e.message });
    }
}


export {
    registar,
    autenticar,
    confirmar
}
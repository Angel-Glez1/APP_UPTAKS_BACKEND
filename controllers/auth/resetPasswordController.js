import { request, response } from 'express';
import generarID from '../../helpers/generarID.js';
import { Usuario } from '../../models/index.js';


const olvidePassword = async (req = request, res = response) => {

    const { email } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        const e = new Error('El usuario no exite');
        return res.status(404).json({ msg: e.message });
    }


    try {

        usuario.token = generarID();
        await usuario.save();
        res.json({ msg: 'Hemos mandado un email con las instrucciones' });

    } catch (error) {

        console.log(error);
        const e = new Error('Error 500! Hubo un error al mandar el email para el reseteo del password')
        return res.status(500).json({ msg: e.message });
    }

}


const comprobarToken = async (req = request, res = response) => {

    const { token } = req.params;




    try {

        const usuario = await Usuario.findOne({ token });
        if (!usuario) {
            const e = new Error('Token invalido');
            return res.status(404).json({ msg: e.message });
        }

        res.json({ msg: 'token valido' });


    } catch (error) {

        console.log(error);
        const e = new Error('Error 500! Hubo un error al mandar el email para el reseteo del password')
        return res.status(500).json({ msg: e.message });
    }

}

const nuevoPassword = async (req = request, res = response) => {

    const { token } = req.params;
    const { password } = req.body;

    try {

        const usuario = await Usuario.findOne({ token });
        if (usuario) {


            usuario.password = password;
            usuario.token = '';
            await usuario.save();

            res.json({ msg: 'Password Modificado Correctamente' });


        } else {
            
            const e = new Error('Token invalido');
            return res.status(404).json({ msg: e.message });
        }


    } catch (error) {

        console.log(error);
        const e = new Error('Error 500! Hubo un error al mandar el email para el reseteo del password')
        return res.status(500).json({ msg: e.message });
    }

}

export {
    olvidePassword,
    comprobarToken,
    nuevoPassword,
}


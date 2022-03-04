import { request, response } from 'express';


const getPerfil = async (req = request, res = response) => {


    const { usuario } = req;

    res.json(usuario);
}


export {
    getPerfil
}
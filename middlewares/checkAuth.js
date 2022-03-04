import JWT from 'jsonwebtoken'
import { Usuario } from '../models/index.js';

const checkAuth = async (req, res, next) => {

    let token;
    const { authorization } = req.headers;

    // Validar que se mande el token y que sea por un bearer
    if (!authorization || !authorization?.startsWith('Bearer')) {
        return res.status(401).json({ ok: false, msg: 'Token no valido' });
    }

    // Extraer JWT del bearer
    token = authorization.split(' ')[1];
    if (!token) {
        const e = new Error('Token invalido');
        return res.status(401).msg({ msg: e.message });
    }

    try {

        // Obtener la informacion del JWT.
        const decoded = JWT.verify(token, process.env.SECRET_KEY)

        //TODO:: Crear un "session" en la request para acceder la informacion del usurio mas adelante
        req.usuario = await Usuario.findById(decoded.id).select("_id nombre email");

    } catch (error) {

        return res.status(401).json({ msg: 'Sin Autorizacion' });
    }


    next();
}

export default checkAuth
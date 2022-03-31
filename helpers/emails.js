import nodemailer from 'nodemailer';



export const emailRegistro = async ({ email, nombre, token }) => {


    const transport = nodemailer.createTransport({
        host: process.env.STMP_HOST,
        port: process.env.STMP_PORT,
        auth: {
            user: process.env.STMP_USER,
            pass: process.env.STMP_PASSWORD
        }

    });

    // Informacion del email
    const info = await transport.sendMail({
        from: 'uptaks-adminastrados-proyectos@uptaks.com',
        to: email,
        subject: 'Uptaks-Confirma tu cuenta',
        text: 'Confirma tu cuenta en updtaks',
        html: `
            <p>Hola ${nombre}. Comprueba tu cuenta en Uptkas</p>
            <p>
                Tu cuenta ya esta casi lista, solo debes comprobarla en el
                siguiente enlace
            </p>
            <a href="${process.env.FRONTEND_URL}/confirmar-cuenta/${token}">Comprueba tu cuenta</a>

            <p><b>SI TU NO CREASTE ESTA CUENTA, PUEDES IGNORAR EL MENSAJE</b></p>
        `
    });



}


export const emailOlvidePassword = async ({ email, nombre, token }) => {

    // TODO: Mover a .env
    const transport = nodemailer.createTransport({
        host: process.env.STMP_HOST,
        port: process.env.STMP_PORT,
        auth: {
            user: process.env.STMP_USER,
            pass: process.env.STMP_PASSWORD
        }

    });

    // Informacion del email
    const info = await transport.sendMail({
        from: 'uptaks-adminastrados-proyectos@uptaks.com',
        to: email,
        subject: 'Uptaks - Reestablece tu password',
        text: 'Reestablecer tu password',
        html: `
            <p>Hola ${nombre}. Has solicitado reestablecer tu password</p>
            <p> Sigue el siguiente enlace para generar tu nuevo password: </p>
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">
                Reestablecer Password
            </a>
            <p><b>SI TU NO SOLICITASTE REESTABLECER TU PASSWORD, PUEDES IGNORAR EL MENSAJE</b></p>
        `
    });



}
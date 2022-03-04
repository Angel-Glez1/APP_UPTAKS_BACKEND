import JWT from 'jsonwebtoken'

const generarJWT = (id) => {

    return new Promise((res, rej) => {

        if(!id) {
            rej('No se mando la data para el payload');
        }

        
        const paylaod = { id }
        JWT.sign(
            paylaod,
            process.env.SECRET_KEY,
            { expiresIn: '30d' },
            function(error , token) {
                if(error){
                    rej('No se logro generar el JWT');
                }

                res(token);
            }
        );
    });



}


export default generarJWT;
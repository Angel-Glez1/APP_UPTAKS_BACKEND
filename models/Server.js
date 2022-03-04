import express from 'express'
import cors from 'cors'
import conectarDB from '../config/database.js';
import { Auth, User } from '../routers/index.js';



class Server {



    constructor() {
        this.app = express();

        // Config Server...
        this.dominiosPermtidos = [
            'http://localhost:3000'
        ];
        this.path = {
            auth: '/api/auth',
            user: '/api/user',
        }

        // Funciones
        this.connectDDBB();
        this.middleware();
        this.router();
    }

    router() {
        this.app.use(this.path.auth, Auth);
        this.app.use(this.path.user, User);
    }


    middleware() {

        // this.app.use(cors(this.configCors()));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

    }

    async connectDDBB() {
        await conectarDB();
    }



    listen() {
        this.app.set('port', process.env.PORT || 9000);
        this.app.listen(this.app.get('port'), () => {
            console.log(`Servidor corriendo en el puerto ${this.app.get('port')}`);
        })
    }



    configCors() {

        const corsOptions = {
            origin: function (origin, callback) {
                if (this.dominiosPermtidos.indexOf(origin) !== -1) {
                    // El origen de la request es permitido
                    callback(null, true);
                } else {
                    callback(new Error('Request bloqueda por cors'));
                }
            }
        }

        return corsOptions;
    }

}


export default Server;

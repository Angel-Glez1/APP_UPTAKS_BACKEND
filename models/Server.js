import express from 'express'
import cors from 'cors'
import conectarDB from '../config/database.js';
import { Auth, Proyecto, User, Tareas } from '../routers/index.js';



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
            proyecto: '/api/proyecto',
            tareas: '/api/tareas'
        }

        // Funciones
        this.connectDDBB();
        this.middleware();
        this.router();
    }

    router() {
        this.app.use(this.path.auth, Auth);
        this.app.use(this.path.proyecto, Proyecto);
        this.app.use(this.path.user, User);
        this.app.use(this.path.tareas, Tareas);
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
                if (this.dominiosPermtidos.includes(origin)) {

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

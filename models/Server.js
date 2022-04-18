import { Server } from 'socket.io';
import express from 'express'
import cors from 'cors'
import conectarDB from '../config/database.js';
import { Auth, Proyecto, User, Tareas } from '../routers/index.js';
import { createServer } from 'http'



class _Server {



    constructor() {

        this.app = express();
        this.server = createServer(this.app);

        this.oi = new Server(this.server, {
            pingTimeout: 60000,
            cors: {
                origin: 'https://uptaks-glez.netlify.app'
            }
        })

        // Config Server...
        this.dominiosPermtidos = [
            'http://localhost:3000',
            'https://uptaks-glez.netlify.app'
        ];

        this.path = {
            auth: '/api/auth',
            user: '/api/user',
            proyecto: '/api/proyecto',
            tareas: '/api/tareas'
        }

        // Funciones
        this.socket();
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

    socket() {
        this.oi.on('connection', (socket) => {
            // console.log('Conectado a socket');

            socket.on('abrir-proyecto', (proyecto_id) => {
                socket.join(proyecto_id);
            })


            socket.on('nueva-tarea', tarea => {
                const proyecto = tarea.proyecto;
                socket.to(proyecto).emit('tarea-agregada', tarea);
            });

            socket.on('eliminar-tarea', tarea => {
                
                const proyecto = tarea.proyecto;
                socket.to(proyecto).emit('tarea-eliminada', tarea)
            })

            socket.on('update-tarea', tarea => {
                const proyecto = tarea.proyecto._id;
                socket.to(proyecto).emit('tarea-actulizada', tarea)
            });

            socket.on('estado-tarea',  tarea => {
                const proyecto = tarea.proyecto._id;

                socket.to(proyecto).emit('tarea-estado', tarea)
            })


        })
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

        this.server.listen(this.app.get('port'), () => {
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


export default _Server;

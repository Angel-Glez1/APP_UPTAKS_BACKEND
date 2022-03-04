import dotenv from 'dotenv';
import Server from './models/Server.js'

// Configurar varibles de entorno
dotenv.config();

// Iniciar servidor
const server = new Server();
server.listen();











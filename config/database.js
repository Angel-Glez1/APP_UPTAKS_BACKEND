import mongoose from 'mongoose';


const conectarDB = async () => {


    try {

        const connection = await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const URL = `${connection.connection.host} - ${connection.connection.port}`;
        console.log(`MongoDB conectado en ${URL}`);


    } catch (error) {

        console.log(`Error! No se logro conectar a mongoDB ${error.message}`);
        process.exit(1); // Fuerza el proceso y termina la aplicación

    }
}

export default conectarDB;
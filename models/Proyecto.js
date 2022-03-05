import mogoose from 'mongoose'



const proyectoSchema = mogoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true,
    },
    descripcion: {
        type: String,
        trim: true,
        required: true,
    },
    fechaEntrega: {
        type: Date,
        default: Date.now(),
    },
    cliente: {
        type: String,
        trim: true,
        required: true,
    },
    creador: {
        type: mogoose.Schema.Types.ObjectId,
        ref: "Usuario"
    },
    colaboradores: [
        {
            type: mogoose.Schema.Types.ObjectId,
            ref: "Usuario"
        }
    ]
}, { timestamps: true });



const Proyecto = mogoose.model('Proyecto', proyectoSchema);

export default Proyecto;
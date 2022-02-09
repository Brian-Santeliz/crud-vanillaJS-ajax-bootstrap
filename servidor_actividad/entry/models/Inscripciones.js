const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inscripcionesSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
  },
  cedula: {
    type: String,
    required: true,
    unique: true,
  },
  seccionId: {
    type: Schema.Types.ObjectId,
    ref: 'Secciones',
    required: true,
  },
});

module.exports = mongoose.model('Inscripciones', inscripcionesSchema);



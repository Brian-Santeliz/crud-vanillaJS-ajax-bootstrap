const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seccionesSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  horaInicio: {
    type: String,
    required: true,
  },
  dia:{
    type:String,
    required:true
  },
  horaFin: {
    type: String,
    required: true,
  },
  cantidadMaxima: {
    type: Number,
    required: true,
    default: 30,
  },
  cantidadActual: {
    type: Number,
    required: true,
    default: 0,
  },
});
module.exports = mongoose.model('Secciones', seccionesSchema);

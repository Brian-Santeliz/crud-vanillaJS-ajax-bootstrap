const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profesoresSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  edad: {
    type: Number,
    required: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true
  },
  cedula:{
    type: String,
    required: true,
    unique: true
  },
  seccionId: {
    type: Schema.Types.ObjectId,
    ref: 'Secciones',
    required:true
  },
});

module.exports = mongoose.model('Profesores', profesoresSchema);
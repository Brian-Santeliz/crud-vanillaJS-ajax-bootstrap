const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const conectarBd =  require('./config/conexion');
const router = require('./router/index');

const app = express();
app.use(morgan('dev'))
const puerto = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/servidor', router);
app.use('/',express.static(path.join(__dirname, 'public/cliente_actividad')));

app.listen(puerto, mostrarMensja);
async function mostrarMensja() {
  await conectarBd()
    console.log(`Servidor corriendo en el puerto ${puerto}`);
}

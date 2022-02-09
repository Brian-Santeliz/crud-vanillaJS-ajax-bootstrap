const mongoose = require('mongoose');

const conectar = async () => {
    try {
        await mongoose.connect('mongodb://localhost/actividad_1', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Base de datos online');
    } catch (error) {
        console.log('Error al conectar a la base de datos', error);
    }
}
module.exports = conectar;
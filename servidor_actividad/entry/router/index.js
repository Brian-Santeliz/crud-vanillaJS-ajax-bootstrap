const express = require('express');
const router = express.Router();
const inscripcionesModelo = require('../models/Inscripciones');
const profesoresModelo = require('../models/Profesores');
const seccionesModelo = require('../models/Secciones');

router.get('/obtener-secciones', async (req, res) => {
  const secciones = await seccionesModelo.find();
  try {
    res.json(secciones);
  } catch (error) {
    res.json({
      mensaje: 'Ocurrio un error obteniendo las secciones',
      error,
    });
  }
});

router.get('/obtener-seccion/:id', async (req, res) => {
  const { id } = req.params;
  const seccion = await seccionesModelo.findById(id);
  try {
    res.json(seccion);
  } catch (error) {
    res.json({
      mensaje: 'Ocurrio un error obteniendo la seccion',
      error,
    });
  }
});
router.post('/crear-seccion', async (req, res) => {
  let { nombre, horaInicio, horaFin, cantidadMaxima, dia } = req.body;
  nombre = nombre.toLocaleLowerCase();
  const seccion = new seccionesModelo({
    nombre,
    horaInicio,
    horaFin,
    cantidadMaxima,
    dia,
  });
  try {
    const seccionCreada = await seccion.save();
    res.json(seccionCreada);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Ocurrio un error creando la seccion',
      error,
    });
  }
});

router.put('/actualizar-seccion/:id', async (req, res) => {
  const { id } = req.params;
  let { nombre, horaInicio, horaFin, cantidadMaxima, dia } = req.body;
  nombre = nombre.toLocaleLowerCase();
  const seccion = {
    nombre,
    horaInicio,
    horaFin,
    cantidadMaxima,
    dia,
  };
  // Verifica si la cantidadMaxima a actualizar supera la cntidadActual de la seccion a actualizar
  const seccionActual = await seccionesModelo.findById(id);
  if (seccionActual.cantidadActual > seccion.cantidadMaxima) {
    return res.status(400).json({
      mensaje:
        'La cantidad maxima a actualizar supera la cantidad de inscritos actualmente. La minima debe ser igual a: ' +
        seccionActual.cantidadActual,
    });
  }
  try {
    const seccionActualizada = await seccionesModelo.findByIdAndUpdate(
      id,
      seccion,
      { new: true }
    );
    res.json(seccionActualizada);
  } catch (error) {
    res.status(400).json({
      mensaje: 'Ocurrio un error actualizando la seccion',
      error,
    });
  }
});

router.delete('/eliminar-seccion/:id', async (req, res) => {
  const { id } = req.params;
  try {
    //Verifica que la seccion no tenga inscritos para poder eliminarla
    const inscripciones = await inscripcionesModelo.find({ seccionId: id });
    if (inscripciones.length > 0) {
      return res.status(400).json({
        mensaje:
          'La sección tiene inscritos, no se puede eliminar. Elimina o cambia la sección de los inscritos',
      });
    }
    //Verifica que la seccion no tenga profesores asignados para poder eliminarla
    const profesores = await profesoresModelo.find({ seccionId: id });
    if (profesores.length > 0) {
      return res.status(400).json({
        mensaje:
          'La sección tiene profesores asignados, no se puede eliminar. Elimina o cambia la sección de los profesores',
      });
    }
    const seccionEliminada = await seccionesModelo.findByIdAndDelete(id);
    res.json({
      mensaje: 'Sección eliminada correctamente',
      seccionEliminada,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Ocurrio un error eliminando la sección',
      error,
    });
  }
});

router.get('/obtener-profesores', async (req, res) => {
  const profesores = await profesoresModelo.find().populate('seccionId');
  try {
    res.json(profesores);
  } catch (error) {
    res.json({
      mensaje: 'Ocurrio un error obteniendo los profesores',
      error,
    });
  }
});

router.get('/obtener-profesor/:id', async (req, res) => {
  const { id } = req.params;
  const profesor = await profesoresModelo.findById(id).populate('seccionId');
  try {
    res.json(profesor);
  } catch (error) {
    res.json({
      mensaje: 'Ocurrio un error obteniendo el profesor',
      error,
    });
  }
});
router.post('/crear-profesor', async (req, res) => {
  const { nombre, edad, correo, seccionId, cedula } = req.body;
  const profesor = new profesoresModelo({
    nombre,
    edad,
    correo,
    seccionId,
    cedula,
  });
  try {
    const profesorCreado = await profesor.save();
    const seccion = await seccionesModelo.findById(profesorCreado.seccionId);
    profesorCreado.seccionId = seccion;
    res.json(profesorCreado);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Ocurrio un error creando el profesor',
      error,
    });
  }
});
router.put('/actualizar-profesor/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, edad, correo, seccionId, cedula } = req.body;
  const profesor = {
    nombre,
    edad,
    correo,
    seccionId,
    cedula,
  };
  try {
    const profesorActualizado = await profesoresModelo
      .findByIdAndUpdate(id, profesor, { new: true })
      .populate('seccionId');
    res.json(profesorActualizado);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Ocurrió un error actualizando el profesor',
      error,
    });
  }
});
router.delete('/eliminar-profesor/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const profesorEliminado = await profesoresModelo.findByIdAndDelete(id);
    res.json({
      mensaje: 'Profesor eliminado correctamente',
      profesorEliminado,
    });
  } catch (error) {
    res.json({
      mensaje: 'Ocurrio un error eliminando el profesor',
      error,
    });
  }
});

router.get('/obtener-inscripciones', async (req, res) => {
  const inscripciones = await inscripcionesModelo.find().populate('seccionId');
  const inscripcionesARetornar = await Promise.all(
    inscripciones.map(async (inscripcion) => {
      const profesores = await profesoresModelo.find({
        seccionId: inscripcion.seccionId._id,
      });
      const inscipcionConProfesor = {
        ...inscripcion._doc,
        profesor:
          profesores.map((profesor) => profesor.nombre).join(', ') ||
          'No tiene profesor asignado',
      };
      return inscipcionConProfesor;
    })
  );
  try {
    res.json(inscripcionesARetornar);
  } catch (error) {
    res.json({
      mensaje: 'Ocurrio un error obteniendo las inscripciones',
      error,
    });
  }
});

router.get('/obtener-inscripcion/:id', async (req, res) => {
  const { id } = req.params;
  const inscripcion = await inscripcionesModelo
    .findById(id)
    .populate('seccionId');
  try {
    res.json(inscripcion);
  } catch (error) {
    res.json({
      mensaje: 'Ocurrio un error obteniendo la inscripcion',
      error,
    });
  }
});

router.post('/crear-inscripcion', async (req, res) => {
  const { nombre, edad, correo, seccionId, cedula } = req.body;
  // Verificar si la seccion esta llena y en caso no lo este se inscribe y aumenta la cantidad de inscritos
  const seccion = await seccionesModelo.findById(seccionId);
  if (seccion.cantidadMaxima > seccion.cantidadActual) {
    const inscripcion = new inscripcionesModelo({
      nombre,
      edad,
      correo,
      seccionId,
      cedula,
    });
    try {
      const inscripcionCreada = await inscripcion.save();
      seccion.cantidadActual = seccion.cantidadActual + 1;
      await seccion.save();
      inscripcionCreada.seccionId = seccion;
      //Agrega el profesor a la seccion
      const profesores = await profesoresModelo.find({ seccionId });
      const inscripcionConProfesor = {
        ...inscripcionCreada._doc,
        profesor:
          profesores.map((profesor) => profesor.nombre).join(', ') ||
          'No tiene profesor asignado',
      };
      res.json(inscripcionConProfesor);
    } catch (error) {
      res.status(500).json({
        mensaje: 'Ocurrio un error creando la inscripcion',
        error,
      });
    }
  } else {
    res.status(400).json({
      mensaje: 'La sección esta llena',
    });
  }
});
router.put('/actualizar-inscripcion/:id', async (req, res) => {
  const { id } = req.params;
  let { nombre, edad, correo, seccionId, cedula } = req.body;
  const inscripcion = {
    nombre,
    edad,
    correo,
    seccionId,
    cedula,
  };
  // Verifica si la seccion enviada es la misma que la que tiene la inscripcion y en caso de ser diferente la actualiza y aumenta la cantidad de inscritos y disminuye la cantidad de inscritos de la seccion anterior
  const inscripcionActual = await inscripcionesModelo.findById(id);
  if (inscripcionActual.seccionId.toString() !== seccionId.toString()) {
    const seccionActual = await seccionesModelo.findById(
      inscripcionActual.seccionId
    );
    const seccionNueva = await seccionesModelo.findById(seccionId);
    if (seccionNueva.cantidadActual < seccionNueva.cantidadMaxima) {
      seccionNueva.cantidadActual = seccionNueva.cantidadActual + 1;
      await seccionNueva.save();
      seccionActual.cantidadActual = seccionActual.cantidadActual - 1;
      await seccionActual.save();
    } else {
      res.status(400).json({
        mensaje:
          'La seccion que intenta actualizar ya alcanzo el limite de cupos',
      });
      return;
    }
  }
  // En caso de ser la misma seccion no se hace nada
  try {
    const inscripcionActualizada = await inscripcionesModelo.findByIdAndUpdate(
      id,
      inscripcion,
      { new: true }
    );
    //Llena campo seccionId de la inscripcion actualizada
    inscripcionActualizada.seccionId = await seccionesModelo.findById(
      inscripcionActualizada.seccionId
    );
    //Agrega el profesor a la seccion
    const profesores = await profesoresModelo.find({ seccionId });
    const inscripcionConProfesorActualizada = {
      ...inscripcionActualizada._doc,
      profesor:
        profesores.map((profesor) => profesor.nombre).join(', ') ||
        'No tiene profesor asignado',
    };
    res.json(inscripcionConProfesorActualizada);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Ocurrio un error actualizando la inscripcion',
      error,
    });
  }
});

router.delete('/eliminar-inscripcion/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const inscripcionEliminada = await inscripcionesModelo.findByIdAndDelete(
      id
    );
    const seccionActual = await seccionesModelo.findById(
      inscripcionEliminada.seccionId
    );
    seccionActual.cantidadActual = seccionActual.cantidadActual - 1;
    await seccionActual.save();
    res.json({
      mensaje: 'Inscripcion eliminada correctamente',
      inscripcionEliminada,
    });
  } catch (error) {
    res.json({
      mensaje: 'Ocurrio un error eliminando la inscripcion',
      error,
    });
  }
});

module.exports = router;

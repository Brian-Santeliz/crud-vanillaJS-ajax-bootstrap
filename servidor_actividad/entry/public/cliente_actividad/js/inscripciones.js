const tbodyInscripciones = document.getElementById('tbody-inscripciones');
const seccionSelect = document.getElementById('seccionId');
const formularioInscripcion = document.querySelector('form');
const nombre = document.getElementById('nombre');
const cedula = document.getElementById('cedula');
const seccionId = document.getElementById('seccionId');
const correo = document.getElementById('correo');
const tituloModal = document.getElementById('modalInscripcionesTitulo');
const botonAccion = document.getElementById('boton-accion');

let opcion = '';
let resultados = '';
let inscripcionId = 0;
let filaSeleccionadaEditar = '';
let seccionesVacias = false;
let esPrimerRegistro = false;

const modalInscripciones = new bootstrap.Modal(
  document.getElementById('modalInscripciones')
);

const listarInscripcionesHtml = (inscripciones) => {
  if (!inscripciones.length) {
    esPrimerRegistro = true;
    resultados += `<tr>
    <td colspan="6" class="text-center text-muted font-italic p-3">No existen inscripciones registradas</td>
    </tr>`;
    tbodyInscripciones.innerHTML = resultados;
    return;
  }
  esPrimerRegistro = false;
  inscripciones.forEach((inscripcion) => {
    resultados += `<tr>
                            <td class="d-none">${inscripcion._id}</td>
                            <td class="text-center fw-bold fst-italic ">Estudiante <span class="text-capitalize">${
                              inscripcion.nombre
                            }</span> </td>
                            <td class="text-center fw-bold fst-italic ">${
                              inscripcion.correo
                            }</td>
                            <td class="text-center fw-bold fst-italic ">V-${
                              inscripcion.cedula
                            }</td>
                            <td class="text-center fw-bold fst-italic "><span class="text-capitalize">${
                              inscripcion?.seccionId?.dia
                            } / ${inscripcion?.seccionId?.nombre}</span> / ${
      inscripcion?.seccionId?.horaInicio
    } - ${inscripcion?.seccionId?.horaFin} </td>
                            <td class="text-center fw-bold fst-italic "><span class="text-capitalize ${
                              inscripcion.profesor ===
                              'No tiene profesor asignado'
                                ? 'text-muted'
                                : ''
                            }  ">${inscripcion.profesor} </td>
                            <td class="text-center"><a title="Editar inscripción" class="btnEditar btn btn-warning text-white"><i class="fas fa-graduation-cap"></i></a><a title="Eliminar inscripción" class="btnBorrar btn btn-danger m-1"> <i class="fas fa-graduation-cap"></i> </a></td>
                       </tr>
                    `;
  });
  tbodyInscripciones.innerHTML = resultados;
};

// Método para obtener las inscripciones de la base de datos
const obtenerInscripciones = async () => {
  const inscripciones = await $.ajax({
    url: url + 'obtener-inscripciones',
    success: (inscripciones) => {
      return new Promise((resolve, reject) => {
        resolve(inscripciones);
      });
    },
  });
  return inscripciones;
};
const eliminarInscripcion = async (id) => {
  return await $.ajax({
    url: url + 'eliminar-inscripcion/' + id,
    type: 'DELETE',
    success: (respuesta) => {
      return new Promise((resolve, reject) => {
        resolve(respuesta);
      });
    },
  });
};
const crearInscripcion = async (inscripcion) => {
  return await $.ajax({
    url: url + 'crear-inscripcion',
    type: 'POST',
    data: inscripcion,
    success: (response) => {
      return new Promise((resolve, reject) => {
        resolve(response);
      });
    },
  });
};
const agregarInscripcionAlHtml = (inscripcion) => {
  const fila = `<tr>
                            <td class="d-none">${inscripcion._id}</td>
                            <td class="text-center fw-bold fst-italic ">Estudiante <span class="text-capitalize">${
                              inscripcion.nombre
                            }</span> </td>
                            <td class="text-center fw-bold fst-italic ">${
                              inscripcion.correo
                            }</td>
                            <td class="text-center fw-bold fst-italic ">V-${
                              inscripcion.cedula
                            }</td>
                            <td class="text-center fw-bold fst-italic "><span class="text-capitalize">${
                              inscripcion?.seccionId?.dia
                            } / ${inscripcion?.seccionId?.nombre}</span> / ${
    inscripcion?.seccionId?.horaInicio
  } - ${inscripcion?.seccionId?.horaFin} </td>
                            <td class="text-center fw-bold fst-italic "><span class="text-capitalize ${
                              inscripcion.profesor ===
                              'No tiene profesor asignado'
                                ? 'text-muted'
                                : ''
                            }  ">${inscripcion.profesor} </td>
                            <td class="text-center"><a title="Editar inscripción" class="btnEditar btn btn-warning text-white"><i class="fas fa-graduation-cap"></i></a><a title="Eliminar inscripción" class="btnBorrar btn btn-danger m-1"> <i class="fas fa-graduation-cap"></i> </a></td>
                       </tr>
                    `;
  tbodyInscripciones.insertAdjacentHTML('beforeend', fila);
};
const actualizarInscripcion = async (inscripcion, inscripcionId) => {
  return await $.ajax({
    url: url + 'actualizar-inscripcion/' + inscripcionId,
    type: 'PUT',
    data: inscripcion,
    success: (respuesta) => {
      return new Promise((resolve, reject) => {
        resolve(respuesta);
      });
    },
  });
};
const actualizarInscripcionEnListado = (inscripcion) => {
  const fila = `
  <tr>
  <td class="d-none">${inscripcion._id}</td>
  <td class="text-center fw-bold fst-italic ">Estudiante <span class="text-capitalize">${
    inscripcion.nombre
  }</span> </td>
  <td class="text-center fw-bold fst-italic ">${inscripcion.correo}</td>
  <td class="text-center fw-bold fst-italic ">V-${inscripcion.cedula}</td>
  <td class="text-center fw-bold fst-italic "><span class="text-capitalize">${
    inscripcion?.seccionId?.dia
  } / ${inscripcion?.seccionId?.nombre}</span> / ${
    inscripcion?.seccionId?.horaInicio
  } - ${inscripcion?.seccionId?.horaFin} </td>
  <td class="text-center fw-bold fst-italic "><span class="text-capitalize ${
    inscripcion.profesor === 'No tiene profesor asignado' ? 'text-muted' : ''
  }  ">${inscripcion.profesor} </td>
  <td class="text-center"><a title="Editar inscripción" class="btnEditar btn btn-warning text-white"><i class="fas fa-graduation-cap"></i></a><a title="Eliminar inscripción" class="btnBorrar btn btn-danger m-1"> <i class="fas fa-graduation-cap"></i> </a></td>
</tr>
           `;

  filaSeleccionadaEditar.innerHTML = fila;
};
$(document).ready(() => {
  obtenerSecciones()
    .then((secciones) => {
      if (!secciones.length) {
        seccionesVacias = true;
        return alertify.error('No existen secciones registradas');
      }
      mostrarOptionsSecciones(secciones, seccionSelect);
      seccionesVacias = false;
    })
    .catch(() => {
      alertify.error('Error al obtener las secciones');
    });
  obtenerInscripciones()
    .then((inscripciones) => {
      listarInscripcionesHtml(inscripciones);
    })
    .catch(() => {
      alertify.error('Error al obtener las inscripciones');
    });
});

btnCrear.addEventListener('click', () => {
  if (seccionesVacias) {
    alertify.error(
      'No hay secciones registradas. Agrega una seccion para poder inscribir un estudiante'
    );
    return;
  }
  nombre.value = '';
  cedula.value = '';
  seccionId.value = '';
  correo.value = '';
  modalInscripciones.show();
  opcion = INSCRIPCIONES_OPCIONES.CREAR;
  tituloModal.innerHTML = 'Añadir nueva inscripción';
  botonAccion.innerHTML =
    'Agregar inscripción <i class="fas fa-graduation-cap">';
});

//Eliminar la inscripcion escuando el evento click del boton eliminar
escucharEventoHtml(document, 'click', '.btnBorrar', (e) => {
  const id = e.target.closest('tr').querySelector('td:first-child').innerText;
  alertify.confirm(
    '¿Está seguro que desea eliminar la inscripción seleccionada?',
    function () {
      eliminarInscripcion(id)
        .then(() => {
          alertify.success('Inscripción eliminada correctamente!');
          e.target.closest('tr').remove();
        })
        .catch(() => {
          alertify.error('Error al eliminar la inscripción');
        });
    }
  );
});

// Escucha el evento click del boton editar de las inscripcion
escucharEventoHtml(document, 'click', '.btnEditar', (e) => {
  //Obtiene el id de la fila seleccionada
  inscripcionId = e.target
    .closest('tr')
    .querySelector('td:first-child').innerText;
  $.ajax({
    url: url + 'obtener-inscripcion/' + inscripcionId,
    success: (inscripcion) => {
      nombre.value = inscripcion.nombre;
      cedula.value = inscripcion.cedula;
      seccionId.value = inscripcion.seccionId._id;
      correo.value = inscripcion.correo;
      modalInscripciones.show();
      opcion = INSCRIPCIONES_OPCIONES.MODIFICAR;
      filaSeleccionadaEditar = e.target.closest('tr');
      tituloModal.innerHTML = 'Modificar inscripción';
      botonAccion.innerHTML =
        'Actualizar Inscripción <i class="fas fa-graduation-cap">';
      botonAccion.classList.add('btn-warning', 'text-white');
    },
  });
});

// Escucha el evento submit del formulario y ejecuta la acción basado en la opcion establecida
formularioInscripcion.addEventListener('submit', (e) => {
  e.preventDefault();
  switch (opcion) {
    case INSCRIPCIONES_OPCIONES.CREAR:
      const inscripcionACrear = {
        nombre: nombre.value,
        cedula: cedula.value,
        seccionId: seccionId.value,
        correo: correo.value,
      };
      crearInscripcion(inscripcionACrear)
        .then((inscripcionCreada) => {
          alertify.success('Inscripción creada correctamente!');
          modalInscripciones.hide();
          nombre.value = '';
          cedula.value = '';
          seccionId.value = '';
          correo.value = '';
          if (esPrimerRegistro) {
            tbodyInscripciones.innerHTML = '';
            esPrimerRegistro = false;
          }
          agregarInscripcionAlHtml(inscripcionCreada);
        })
        .catch((e) => {
          if (
            e.responseJSON &&
            e.responseJSON.error &&
            e.responseJSON.error.code &&
            e.responseJSON.error.code === 11000
          ) {
            const campoDuplicado = e.responseJSON.error.keyValue.cedula
              ? 'cedula'
              : 'correo';
            alertify.error(
              `Error creando. Ya existe una inscripción con el valor ${campoDuplicado} ${e.responseJSON.error.keyValue[campoDuplicado]}`
            );
            return;
          }
          alertify.error(
            'Error al crear la inscripción:  ' + e.responseJSON.mensaje
          );
        });
      break;

    case INSCRIPCIONES_OPCIONES.MODIFICAR:
      const incripcionActualizar = {
        nombre: nombre.value,
        cedula: cedula.value,
        seccionId: seccionId.value,
        correo: correo.value,
      };
      actualizarInscripcion(incripcionActualizar, inscripcionId)
        .then((inscripcionActualizada) => {
          alertify.success('Inscripción actualizada correctamente!');
          modalInscripciones.hide();
          nombre.value = '';
          cedula.value = '';
          seccionId.value = '';
          correo.value = '';
          actualizarInscripcionEnListado(inscripcionActualizada);
          inscripcionId = 0;
          filaSeleccionadaEditar = '';
        })
        .catch((e) => {
          if (
            e.responseJSON &&
            e.responseJSON.error &&
            e.responseJSON.error.code &&
            e.responseJSON.error.code === 11000
          ) {
            const campoDuplicado = e.responseJSON.error.keyValue.cedula
              ? 'cedula'
              : 'correo';
            alertify.error(
              `Error actualizando. Ya existe una inscripción con el valor ${campoDuplicado} ${e.responseJSON.error.keyValue[campoDuplicado]}`
            );
            return;
          }
          alertify.error(
            'Error al actualizar la inscripción ' + e.responseJSON.mensaje
          );
        });
    default:
      break;
  }
  modalInscripciones.hide();
});

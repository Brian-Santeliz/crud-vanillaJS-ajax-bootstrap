const tbodyProfesores = document.getElementById('tbody-profesores');
const seccionSelect = document.getElementById('seccionId');
const formProfesor = document.querySelector('form');
const nombre = document.getElementById('nombre');
const edad = document.getElementById('edad');
const cedula = document.getElementById('cedula');
const seccionId = document.getElementById('seccionId');
const correo = document.getElementById('correo');
const tituloModal = document.getElementById('modalProfesores-titulo');
const botonAccion = document.getElementById('boton-accion');

let opcion = '';
let resultados = '';
let profesorId = 0;
let filaEditar = '';
let seccionesVacias = false;
let esPrimerRegistro = false;
const modalProfesores = new bootstrap.Modal(
  document.getElementById('modalProfesores')
);

const listarProfesores = (profesores) => {
  if (!profesores.length) {
    esPrimerRegistro = true;
    resultados += `<tr>
    <td colspan="6" class="text-center text-muted font-italic p-3">No hay profesores disponibles</td>
    </tr>`;
    tbodyProfesores.innerHTML = resultados;
    return;
  }
  esPrimerRegistro = false;
  profesores.forEach((profesor) => {
    resultados += `<tr>
                            <td class="d-none">${profesor._id}</td>
                            <td class="text-center fw-bold fst-italic ">Profesor <span class="text-capitalize">${profesor.nombre}</span> </td>
                            <td class="text-center fw-bold fst-italic ">${profesor.edad} años</td>
                            <td class="text-center fw-bold fst-italic ">${profesor.correo}</td>
                            <td class="text-center fw-bold fst-italic ">V-${profesor.cedula}</td>
                            <td class="text-center fw-bold fst-italic "><span class="text-uppercase">${profesor.seccionId.nombre}</span> / ${profesor.seccionId.dia} / ${profesor.seccionId.horaInicio} - ${profesor.seccionId.horaFin} </td>
                            <td class="text-center"><a title="Editar profesor" class="btnEditar btn btn-warning text-white"><i class="fas fa-chalkboard-teacher"></i></a><a title="Eliminar profesor" class="btnBorrar btn btn-danger m-1"> <i class="fas fa-chalkboard-teacher"></i> </a></td>
                       </tr>
                    `;
  });
  tbodyProfesores.innerHTML = resultados;
};

// Metodo para obtener los profesores de la base de datos
const obtenerProfesores = async () => {
  const profesores = await $.ajax({
    url: url + 'obtener-profesores',
    success: (profesores) => {
      return new Promise((resolve, reject) => {
        resolve(profesores);
      });
    },
  });
  return profesores;
};
const eliminarProfesor = async (id) => {
  return await $.ajax({
    url: url + 'eliminar-profesor/' + id,
    type: 'DELETE',
    success: (respuesta) => {
      return new Promise((resolve, reject) => {
        resolve(respuesta);
      });
    },
  });
};
const crearProfesor = async (profesor) => {
  return await $.ajax({
    url: url + 'crear-profesor',
    type: 'POST',
    data: profesor,
    success: (respuesta) => {
      return new Promise((resolve, reject) => {
        resolve(respuesta);
      });
    },
  });
};
const actualizarProfesor = async (profesor, profesorId) => {
  return await $.ajax({
    url: url + 'actualizar-profesor/' + profesorId,
    type: 'PUT',
    data: profesor,
    success: (respuesta) => {
      return new Promise((resolve, reject) => {
        resolve(respuesta);
      });
    },
  });
};
const actualizarProfesorEnTabla = (profesor) => {
  const fila = `
  <tr>
  <td class="d-none">${profesor._id}</td>
  <td class="text-center fw-bold fst-italic ">Profesor <span class="text-capitalize">${profesor.nombre}</span> </td>
  <td class="text-center fw-bold fst-italic ">${profesor.edad} años</td>
  <td class="text-center fw-bold fst-italic ">${profesor.correo}</td>
  <td class="text-center fw-bold fst-italic ">V-${profesor.cedula}</td>
  <td class="text-center fw-bold fst-italic "><span class="text-uppercase">${profesor.seccionId.nombre}</span> / ${profesor.seccionId.dia} / ${profesor.seccionId.horaInicio} - ${profesor.seccionId.horaFin} </td>
  <td class="text-center"><a title="Editar profesor" class="btnEditar btn btn-warning text-white"><i class="fas fa-chalkboard-teacher"></i></a><a title="Eliminar profesor" class="btnBorrar btn btn-danger m-1"> <i class="fas fa-chalkboard-teacher"></i> </a></td>
</tr>
           `;

  filaEditar.innerHTML = fila;
};
const agregarProfesor = (profesor) => {
  tbodyProfesores.innerHTML += `<tr>
                            <td class="d-none">${profesor._id}</td>
                            <td class="text-center fw-bold fst-italic ">Profesor <span class="text-capitalize">${profesor.nombre}</span> </td>
                            <td class="text-center fw-bold fst-italic ">${profesor.edad} años</td>
                            <td class="text-center fw-bold fst-italic ">${profesor.correo}</td>
                            <td class="text-center fw-bold fst-italic ">V-${profesor.cedula}</td>
                            <td class="text-center fw-bold fst-italic "><span class="text-uppercase">${profesor.seccionId.nombre}</span> / ${profesor.seccionId.dia} / ${profesor.seccionId.horaInicio} - ${profesor.seccionId.horaFin} </td>
                            <td class="text-center"><a title="Editar profesor" class="btnEditar btn btn-warning text-white"><i class="fas fa-chalkboard-teacher"></i></a><a title="Eliminar profesor" class="btnBorrar btn btn-danger m-1"> <i class="fas fa-chalkboard-teacher"></i> </a></td>
                       </tr>
                    `;
};
$(document).ready(() => {
  obtenerSecciones()
    .then((secciones) => {
      if (!secciones.length) {
        seccionesVacias = true;
        alertify.error(
          'No hay secciones registradas. Agrega una para poder registrar un profesor'
        );
        return;
      }
      mostrarOptionsSecciones(secciones, seccionSelect);
      seccionesVacias = false;
    })
    .catch(() => {
      alertify.error('Error al obtener las secciones');
    });
  obtenerProfesores()
    .then((profesores) => {
      listarProfesores(profesores);
    })
    .catch(() => {
      alertify.error('Error al obtener los profesores');
    });
});

btnCrear.addEventListener('click', () => {
  if (seccionesVacias) {
    alertify.error(
      'No hay secciones registradas. Agrega una para poder registrar un profesor'
    );
    return;
  }
  nombre.value = '';
  edad.value = '';
  cedula.value = '';
  seccionId.value = '';
  correo.value = '';
  modalProfesores.show();
  opcion = PROFESOR_OPCIONES.CREAR;
  tituloModal.innerHTML = 'Crear Profesor';
  botonAccion.innerHTML = 'Crear Profesor <i class="fas fa-user-graduate">';
});

//Eliminar el profesor escuando el evento click del boton eliminar
escucharEventoHtml(document, 'click', '.btnBorrar', (e) => {
  const id = e.target.closest('tr').querySelector('td:first-child').innerText;
  alertify.confirm(
    '¿Está seguro que desea eliminar el profesor seleccionado?',
    function () {
      eliminarProfesor(id)
        .then(() => {
          alertify.success('Profesor eliminado correctamente!');
          e.target.closest('tr').remove();
        })
        .catch((e) => {
          alertify.error('Error al eliminar el profesor');
        });
    }
  );
});

// Escucha el evento click del boton editar
escucharEventoHtml(document, 'click', '.btnEditar', (e) => {
  profesorId = e.target.closest('tr').querySelector('td:first-child').innerText;
  $.ajax({
    url: url + 'obtener-profesor/' + profesorId,
    success: (profesor) => {
      nombre.value = profesor.nombre;
      edad.value = profesor.edad;
      cedula.value = profesor.cedula;
      seccionId.value = profesor.seccionId._id;
      correo.value = profesor.correo;
      modalProfesores.show();
      opcion = PROFESOR_OPCIONES.MODIFICAR;
      filaEditar = e.target.closest('tr');
      tituloModal.innerHTML = 'Editar Profesor';
      botonAccion.innerHTML =
        'Editar Profesor <i class="fas fa-user-graduate">';
      botonAccion.classList.add('btn-warning', 'text-white');
    },
  });
});

//Ecucha evento submit del form para Crear y Editar
formProfesor.addEventListener('submit', (e) => {
  e.preventDefault();
  switch (opcion) {
    case PROFESOR_OPCIONES.CREAR:
      const profesorCrear = {
        nombre: nombre.value,
        edad: edad.value,
        cedula: cedula.value,
        seccionId: seccionId.value,
        correo: correo.value,
      };
      crearProfesor(profesorCrear)
        .then((profesorCreado) => {
          alertify.success('Profesor creado correctamente');
          modalProfesores.hide();
          nombre.value = '';
          edad.value = '';
          cedula.value = '';
          seccionId.value = '';
          correo.value = '';
          if (esPrimerRegistro) {
            tbodyProfesores.innerHTML = '';
            esPrimerRegistro = false;
          }
          agregarProfesor(profesorCreado);
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
              `Error creando. Ya existe una profesor con el valor ${campoDuplicado} ${e.responseJSON.error.keyValue[campoDuplicado]}`
            );
            return;
          }
          alertify.error(
            'Error al crear el profesor ' + e.responseJSON.mensaje
          );
        });
      break;

    case PROFESOR_OPCIONES.MODIFICAR:
      const profesorModificar = {
        nombre: nombre.value,
        edad: edad.value,
        cedula: cedula.value,
        seccionId: seccionId.value,
        correo: correo.value,
      };

      actualizarProfesor(profesorModificar, profesorId)
        .then((profesorModificado) => {
          alertify.success('Profesor actualizado correctamente!');
          modalProfesores.hide();
          nombre.value = '';
          edad.value = '';
          cedula.value = '';
          seccionId.value = '';
          correo.value = '';
          actualizarProfesorEnTabla(profesorModificado);
          profesorId = 0;
          filaEditar = '';
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
              `Error actualizando. Ya existe una profesor con el valor ${campoDuplicado} ${e.responseJSON.error.keyValue[campoDuplicado]}`
            );
            return;
          }
          alertify.error(
            'Error al actualizar el profesor ' + e.responseJSON.mensaje
          );
        });
    default:
      break;
  }
  modalProfesores.hide();
});

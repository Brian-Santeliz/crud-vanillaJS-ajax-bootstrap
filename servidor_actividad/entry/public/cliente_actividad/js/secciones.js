const contenedor = document.querySelector('tbody');
const formSeccion = document.querySelector('form');
const nombre = document.getElementById('nombre');
const dia = document.getElementById('dia');
const inicio = document.getElementById('inicio');
const final = document.getElementById('final');
const cantidadMaxima = document.getElementById('cantidadMaxima');
const tituloModal = document.getElementById('modalSecciones-titulo');
const botonAccion = document.getElementById('boton-accion');

let resultados = '';
let idSeccion = 0;
let filaEditar = '';
let opcion = '';
let esPrimerRegistro = false;

const modalSecciones = new bootstrap.Modal(
  document.getElementById('modalSecciones')
);

btnCrear.addEventListener('click', () => {
  nombre.value = '';
  dia.value = '';
  inicio.value = '';
  final.value = '';
  cantidadMaxima.value = '';
  modalSecciones.show();
  opcion = SECCION_OPCIONES.CREAR;
  tituloModal.innerHTML = 'Crear Sección';
  botonAccion.innerHTML = 'Crear sección <i class="fas fa-paper-plane">';
});

const crearSeccion = async (seccionCrear) => {
  const respuesta = await $.ajax({
    url: url + 'crear-seccion',
    method: 'POST',
    data: seccionCrear,
    success: (respuesta) => {
      return new Promise((resolve, reject) => {
        resolve(respuesta);
      });
    },
  });
  return respuesta;
};

const eliminarSeccion = async (idSeccion) => {
  const respuesta = await $.ajax({
    url: url + 'eliminar-seccion/' + idSeccion,
    type: 'DELETE',
    data: { idSeccion },
    success: (respuesta) => {
      return new Promise((resolve, reject) => {
        resolve(respuesta);
      });
    },
  });
  return respuesta;
};
const actualizarSeccion = async (seccionActualizar, seccionId) => {
  const respuesta = await $.ajax({
    url: url + 'actualizar-seccion/' + seccionId,
    method: 'PUT',
    data: seccionActualizar,
    success: (respuesta) => {
      return new Promise((resolve, reject) => {
        resolve(respuesta);
      });
    },
  });
  return respuesta;
};
const actualizarDelListadoSeccion = (seccion) => {
  filaEditar.innerHTML = `
  <tr>
  <td class="d-none">${seccion._id}</td>
  <td class="text-center fw-bold fst-italic ">Sección <span class="text-uppercase">${
    seccion.nombre
  }</span> </td>
  <td class="text-center fw-bold fst-italic ">${seccion.dia}</td>
  <td class="text-center fw-bold fst-italic ">${seccion.horaInicio}</td>
  <td class="text-center fw-bold fst-italic ">${seccion.horaFin}</td>
  <td class="text-center fw-bold fst-italic ">${seccion.cantidadMaxima}</td>
  <td class="text-center fw-bold fst-italic ">${seccion.cantidadActual}</td>
  <td class="text-center fw-bold fst-italic ">${Math.abs(
    seccion.cantidadMaxima - seccion.cantidadActual
  )}</td>
  <td class="text-center"><a title="Editar sección" class="btnEditar btn btn-warning text-white"><i class="fas fa-university"></i></a><a title="Borrar sección" class="btnBorrar btn btn-danger m-1"> <i class="fas fa-university"></i> </a></td>
</tr>
          `;
};

//funcion para listarSecciones los resultados de la query
const listarSecciones = (secciones) => {
  if (!secciones.length) {
    esPrimerRegistro = true;
    resultados += `<tr>
    <td colspan="8" class="text-center text-muted font-italic p-3">No hay secciones disponibles</td>
    </tr>`;
    contenedor.innerHTML = resultados;
    return;
  }
  esPrimerRegistro = false;
  secciones.forEach((seccion) => {
    resultados += `<tr>
                            <td class="d-none">${seccion._id}</td>
                            <td class="text-center fw-bold fst-italic ">Sección <span class="text-uppercase">${
                              seccion.nombre
                            }</span> </td>
                            <td class="text-center fw-bold fst-italic ">${
                              seccion.dia
                            }</td>
                            <td class="text-center fw-bold fst-italic ">${
                              seccion.horaInicio
                            }</td>
                            <td class="text-center fw-bold fst-italic ">${
                              seccion.horaFin
                            }</td>
                            <td class="text-center fw-bold fst-italic ">${
                              seccion.cantidadMaxima
                            }</td>
                            <td class="text-center fw-bold fst-italic ">${
                              seccion.cantidadActual
                            }</td>
                            <td class="text-center fw-bold fst-italic ">${Math.abs(
                              seccion.cantidadMaxima - seccion.cantidadActual
                            )}</td>
                            <td class="text-center"><a title="Editar sección" class="btnEditar btn btn-warning text-white"><i class="fas fa-university"></i></a><a title="Borrar sección" class="btnBorrar btn btn-danger m-1"> <i class="fas fa-university"></i> </a></td>
                       </tr>
                    `;
  });
  contenedor.innerHTML = resultados;
};

//Agregar la seccion creada al listado de secciones
const agregarSeccionHtml = (seccion) => {
  const fila = `<tr>
  <td class="d-none">${seccion._id}</td>
  <td class="text-center fw-bold fst-italic ">Sección <span class="text-uppercase">${
    seccion.nombre
  }</span> </td>
  <td class="text-center fw-bold fst-italic ">${seccion.dia}</td>
  <td class="text-center fw-bold fst-italic ">${seccion.horaInicio}</td>
  <td class="text-center fw-bold fst-italic ">${seccion.horaFin}</td>
  <td class="text-center fw-bold fst-italic ">${seccion.cantidadMaxima}</td>
  <td class="text-center fw-bold fst-italic ">${seccion.cantidadActual}</td>
  <td class="text-center fw-bold fst-italic ">${Math.abs(
    seccion.cantidadMaxima - seccion.cantidadActual
  )}</td>
  <td class="text-center"><a title="Editar sección" class="btnEditar btn btn-warning text-white"><i class="fas fa-university"></i></a><a title="Borrar sección" class="btnBorrar btn btn-danger m-1"> <i class="fas fa-university"></i> </a></td>
</tr>`;
  contenedor.insertAdjacentHTML('beforeend', fila);
};
//Obtiene las secciones
const obtenerSeccionesInicio = () => {
  $.ajax({
    url: url + 'obtener-secciones',
    success: (secciones) => {
      listarSecciones(secciones);
    },
  });
};
obtenerSeccionesInicio();

//Eliminar la seccion
escucharEventoHtml(document, 'click', '.btnBorrar', (e) => {
  const id = e.target.closest('tr').querySelector('td:first-child').innerText;
  alertify.confirm('¿Está seguro que desea eliminar la sección?', function () {
    eliminarSeccion(id)
      .then(() => {
        alertify.success('Sección eliminada correctamente');
        e.target.closest('tr').remove();
      })
      .catch((e) => {
        alertify.error(e.responseJSON.mensaje);
      });
  });
});

//Procedimiento Editar
escucharEventoHtml(document, 'click', '.btnEditar', (e) => {
  idSeccion = e.target.closest('tr').querySelector('td:first-child').innerText;
  $.ajax({
    url: url + 'obtener-seccion/' + idSeccion,
    success: (seccion) => {
      nombre.value = seccion.nombre;
      dia.value = seccion.dia;
      inicio.value = seccion.horaInicio;
      final.value = seccion.horaFin;
      cantidadMaxima.value = seccion.cantidadMaxima;
      modalSecciones.show();
      opcion = SECCION_OPCIONES.MODIFICAR;
      filaEditar = e.target.closest('tr');
      tituloModal.innerHTML = 'Editar Sección';
      botonAccion.innerHTML = 'Editar sección <i class="fas fa-university">';
      botonAccion.classList.add('btn-warning', 'text-white');
    },
  });
});

formSeccion.addEventListener('submit', (e) => {
  e.preventDefault();
  switch (opcion) {
    case SECCION_OPCIONES.CREAR:
      const seccionCrear = {
        nombre: nombre.value,
        dia: dia.value,
        horaInicio: inicio.value,
        horaFin: final.value,
        cantidadMaxima: cantidadMaxima.value,
      };
      crearSeccion(seccionCrear)
        .then((seccionCreada) => {
          alertify.success('Sección creada correctamente!');
          modalSecciones.hide();
          const seccion = {
            nombre: nombre.value,
            dia: dia.value,
            horaInicio: inicio.value,
            horaFin: final.value,
            cantidadMaxima: cantidadMaxima.value,
            cantidadActual: seccionCreada.cantidadActual,
            _id: seccionCreada._id,
          };
          if (esPrimerRegistro) {
            contenedor.innerHTML = '';
            esPrimerRegistro = false;
          }
          agregarSeccionHtml(seccion);
          nombre.value = '';
          dia.value = '';
          inicio.value = '';
          final.value = '';
          cantidadMaxima.value = '';
        })
        .catch((e) => {
          if (
            e.responseJSON &&
            e.responseJSON.error &&
            e.responseJSON.error.code &&
            e.responseJSON.error.code === 11000
          ) {
            alertify.error(
              `Error creando la sección. Ya existe una sección registrada con el nombre ${e.responseJSON.error.keyValue.nombre}`
            );
            return;
          }
          alertify.error('Error al crear la sección ' + e.responseJSON.mensaje);
        });
      break;

    case SECCION_OPCIONES.MODIFICAR:
      const seccionModificar = {
        nombre: nombre.value,
        dia: dia.value,
        horaInicio: inicio.value,
        horaFin: final.value,
        cantidadMaxima: cantidadMaxima.value,
      };
      actualizarSeccion(seccionModificar, idSeccion)
        .then((seccionModificada) => {
          alertify.success('Sección modificada correctamente!');
          modalSecciones.hide();
          const seccion = {
            nombre: nombre.value,
            dia: dia.value,
            horaInicio: inicio.value,
            horaFin: final.value,
            cantidadMaxima: seccionModificada.cantidadMaxima,
            cantidadActual: seccionModificada.cantidadActual,
            _id: seccionModificada._id,
          };
          actualizarDelListadoSeccion(seccion);
          nombre.value = '';
          dia.value = '';
          inicio.value = '';
          final.value = '';
          cantidadMaxima.value = '';
          idSeccion = 0;
          filaEditar = '';
        })
        .catch((e) => {
          if (
            e.responseJSON &&
            e.responseJSON.error &&
            e.responseJSON.error.code &&
            e.responseJSON.error.code === 11000
          ) {
            alertify.error(
              `Error modificando la sección. Ya existe una sección registrada con el nombre ${e.responseJSON.error.keyValue.nombre}`
            );
            return;
          }
          alertify.error(
            'Error al modificar la sección ' + e.responseJSON.mensaje
          );
        });
    default:
      break;
  }
  modalSecciones.hide();
});

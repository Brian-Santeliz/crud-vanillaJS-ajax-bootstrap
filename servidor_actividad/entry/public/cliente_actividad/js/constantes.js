const url = 'http://localhost:3000/servidor/';

// Escuha eventos basado en el selector enviado como parametro y ejecuta la funcion enviada como parametro
const escucharEventoHtml = (element, event, selector, handler) => {
    element.addEventListener(event, (e) => {
      if (e.target.closest(selector)) {
        handler(e);
      }
    });
  };

  const PROFESOR_OPCIONES  = {
    CREAR: 'crear-profesor',
    MODIFICAR: 'actualizar-profesor',
}

const INSCRIPCIONES_OPCIONES = {
    CREAR: 'crear-inscripcion',
    MODIFICAR: 'actualizar-inscripcion',

}

const SECCION_OPCIONES = {
    CREAR: 'crear-seccion',
    MODIFICAR: 'actualizar-seccion',
}

//Obtiene las secciones de la base de datos asincronamente
const obtenerSecciones = async () => {
  return await $.ajax({
    url: url + 'obtener-secciones',
    success: (secciones) => {
      return new Promise((resolve, reject) => {
        resolve(secciones);
      });
    },
  });
};

// Rellena el select con las secciones
const mostrarOptionsSecciones = (secciones, selector) => {
  secciones.forEach((seccion) => {
    selector.innerHTML += `<option value="${seccion._id}">${seccion.nombre}</option>`;
  });
};
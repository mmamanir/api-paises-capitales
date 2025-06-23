const fs = require('fs');
const path = require('path');

const BUSQUEDAS_PATH = path.join(__dirname, '../../../config/data/busquedas.json');
const RANKING_PATH = path.join(__dirname, '../../../config/data/ranking.json');

/**
 * Asegura que un archivo JSON exista. Si no existe, lo crea como un arreglo vacío.
 * @param {string} ruta - Ruta del archivo a verificar o crear.
 */
function asegurarArchivo(ruta) {
  if (!fs.existsSync(ruta)) {
    fs.writeFileSync(ruta, '[]', 'utf8'); // o '{}' si esperas un objeto
  }
}

//Asegura que los archivos existan al iniciar
asegurarArchivo(BUSQUEDAS_PATH);
asegurarArchivo(RANKING_PATH);


/**
 * Simula la lectura de un archivo como si fuera una consulta a la base de datos.
 * @param {string} ruta - Ruta del archivo JSON a leer.
 * @returns {Object|Array} Contenido parseado del JSON o arreglo vacío si no existe o está vacío.
 */
function leerJSON(ruta) {
  if (!fs.existsSync(ruta)) return [];

  const contenido = fs.readFileSync(ruta, 'utf8').trim();
  if (contenido === '') return [];

  try {
    return JSON.parse(contenido);
  } catch (error) {
    console.error(`❌ Error al leer JSON en ${ruta}: ${error.message}`);
    return [];
  }
}



/**
 * Simula el guardado de datos en un archivo como si fuera una operación de base de datos.
 * @param {string} ruta - Ruta del archivo JSON a escribir.
 * @param {Object|Array} data - Datos a guardar.
 */
function guardarJSON(ruta, data) {
  fs.writeFileSync(ruta, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Registra una búsqueda de país en el historial de búsquedas.
 * @param {Object} pais - Objeto país con nombre y región.
 */
exports.registrarBusqueda = (pais) => {
  const busquedas = leerJSON(BUSQUEDAS_PATH);
  busquedas.push({
    nombre: pais.nombre,
    region: pais.region,
    fecha: new Date().toISOString()
  });
  guardarJSON(BUSQUEDAS_PATH, busquedas);
};

/**
 * Actualiza el ranking de países más buscados por región.
 * @param {Object} pais - Objeto país con nombre y región.
 */
exports.actualizarRanking = (pais) => {
  let ranking = leerJSON(RANKING_PATH);
  if (Array.isArray(ranking)) {
    // Si por error es un array, lo inicializamos como objeto
    ranking = {};
  }

  const region = pais.region || 'Sin Región';
  const nombre = pais.nombre;

  if (!ranking[region]) ranking[region] = {};
  if (!ranking[region][nombre]) ranking[region][nombre] = 0;

  ranking[region][nombre]++;
  guardarJSON(RANKING_PATH, ranking);
};

/**
 * Obtiene el ranking actual de países más buscados agrupados por región.
 * @returns {Object} Objeto con regiones como claves y países como subobjetos con conteo.
 */
exports.obtenerRanking = () => {
  return leerJSON(RANKING_PATH);
};

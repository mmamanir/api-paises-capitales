// Importar el repositorio y el modelo de país
const paisRepository = require('../../repositories/pais/paisRepository');
const Pais = require('../../models/pais/paisModel');
const busquedaRepository = require('../../repositories/pais/busquedaRepository');

/**
 * @file Servicio para manejar la lógica de negocio relacionada con países.
 * Encapsula operaciones como obtener países, gestionar favoritos y agrupar por región.
 * 
 * @module paisService
 */

/**
 * Obtiene la información detallada de un país desde la API externa REST Countries.
 * Devuelve una instancia del modelo `Pais`.
 * 
 * @async
 * @param {string} nombre - Nombre del país a consultar.
 * @returns {Promise<Pais>} Instancia del país encontrado.
 * @throws {Error} Si ocurre un error o el país no es encontrado.
 */
exports.obtenerPais = async (nombre) => {
  try {
    const pais = await paisRepository.obtenerPais(nombre); // Esto ya es instancia de Pais

    // registrar búsqueda y ranking
    busquedaRepository.registrarBusqueda(pais);
    busquedaRepository.actualizarRanking(pais);

    return pais;
  } catch (error) {
    throw new Error(`Error al obtener país: ${error.message}`);
  }
};

/**
 * Agrega un país a la lista de favoritos después de obtenerlo y validarlo.
 * 
 * @async
 * @param {string} nombre - Nombre del país a agregar como favorito.
 * @returns {Promise<Pais>} País guardado como favorito.
 * @throws {Error} Si el país está en lista negra o ya es favorito.
 */
exports.agregarFavorito = async (nombre) => {
  try {
    const pais = await paisRepository.obtenerPais(nombre);
    return await paisRepository.guardarFavorito(pais);
  } catch (error) {
    // 👉 Si el error es "País no encontrado", asigna código 404
    if (error.message.includes('País no encontrado')) {
      error.status = 404;
    }
    throw error;
  }
};

/**
 * Obtiene todos los países favoritos y los agrupa por región.
 * 
 * @async
 * @returns {Promise<Object>} Objeto con claves por región y arrays de nombres de países.
 * @example
 * {
 *   "Americas": ["Chile", "Argentina"],
 *   "Europe": ["Germany"]
 * }
 */
exports.obtenerFavoritosAgrupados = async () => {
  const favoritos = await paisRepository.obtenerFavoritos(); // Array de Pais

  return favoritos.reduce((acc, pais) => {
    const region = pais.region || 'Sin Región';
    if (!acc[region]) acc[region] = [];
    acc[region].push(pais.nombre);
    return acc;
  }, {});
};

/**
 * Elimina un país favorito por nombre.
 * 
 * @async
 * @param {string} nombre - Nombre del país a eliminar.
 * @returns {Promise<boolean>} True si se eliminó, False si no existía.
 */
exports.eliminarFavorito = async (nombre) => {
  return await paisRepository.eliminarFavorito(nombre);
};

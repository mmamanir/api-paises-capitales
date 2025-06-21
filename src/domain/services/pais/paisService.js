// Importar el repositorio de países (lo crearás más adelante)
const paisRepository = require('../../repositories/pais/paisRepository');

/**
 * @file Servicio para manejar la lógica de negocio relacionada con países.
 * Este módulo actúa como intermediario entre los controladores y los repositorios,
 * encapsulando la lógica de negocio y asegurando la separación de responsabilidades.
 * 
 * @module paisService
 */

/**
 * Obtiene la información detallada de un país desde la API externa REST Countries.
 * 
 * @async
 * @function obtenerPais
 * @param {string} nombre - Nombre del país a buscar (parcial o completo).
 * @returns {Promise<Object>} Objeto con los datos del país.
 * 
 * @throws {Error} Si ocurre un error al obtener el país.
 * 
 * @example
 * const pais = await obtenerPais("Chile");
 * console.log(pais);
 */
exports.obtenerPais = async (nombre) => {
    try {
        return await paisRepository.obtenerPais(nombre);
    } catch (error) {
        throw new Error(`Error al obtener país: ${error.message}`);
    }
};

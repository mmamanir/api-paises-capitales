const axios = require('axios');
const logger = require('../../../infrastructure/logger');

const REST_COUNTRIES_URL = 'https://restcountries.com/v3.1/name/';

/**
 * @file Repositorio para manejar el acceso a datos relacionado con países.
 * Este módulo consulta la API pública REST Countries para obtener información
 * estructurada de países según su nombre.
 * 
 * @module paisRepository
 */

/**
 * Consulta la información de un país por nombre desde la API externa.
 * 
 * @async
 * @function obtenerPais
 * @param {string} nombre - Nombre del país a consultar.
 * @returns {Promise<Object>} Objeto con datos del país.
 * 
 * @throws {Error} Si ocurre un error en la API o si no se encuentra el país.
 */
exports.obtenerPais = async (nombre) => {
    const url = `${REST_COUNTRIES_URL}${encodeURIComponent(nombre)}`;
    logger.info(`🌐 Consultando país en API externa: ${url}`);
    
    try {
        const response = await axios.get(url);
        const pais = response.data[0];

        if (!pais) {
            logger.warn(`⚠️ No se encontró información para el país: ${nombre}`);
            throw new Error('País no encontrado');
        }

        // Transformar y devolver datos normalizados
        return {
            nombre: pais.name?.common || '',
            capital: pais.capital?.[0] || 'Sin capital',
            region: pais.region || '',
            moneda: Object.keys(pais.currencies || {})[0] || '',
            idiomas: Object.values(pais.languages || []),
            poblacion: pais.population || 0
        };
     } catch (error) {
        // Si es un error manejado por axios con respuesta HTTP
        if (error.response) {
            if (error.response.status === 404) {
                logger.warn(`⚠️ País no encontrado: ${nombre}`);
                throw new Error('País no encontrado');
            }
            logger.error(`❌ Error HTTP al obtener país "${nombre}": ${error.response.status}`);
        } else {
            logger.error(`❌ Error sin respuesta al obtener país "${nombre}": ${error.message}`);
        }

        throw new Error('Error al consultar la API de países');
    }
};
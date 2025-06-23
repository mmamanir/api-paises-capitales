const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../../../infrastructure/logger');
const Pais = require('../../models/pais/paisModel');

const REST_COUNTRIES_URL = 'https://restcountries.com/v3.1/name/';
const FAVORITOS_DIR = path.join(__dirname, '../../../config/data/favoritos');
const LISTA_NEGRA_PATH = path.join(__dirname, '../../../config/data/lista_negra.json');

/**
 * Consulta la información de un país por nombre desde la API externa.
 *
 * @async
 * @function obtenerPais
 * @param {string} nombre - Nombre del país a consultar.
 * @returns {Promise<Pais>} Instancia del modelo Pais.
 * @throws {Error} Si no se encuentra el país o hay error en la consulta.
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

    return new Pais(
      pais.name?.common || '',
      pais.capital?.[0] || 'Sin capital',
      pais.region || 'Sin Región',
      Object.keys(pais.currencies || {})[0] || '',
      Object.values(pais.languages || []),
      pais.population || 0
    );
  } catch (error) {
    if (error.response?.status === 404) {
      logger.warn(`⚠️ País no encontrado: ${nombre}`);
      throw new Error('País no encontrado');
    }
    logger.error(`❌ Error al obtener país: ${error.message}`);
    throw new Error('Error al consultar la API de países');
  }
};

/**
 * Guarda un país en favoritos si no está en lista negra o duplicado.
 *
 * @async
 * @function guardarFavorito
 * @param {Pais} pais - Objeto país a guardar.
 * @returns {Promise<Pais>}
 * @throws {Error} Si el país está en lista negra o ya existe.
 */
exports.guardarFavorito = async (pais) => {
  const listaNegra = JSON.parse(await fs.readFile(LISTA_NEGRA_PATH, 'utf8'));
  if (listaNegra.includes(pais.nombre)) {
    const error = new Error('País restringido por política');
    error.status = 403;
    throw error;
  }

  const regionDir = path.join(FAVORITOS_DIR, pais.region);
  const paisPath = path.join(regionDir, `${pais.nombre}.json`);

  try {
    await fs.mkdir(regionDir, { recursive: true });

    try {
      await fs.access(paisPath);
      const error = new Error('País ya está en favoritos');
      error.status = 409;
      throw error;
    } catch {
      await fs.writeFile(paisPath, JSON.stringify(pais, null, 2));
      return pais;
    }
  } catch (error) {
    logger.error(`❌ Error al guardar favorito: ${error.message}`);
    throw new Error('Error al guardar país favorito');
  }
};

/**
 * Lee todos los países favoritos desde los archivos locales.
 *
 * @async
 * @returns {Promise<Array<Pais>>}
 */
exports.obtenerFavoritos = async () => {
  const regiones = await fs.readdir(FAVORITOS_DIR);
  const favoritos = [];

  for (const region of regiones) {
    const regionPath = path.join(FAVORITOS_DIR, region);
    const archivos = await fs.readdir(regionPath);

    for (const archivo of archivos) {
      const contenido = await fs.readFile(path.join(regionPath, archivo), 'utf8');
      favoritos.push(JSON.parse(contenido));
    }
  }

  return favoritos;
};

/**
 * Elimina un país favorito si existe.
 *
 * @async
 * @param {string} nombre - Nombre del país.
 * @returns {Promise<boolean>} True si se eliminó, false si no existía.
 */
exports.eliminarFavorito = async (nombre) => {
  const regiones = await fs.readdir(FAVORITOS_DIR);

  for (const region of regiones) {
    const archivo = path.join(FAVORITOS_DIR, region, `${nombre}.json`);
    try {
      await fs.access(archivo);
      await fs.unlink(archivo);
      return true;
    } catch {
      continue;
    }
  }

  return false;
};

// Importación de servicios y herramientas
const paisService = require('../../domain/services/pais/paisService');
const favoritosService = require('../../domain/services/pais/favoritosService');
const logger = require('../../infrastructure/logger');
const httpMessages = require('../../shared/messages/http');

/**
 * @file Controlador para gestionar los endpoints relacionados con países.
 * Este archivo define las funciones que manejan las solicitudes HTTP relacionadas
 * con la consulta de países, gestión de favoritos y control de errores.
 * 
 * @module paisController
 */

/**
 * @swagger
 * tags:
 *   - name: Gestión de Países
 *     description: Endpoints para consultar países, gestionar favoritos y validaciones regionales.
 */

/**
 * @swagger
 * /pais/{nombre}:
 *   get:
 *     summary: Consulta información de un país por nombre.
 *     description: Retorna detalles como capital, región, moneda, idiomas y población.
 *     tags: [Gestión de Países]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre (completo o parcial) del país a consultar.
 *     responses:
 *       200:
 *         description: Información del país obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pais'
 *       400:
 *         description: Nombre de país inválido o vacío.
 *       404:
 *         description: País no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
exports.obtenerPais = async (req, res) => {
  const nombre = req.params.nombre?.trim();

  if (!nombre) {
    return res.status(400).json({ message: 'El nombre del país es requerido' });
  }

  try {
    const pais = await paisService.obtenerPais(nombre);
    return res.status(200).json(pais.toJSON());
  } catch (error) {
    if (error.message.includes('País no encontrado')) {
      return res.status(404).json({ message: 'País no encontrado' });
    }

    logger.error(`❌ Error inesperado en obtenerPais: ${error.message}`);
    return res.status(500).json({ message: `${httpMessages.INTERNAL_ERROR}: ${error.message}` });
  }
};

/**
 * @swagger
 * /pais/favorito:
 *   post:
 *     summary: Agrega un país a la lista de favoritos.
 *     tags: [Gestión de Países]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pais
 *             properties:
 *               pais:
 *                 type: string
 *                 example: Chile
 *     responses:
 *       201:
 *         description: País agregado exitosamente a favoritos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pais'
 *       400:
 *         description: País inválido o ya existe en favoritos.
 *       403:
 *         description: País restringido (lista negra).
 *       500:
 *         description: Error interno del servidor.
 */
exports.agregarFavorito = async (req, res) => {
  const { pais } = req.body;

  if (!pais || pais.trim() === '') {
    return res.status(400).json({ message: 'Debe enviar un país en el cuerpo' });
  }

  try {
    const paisFavorito = await favoritosService.agregarFavorito(pais.trim());
    return res.status(201).json(paisFavorito.toJSON());
  } catch (error) {
    logger.error(`❌ Error al agregar favorito: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /pais/favoritos:
 *   get:
 *     summary: Obtiene la lista de países favoritos agrupados por región.
 *     tags: [Gestión de Países]
 *     responses:
 *       200:
 *         description: Lista agrupada de países favoritos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: array
 *                 items:
 *                   type: string
 *       500:
 *         description: Error al obtener favoritos.
 */
exports.obtenerFavoritos = async (req, res) => {
  try {
    const favoritos = await favoritosService.obtenerFavoritosAgrupados();
    return res.status(200).json(favoritos);
  } catch (error) {
    logger.error(`❌ Error al obtener favoritos: ${error.message}`);
    return res.status(500).json({ message: httpMessages.INTERNAL_ERROR });
  }
};

/**
 * @swagger
 * /pais/favorito/{nombre}:
 *   delete:
 *     summary: Elimina un país de la lista de favoritos.
 *     tags: [Gestión de Países]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del país a eliminar de favoritos.
 *     responses:
 *       200:
 *         description: País eliminado exitosamente.
 *       404:
 *         description: País no está en la lista de favoritos.
 *       500:
 *         description: Error interno del servidor.
 */
exports.eliminarFavorito = async (req, res) => {
  const nombre = req.params.nombre?.trim();

  if (!nombre) {
    return res.status(400).json({ message: 'Debe especificar un país en la URL' });
  }

  try {
    const eliminado = await favoritosService.eliminarFavorito(nombre);
    if (!eliminado) {
      return res.status(404).json({ message: 'País no se encuentra en favoritos' });
    }
    return res.status(200).json({ message: 'País eliminado de favoritos' });
  } catch (error) {
    logger.error(`❌ Error al eliminar favorito: ${error.message}`);
    return res.status(500).json({ message: httpMessages.INTERNAL_ERROR });
  }
};

/**
 * @swagger
 * /pais/ranking:
 *   get:
 *     summary: Obtiene el ranking de países más buscados agrupados por región.
 *     tags: [Gestión de Países]
 *     responses:
 *       200:
 *         description: Ranking por región.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: object
 *                 additionalProperties:
 *                   type: integer
 */
exports.obtenerRanking = async (req, res) => {
  try {
    const ranking = await require('../../domain/repositories/pais/busquedaRepository').obtenerRanking();
    return res.status(200).json(ranking);
  } catch (error) {
    logger.error(`❌ Error al obtener ranking: ${error.message}`);
    return res.status(500).json({ message: httpMessages.INTERNAL_ERROR });
  }
};


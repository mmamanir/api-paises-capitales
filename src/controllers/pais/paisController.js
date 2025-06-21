// Importación de servicios y herramientas
const paisService = require('../../domain/services/pais/paisService');
const logger = require('../../infrastructure/logger');
const httpMessages = require('../../shared/messages/http');

/**
 * @file Controlador para gestionar los endpoints relacionados con países.
 * Este archivo define las funciones que manejan las solicitudes HTTP relacionadas
 * con la consulta y gestión de países usando la API de REST Countries.
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
 *               type: object
 *               properties:
 *                 nombre:
 *                   type: string
 *                 capital:
 *                   type: string
 *                 region:
 *                   type: string
 *                 moneda:
 *                   type: string
 *                 idiomas:
 *                   type: array
 *                   items:
 *                     type: string
 *                 poblacion:
 *                   type: integer
 *       404:
 *         description: País no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
exports.obtenerPais = async (req, res) => {
  try {
    const nombre = req.params.nombre;
    const pais = await paisService.obtenerPais(nombre);
    res.status(200).json(pais);
  } catch (error) {
    logger.error(`Error al obtener país: ${error.message}`);
    res.status(500).json({ message: httpMessages.INTERNAL_ERROR + ': ' + error.message });
  }
};

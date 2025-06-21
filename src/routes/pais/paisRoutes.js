// Importar las dependencias necesarias
const express = require('express');
const router = express.Router();
const paisController = require('../../controllers/pais/paisController');
const authMiddleware = require('../../middleware/authJwt'); // Opcional, si decides proteger rutas

/**
 * @file Rutas relacionadas con la gestión de países.
 * Este archivo define las rutas para interactuar con la API de REST Countries,
 * incluyendo la consulta por nombre de país.
 * 
 * @module routes/paisRoutes
 * @requires express
 * @requires ../../controllers/paisController
 * @requires ../../middleware/authJwt
 */

/**
 * @route GET /pais/:nombre
 * @group Países - Consultar información de países
 * @param {string} nombre.path.required - Nombre (parcial o completo) del país a consultar
 * @returns {Object} 200 - Datos del país consultado
 * @returns {Error}  404 - País no encontrado
 * @returns {Error}  500 - Error interno del servidor
 * @description Consulta información detallada de un país desde la API pública REST Countries.
 */
router.get('/:nombre', paisController.obtenerPais); // Público por ahora, puedes agregar authMiddleware si lo deseas

/**
 * Exporta el router configurado para ser utilizado en la aplicación principal.
 * 
 * @exports router
 */
module.exports = router;

// Importar las dependencias necesarias
const express = require('express');
const router = express.Router();
const paisController = require('../../controllers/pais/paisController');
const bloquearListaNegra = require('../../middleware/bloquearListaNegra');

// const authMiddleware = require('../../middleware/authJwt'); // Si deseas proteger rutas

/**
 * @file Rutas relacionadas con la gestión de países.
 * Este archivo define las rutas para interactuar con la API de REST Countries,
 * gestionar países favoritos, y aplicar validaciones.
 *
 * @module routes/paisRoutes
 */


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
 *       400:
 *         description: País inválido o ya existe en favoritos.
 *       403:
 *         description: País restringido (lista negra).
 *       500:
 *         description: Error interno del servidor.
 */
// ✅ Aplica el middleware bloquearListaNegra solo al POST de favoritos
router.post('/favorito', bloquearListaNegra, paisController.agregarFavorito);

/**
 * @swagger
 * /pais/favoritos:
 *   get:
 *     summary: Obtiene la lista de países favoritos agrupados por región.
 *     tags: [Gestión de Países]
 *     responses:
 *       200:
 *         description: Lista agrupada de países favoritos.
 *       500:
 *         description: Error al obtener favoritos.
 */
router.get('/favoritos', paisController.obtenerFavoritos);

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
router.delete('/favorito/:nombre', paisController.eliminarFavorito);

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
 *       400:
 *         description: Nombre de país inválido o vacío.
 *       404:
 *         description: País no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/:nombre', paisController.obtenerPais);

module.exports = router;

// Importación de módulos y configuraciones necesarias
const swaggerJSDoc = require('swagger-jsdoc');
const config = require('../config'); // Configuración personalizada del proyecto

/**
 * @file Configuración de Swagger para la documentación de la API.
 * Este módulo configura Swagger para generar la documentación de la API,
 * utilizando las variables de entorno para definir la información del servidor,
 * las rutas y otros detalles importantes.
 * 
 * @module swaggerConfig
 */

/**
 * Variables de entorno para configurar Swagger.
 * 
 * - `hostDominio`: Dominio del servidor (por defecto: 'http://localhost').
 * - `basePath`: Ruta base de la API (por defecto: '/api').
 * - `env`: Entorno de ejecución (por defecto: 'development').
 * - `title`: Título de la aplicación (por defecto: 'Sistema General').
 */
const hostDominio = config.url_site;
const basePath = config.base_api;
const env = config.modo_entorno_env;
const title = config.title_app;

/**
 * Definición de la documentación de Swagger con autenticación Bearer JWT.
 */
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Desafío 2 – Países y Capitales: Inteligencia Geográfica',
    version: '1.0.0',
    description: `

Esta API forma parte del **Desafío 2 – Países y Capitales: Inteligencia Geográfica**, desarrollado durante la capacitación profesional en Node.js organizada por el Ministerio de Vivienda y Urbanismo.
---

📌 **Objetivo del desafío**  
Diseñar una API que consulte datos de países a través de la REST Countries API, gestione una lista de favoritos agrupada por región, registre búsquedas realizadas, aplique seguridad mediante listas negras, y genere un ranking de uso.


---

🔧 **Funciones implementadas**  
- Consulta de país por nombre ('GET /pais/{nombre}')
- Agregado a favoritos con validación ('POST /pais/favorito')
- Eliminación de favoritos ('DELETE /pais/favorito/{nombre}')
- Listado agrupado de favoritos por región ('GET /pais/favoritos')
- Ranking de países más consultados ('GET /pais/ranking')
- Control por lista negra (middleware)
- Logs estructurados de uso


---

🌐 **API externa utilizada:**  
https://restcountries.com

📁 **Persistencia local simulada:**  
Archivos JSON por región y favoritos

🛡️ **Seguridad:**  
Lista negra configurable y validaciones por zona

---

📅 **Fecha de entrega:** 16 de Julio de 2025  
👤 **Desarrolladores: mmamani@minvu.cl, smamanil@minvu.cl
🏢 **Institución:** Ministerio de Vivienda y Urbanismo

## ⚠️ Licencia
**Licencia MIT**
    `,
    contact: {
      name: 'Soporte Técnico',
      email: 'eliasalmarza25@gmail.com',
      url: 'https://www.linkedin.com/in/elias-almarza-kackschis/'
    },
    license: {
      name: 'Licencia MIT - Todos los derechos reservados',
      url: 'mailto:eliasalmarza25@gmail.com'
    }
  },
  servers: [
  {
    url: basePath || '/',
    description: `Servidor de ${env} (mismo host)`,
  },
],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingrese el token JWT en el formato: Bearer <token>',
      },
    },
  },
  // security: [{ bearerAuth: [] }],
};

/**
 * Opciones de Swagger para leer anotaciones desde los controladores.
 */
const options = {
  swaggerDefinition,
  // apis: ['./src/controllers/*/*.js'], // Cambia según cómo tengas agrupado controllers
  apis: ['./src/controllers/pais/paisController.js'] // Solo se incluye el controlador de Países para mostrar exclusivamente esa API en Swagger
};

/**
 * Genera y exporta la especificación Swagger.
 * 
 * @type {Object}
 */
const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;

// Importar módulos necesarios
const fs = require('fs');
const path = require('path');

// Ruta absoluta al archivo lista_negra.json que contiene los países bloqueados
const LISTA_NEGRA_PATH = path.join(__dirname, '../config/data/lista_negra.json');

/**
 * Middleware que bloquea el acceso a países restringidos según una lista negra.
 * 
 * Este middleware verifica si el país enviado en el cuerpo (`req.body.pais`)
 * está incluido en la lista negra. Si lo está, responde con un error 403.
 * Si no está, permite que la solicitud continúe hacia el controlador.
 * 
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware o controlador
 */
module.exports = (req, res, next) => {
  const { pais } = req.body;

  // Validar que el campo 'pais' esté presente en la solicitud
  if (!pais) {
    return res.status(400).json({ message: 'Falta el país en el cuerpo de la solicitud' });
  }

  // Leer y parsear el archivo lista_negra.json
  const listaNegra = JSON.parse(fs.readFileSync(LISTA_NEGRA_PATH, 'utf8'));

  // Verificar si el país está en la lista negra
  if (listaNegra.includes(pais.trim())) {
    return res.status(403).json({ message: 'País restringido por lista negra' });
  }

  // Si no está bloqueado, continuar con el flujo normal
  next();
};

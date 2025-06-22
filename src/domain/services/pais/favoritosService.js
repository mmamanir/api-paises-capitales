const fs = require('fs');
const path = require('path');
const paisRepository = require('../../repositories/pais/paisRepository');

const FAVORITOS_DIR = path.join(__dirname, '../../../config/data/favoritos');
const LISTA_NEGRA_PATH = path.join(__dirname, '../../../config/data/lista_negra.json');

const leerListaNegra = () => JSON.parse(fs.readFileSync(LISTA_NEGRA_PATH, 'utf8'));

/**
 * Guarda un país en favoritos si no está en la lista negra y no es duplicado.
 */
exports.agregarFavorito = async (nombre) => {
  const pais = await paisRepository.obtenerPais(nombre); // Lanza error si no existe
  const region = pais.region || 'Sin Región';

  const listaNegra = leerListaNegra();
  if (listaNegra.includes(pais.nombre)) {
    const error = new Error('País restringido por política');
    error.status = 403;
    throw error;
  }

  const regionDir = path.join(FAVORITOS_DIR, region);
  const paisPath = path.join(regionDir, `${pais.nombre}.json`);

  if (!fs.existsSync(regionDir)) {
    fs.mkdirSync(regionDir, { recursive: true });
  }

  if (fs.existsSync(paisPath)) {
    const error = new Error('País ya está en favoritos');
    error.status = 409;
    throw error;
  }

  fs.writeFileSync(paisPath, JSON.stringify(pais, null, 2));
  return pais;
};

/**
 * Lee todos los países favoritos y los agrupa por región.
 */
exports.obtenerFavoritosAgrupados = () => {
  const agrupados = {};

  if (!fs.existsSync(FAVORITOS_DIR)) {
    return agrupados; // No hay favoritos aún
  }

  const regiones = fs.readdirSync(FAVORITOS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const region of regiones) {
    const regionPath = path.join(FAVORITOS_DIR, region);
    const archivosPais = fs.readdirSync(regionPath);

    agrupados[region] = archivosPais.map(archivo => {
      const filePath = path.join(regionPath, archivo);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return data.nombre;
    });
  }

  return agrupados;
};

/**
 * Elimina un país favorito si existe.
 * @param {string} nombre - Nombre del país a eliminar.
 * @returns {boolean} true si fue eliminado, false si no se encontró.
 */
exports.eliminarFavorito = (nombre) => {
  if (!fs.existsSync(FAVORITOS_DIR)) return false;

  const regiones = fs.readdirSync(FAVORITOS_DIR);

  for (const region of regiones) {
    const paisPath = path.join(FAVORITOS_DIR, region, `${nombre}.json`);
    if (fs.existsSync(paisPath)) {
      fs.unlinkSync(paisPath);
      return true;
    }
  }

  return false;
};

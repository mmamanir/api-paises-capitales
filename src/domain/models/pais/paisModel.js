/**
 * Clase que representa un País.
 */
class Pais {
  /**
   * Crea una nueva instancia del modelo Pais.
   * @param {string} nombre - Nombre común del país.
   * @param {string} capital - Capital del país.
   * @param {string} region - Región geográfica (ej: Americas, Europe).
   * @param {string} moneda - Código de la moneda (ej: CLP, USD).
   * @param {Array<string>} idiomas - Lista de idiomas oficiales.
   * @param {number} poblacion - Población total.
   */
  constructor(nombre, capital, region, moneda, idiomas, poblacion) {
    this.nombre = nombre;
    this.capital = capital;
    this.region = region;
    this.moneda = moneda;
    this.idiomas = idiomas;
    this.poblacion = poblacion;
  }

  /**
   * Devuelve un objeto plano (serializable) del país.
   * @returns {Object} Objeto JSON del país.
   */
  toJSON() {
    return {
      nombre: this.nombre,
      capital: this.capital,
      region: this.region,
      moneda: this.moneda,
      idiomas: this.idiomas,
      poblacion: this.poblacion,
    };
  }
}

module.exports = Pais;

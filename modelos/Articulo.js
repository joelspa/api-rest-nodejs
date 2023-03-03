const { Schema, model } = require("mongoose"); // Importamos el modelo de mongoose

// Creamos el esquema de la base de datos
const ArticuloSchema = Schema({
  titulo: {
    type: String,
    require: true,
  },
  contenido: {
    type: String,
    require: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  imagen: {
    type: String,
    default: "default.png",
  },
});

//  Exportamos el modelo
module.exports = model("Articulo", ArticuloSchema, "articulos");
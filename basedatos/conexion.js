const mongoose = require("mongoose");  // Mongoose sirver para conectar a la base de datos

// Conexión a la base de datos
const conexion = async () => {

    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect("mongodb://127.0.0.1:27017/blog");

        console.log("Conexión con la base de datos exitosa!");

    } catch (error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos");
    }

}

// Exportamos el modulo
module.exports = {
    conexion
}
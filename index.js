const { conexion } = require("./basedatos/conexion"); // Conectar a la base de datos
const express = require("express"); // Sirve para crear el servidor
const cors = require("cors"); // Permite que un cliente se conecte a otro servidor para el intercambio de recursos
const res = require("express/lib/response"); // Para poder usar el response

// Inicializar app
console.log("App de NodeJS iniciada");

// Conectar a la base de datos
conexion();

// Crear servidor Node
const app = express();
const puerto = 3900;
// Configurar cors
app.use(cors());

// Convertir body a objeto js
app.use(express.json()); // recibir datos con content-type app/json
app.use(express.urlencoded({ extended: true })); // recibir datos por form-urlencoded

// RUTAS
const rutas_articulo = require("./rutas/articulo");

//Cargo las rutas
app.use("/api", rutas_articulo);

// Rutas de prueba hardcodeadas
app.get("/probando", (req, res) => {
  console.log("Se ha ejecutado el endpoint probando");

  return res.status(200).send([
    {
      curso: "Master en React",
      autor: "Victor Robles",
      url: "masterreact.com",
    },
    {
      curso: "Master en React",
      autor: "Victor Robles",
      url: "masterreact.com",
    },
  ]);
});

// Ruta de prueba
app.get("/", (req, res) => {
  return res.status(200).send("<h1>Empezando a crear un api rest con Node");
});

// Crear servidor y escuchar peticiones HTTP
app.listen(puerto, () => {
  console.log("Servidor corriendo en el puerto " + puerto);
});

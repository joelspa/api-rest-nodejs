const fs = require("fs"); // Para trabajar con el sistema de ficheros
const path = require("path"); // Para trabajar con rutas de ficheros
const { validarArticulo } = require("../helpers/validar")
const Articulo = require("../modelos/Articulo");

// Funcion de prueba
const prueba = (req, res) => {
  return res.status(200).json({
    mensaje: "Soy una acción de prueba en mi controlador de articulos",
  });
};

// Funcion de prueba
const curso = (req, res) => {
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
};

// Funcion para crear un articulo
const crear = (req, res) => {
  // Recoger parametros por POST a guardar
  let parametros = req.body;

  // Validar datos
  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar"
    });
  }

  // Crear el objeto a guardar
  const articulo = new Articulo(parametros);

  // Asignar valores a objeto basado en el modelo (manual o automatico)
  //  articulo.titulo = parametros.titulo;

  // Guardar el articulo en la base de datos
  articulo.save((error, articuloGuardado) => {
    if (error || !articuloGuardado) {
      return res.status(400).json({
        status: "error",
        mensaje: "No se ha guardado el articulo",
      });
    }

    // Devolver resultado
    return res.status(200).json({
      stauts: "success",
      articulo: articuloGuardado,
      mensaje: "Articulo creado con exito!!",
    });
  });
};

// Funcion para listar los articulos
const listar = (req, res) => {
  let consulta = Articulo.find({});

  if (req.params.ultimos) {

    consulta.limit(3);

  }

  consulta.sort({ fecha: -1 }) // Artculo más nuevo primero
    .exec((error, articulos) => {
      if (error || !articulos) {
        return res.status(404).json({
          status: "error",
          mensaje: "No se han encontrado artículos!!",
        });
      }

      return res.status(200).send({
        status: "success",
        // parametro: req.params.ultimos,
        contador: articulos.length,
        articulos,
      });
    });
};

// Funcion para listar un articulo
const uno = (req, res) => {

  // Recoger un id por la url
  let id = req.params.id;

  // Buscar el artículo
  Articulo.findById(id, (error, articulo) => {

    // Si no existe devolver error
    if (error || !articulo) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se ha encontrado el artículo"
      });
    };

    // Devolver resultado
    return res.status(200).json({
      status: "success",
      articulo
    })
  })
};

// Funcion para eliminar un articulo
const eliminar = (req, res) => {

  let articuloId = req.params.id;

  // Metodo para elimnar       _id = id de la base de datos de mongoDB
  Articulo.findOneAndDelete({ _id: articuloId }, (error, articuloBorrado) => {

    if (error || !articuloBorrado) {
      return res.status(500).json({
        status: "error",
        mensaje: "Error al eliminar el articulo"
      });
    }

    return res.status(200).json({
      status: "success",
      articulo: articuloBorrado,
      mensaje: "Metodo eliminar"
    });
  });
};

// Funcion para editar un articulo
const editar = (req, res) => {
  // Recoger id articulo a editar
  let articuloId = req.params.id;

  // Recoger datos del body
  let parametros = req.body;

  // Validar datos
  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar"
    });
  }

  // Buscar y actualizar articulo
  Articulo.findOneAndUpdate({ _id: articuloId }, parametros, (error, articuloActualizado) => {

    if (error || !articuloActualizado) {
      return res.status(500).json({
        status: "error",
        mensaje: "Error al editar"
      });
    };

    // Devolver respuesta
    return res.status(200).json({
      status: "success",
      articulo: articuloActualizado
    });
  });
};

// Funcion para subir una imagen
const subir = (req, res) => {

  // Configurar multer para subir archivos

  // Recoger el fichero de imagen subido
  if (!req.file && !req.files) {
    return res.status(400).json({
      status: "error",
      mensaje: "Peticion invalida"
    })
  }

  // Nombre del archivo
  let archivo = req.file.originalname;

  // Extension del archivo
  let archivo_split = archivo.split("\.");
  let archivo_extension = archivo_split[1];

  // Comprobar extension correcta
  if (archivo_extension != "png" && archivo_extension != "jpg" &&
    archivo_extension != "jpeg" && archivo_extension != "gif") {

    // Borrar archivo y dar respuerta
    fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: "error",
        mensaje: "Formato de archivo no compatible"
      });
    })
  } else {

    // Si todo va bien, actualizar el articulo

    // Recoger id articulo a editar
    let articuloId = req.params.id;

    // Buscar y actualizar articulo
    Articulo.findOneAndUpdate({ _id: articuloId }, { imagen: req.file.filename }, { new: true }, (error, articuloActualizado) => {

      if (error || !articuloActualizado) {
        return res.status(500).json({
          status: "error",
          mensaje: "Error al editar"
        });
      };

      // Devolver respuesta
      return res.status(200).json({
        status: "success",
        articulo: articuloActualizado,
        fichero: req.file
      });
    });
  }
}

// Funcion para verificar si existe una imagen
const imagen = (req, res) => {
  let fichero = req.params.fichero;
  let ruta_fisica = "./imagenes/articulos/" + fichero;

  fs.stat(ruta_fisica, (error, existe) => {
    if (existe) {
      return res.sendFile(path.resolve(ruta_fisica));
    } else {
      return res.status(404).json({
        status: "error",
        mensaje: "La imagen no existe",
        existe,
        fichero,
        ruta_fisica
      });
    }
  })
}

// Funcion para buscar articulos
const buscador = (req, res) => {
  // Sacar el String de busqueda
  let busqueda = req.params.busqueda;

  // Find OR 
  Articulo.find({
    "$or": [
      { "titulo": { "$regex": busqueda, "$options": "i" } },
      { "contenido": { "$regex": busqueda, "$options": "i" } }
    ]
  })
    .sort({ fecha: -1 })
    .exec((error, articulosEncontrados) => {

      if (error || !articulosEncontrados || articulosEncontrados.length <= 0) {
        return res.status(404).json({
          status: "error",
          mensaje: "No se han encontrado articulos"
        });
      }

      return res.status(200).json({
        status: "success",
        articulos: articulosEncontrados
      })
    });
}

// Exportar las funciones
module.exports = {
  prueba,
  curso,
  crear,
  listar,
  uno,
  eliminar,
  editar,
  subir,
  imagen,
  buscador
};

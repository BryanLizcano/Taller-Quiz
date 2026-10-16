const librosService = require('../services/librosService');

const obtenerLibros = (req, res) => {
    const libros = librosService.listarLibros();
    return res.status(200).json(libros);
};

const crearLibro = (req, res) => {
    try {
        const nuevoLibro = librosService.crearLibro(req.body);
        return res.status(201).json(nuevoLibro);
    } catch (error) {
        const status = error.status || 400;
        return res.status(status).json({
            mensaje: error.message,
            error: error.message
        });
    }
};

const eliminarLibro = (req, res) => {
    try {
        librosService.eliminarLibro(req.params.id);
        return res.status(204).send();
    } catch (error) {
        const status = error.status || 404;
        return res.status(status).json({
            mensaje: error.message,
            error: error.message
        });
    }
};

module.exports = {
    obtenerLibros,
    crearLibro,
    eliminarLibro
};

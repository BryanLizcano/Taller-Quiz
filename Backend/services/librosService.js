const librosRepository = require('../repositories/librosRepository');

const listarLibros = () => {
    return librosRepository.obtenerTodos();
};

const crearLibro = (datos) => {
    const { titulo, autor } = datos || {};

    if (!titulo || !autor || String(titulo).trim() === '' || String(autor).trim() === '') {
        const error = new Error('El título y el autor son obligatorios');
        error.status = 400;
        throw error;
    }

    return librosRepository.crear({
        titulo: String(titulo).trim(),
        autor: String(autor).trim()
    });
};

const eliminarLibro = (id) => {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
        const error = new Error('Libro no encontrado');
        error.status = 404;
        throw error;
    }

    const eliminado = librosRepository.eliminarPorId(numericId);
    if (!eliminado) {
        const error = new Error('Libro no encontrado');
        error.status = 404;
        throw error;
    }
};

module.exports = {
    listarLibros,
    crearLibro,
    eliminarLibro
};

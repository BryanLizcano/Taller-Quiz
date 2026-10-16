const db = require('../config/db');

const obtenerTodos = () => {
    const stmt = db.prepare('SELECT id, titulo, autor FROM libros');
    return stmt.all();
};

const crear = ({ titulo, autor }) => {
    const stmt = db.prepare('INSERT INTO libros (titulo, autor) VALUES (?, ?)');
    const info = stmt.run(titulo, autor);
    return {
        id: Number(info.lastInsertRowid),
        titulo,
        autor
    };
};

const eliminarPorId = (id) => {
    const stmt = db.prepare('DELETE FROM libros WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
};

module.exports = {
    obtenerTodos,
    crear,
    eliminarPorId
};

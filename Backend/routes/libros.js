const express = require('express');
const router = express.Router();
const librosController = require('../controllers/librosController');

router.get('/', librosController.obtenerLibros);
router.post('/', librosController.crearLibro);
router.delete('/:id', librosController.eliminarLibro);

module.exports = router;

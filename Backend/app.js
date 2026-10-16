const cors = require('cors');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const librosRoutes = require('./routes/libros');

const app = express();

// Middlewares
app.use(
    cors({
        origin: 'http://localhost:5173'
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use('/api/libros', librosRoutes);

module.exports = app;

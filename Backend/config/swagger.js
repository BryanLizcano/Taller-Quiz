const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'API de Biblioteca',
        version: '1.0.0',
        description: 'Documentación de la API de Biblioteca'
    },
    components: {
        schemas: {
            Libro: {
                type: 'object',
                required: ['id', 'titulo', 'autor'],
                properties: {
                    id: {
                        type: 'integer',
                        description: 'ID autoincremental del libro',
                        example: 1
                    },
                    titulo: {
                        type: 'string',
                        description: 'Título del libro',
                        example: 'Cien años de soledad'
                    },
                    autor: {
                        type: 'string',
                        description: 'Autor del libro',
                        example: 'Gabriel García Márquez'
                    }
                }
            }
        }
    },
    paths: {
        '/api/libros': {
            get: {
                summary: 'Obtener la lista de libros',
                tags: ['Libros'],
                responses: {
                    '200': {
                        description: 'Lista de libros',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Libro'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                summary: 'Crear un nuevo libro',
                tags: ['Libros'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['titulo', 'autor'],
                                properties: {
                                    titulo: {
                                        type: 'string',
                                        description: 'Título del libro',
                                        example: 'Cien años de soledad'
                                    },
                                    autor: {
                                        type: 'string',
                                        description: 'Autor del libro',
                                        example: 'Gabriel García Márquez'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Libro creado exitosamente',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Libro'
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Falta título o autor (o vienen vacíos)'
                    }
                }
            }
        },
        '/api/libros/{id}': {
            delete: {
                summary: 'Eliminar un libro por ID',
                tags: ['Libros'],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'integer'
                        },
                        description: 'ID del libro a eliminar'
                    }
                ],
                responses: {
                    '204': {
                        description: 'Libro eliminado sin cuerpo'
                    },
                    '404': {
                        description: 'Libro no encontrado'
                    }
                }
            }
        }
    }
};

module.exports = swaggerSpec;

# API REST de Biblioteca

Backend en **Node.js** y **Express** para la gestión de libros en memoria.

## Modelo de Datos (Libro)

```json
{
  "id": 1,
  "titulo": "Cien años de soledad",
  "autor": "Gabriel García Márquez"
}
```

## Endpoints de la API

| Método | Endpoint | Descripción | Respuesta |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/libros` | Lista de libros | `200 OK` |
| `POST` | `/api/libros` | Crea un libro (`{ titulo, autor }`) | `201 Created` / `400 Bad Request` |
| `DELETE` | `/api/libros/:id` | Elimina un libro por ID | `204 No Content` / `404 Not Found` |

# API - Spring Boot + MySQL

Esta API permite la gestión de artículos, pedidos y usuarios desarrollada en Java con Spring Boot y MySQL.

## Requisitos

Para correr esta API es necesario disponer de:
- Java 17+
- MySQL 8 corriendo en localhost:3306
- Base de datos articulos_db creada en MySQL

## Endpoints de la API

### Artículos
GET  /api/articulos -> Listar todos los artículos
GET  /api/articulos/{id} -> Obtener artículo por ID
POST /api/articulos -> Crear nuevo artículo
PUT  /api/articulos/{id} -> Actualizar artículo existente
DELETE /api/articulos/{id} -> Eliminar artículo

**Basandome en como desarrollamos todo lo de articulos genere para:** 
### Usuarios
GET /api/usuarios -> Listar todos los usuarios
GET /api/usuarios/{id} -> Obtener usuario por ID
POST /api/usuarios/registro -> Registrar nuevo usuario

### Pedidos
POST /api/pedidos -> Crear un pedido (valida stock y lo descuenta automáticamente)

### Pedidos por usuario
GET /api/usuarios/{id}/pedidos -> Historial de pedidos de un usuario

**Me falto Categorias por cuestiones de tiempo pero se utiliza a partir de un menu desplegable en el frontend y que lo graba en la tabla articulo como varchar...futura actualizacion**

## Frontend

### Mi Frontend (frontend_actualizado)
El proyecto incluye un frontend web en la carpeta `frontend_actualizado` con 4 secciones:

1. **Artículos** - CRUD completo con formulario para todos los campos (nombre, descripción, precio, categoría, stock, imagen)
2. **Carrito** - Arma pedidos seleccionando productos y cantidades, los envía a la API
3. **Pedidos** - Consulta el historial de pedidos por ID de usuario
4. **Usuarios** - Registra nuevos usuarios y lista los existentes

### Frontend de la profesora (crud_articulos_frontend)
La API también es compatible con el frontend original de la profesora (crud_articulos_frontend), que permite el CRUD básico de artículos. Ese frontend funciona con los endpoints GET/POST/PUT/DELETE /api/articulos y maneja los campos nombre y precio. Los nuevos campos (descripcion, categoria, stock, imagen) se pueden setear desde Postman o desde mi frontend (frontend_actualizado).

### Postman
Todos los endpoints se pueden probar con Postman utilizando las rutas mencionadas arriba
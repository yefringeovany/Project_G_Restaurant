# 🍽️ Sistema de Gestión de Pedidos para Restaurante

Este proyecto es un sistema de gestión de pedidos diseñado para restaurantes, el cual puede ser utilizado tanto en dispositivos móviles como en computadoras. Su propósito principal es facilitar el registro de pedidos, gestión de menús, control de órdenes en cocina y entrega de pedidos por parte del personal del restaurante.

## 🛠️ Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- JavaScript

### Base de Datos
- MySQL

### Frontend
- Angular
- Bootstrap
- Material UI
- HTML5
- CSS3

## ⚙️ Funcionalidades Principales

### 🔐 Inicio de Sesión
- Ingreso mediante usuario y contraseña.
- Opción para registrarse si no se tiene una cuenta.
  ![Image](https://github.com/user-attachments/assets/87ab6ada-4d42-4875-b8b1-f2a2195ce24a)

### 📝 Registro de Usuario
- Campos: Nombre, Apellido, Correo Electrónico, Contraseña, Rol.
- Roles disponibles: Mesero, Cocinero, Administrador, etc.
- Al registrarse, redirecciona automáticamente al login.

### 📊 Dashboard
- Visualización en tiempo real de las órdenes generadas durante el día.
- Contador automático de órdenes preparadas y entregadas.

### 📁 Gestión de Categorías
- Crear nuevas categorías para los menús.
- Campos: Nombre, Descripción, Estado (ACTIVO o INACTIVO).

### 🍽️ Gestión de Menú
- Crear elementos del menú asignados a una categoría.
- Campos: Categoría, Nombre, Descripción, Precio, Estado, Imagen.

### 🧾 Creación de Orden
- Selección de categoría y menú.
- Ingreso de cantidad, cálculo automático del monto total y cambio.
- Ingreso del pago recibido.

### 👨‍🍳 Vista de Cocina
- Visualización de pedidos pendientes.
- Marcar pedidos como "ENTREGADOS" una vez estén listos.

---

## 📥 Instalación y Configuración en Localhost

### 1. Clonar el Repositorio

```bash
git clone https://github.com/yefringeovany/Project_G_Restaurant.git
cd (name_proyecto)


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

  ![Image](https://github.com/user-attachments/assets/e17577d8-6dca-4fe6-b221-2d709ddd303b)

### 📊 Dashboard
- Visualización en tiempo real de las órdenes generadas durante el día.
- Contador automático de órdenes preparadas y entregadas.
  ![Image](https://github.com/user-attachments/assets/2bd7f86a-07dc-402a-a2c6-fe52f604711c)

### 📁 Gestión de Categorías
- Crear nuevas categorías para los menús.
- Campos: Nombre, Descripción, Estado (ACTIVO o INACTIVO).
  ![Image](https://github.com/user-attachments/assets/20d8c550-b4b1-46ba-b39d-2e761d485c0c)

### 🍽️ Gestión de Menú
- Crear elementos del menú asignados a una categoría.
- Campos: Categoría, Nombre, Descripción, Precio, Estado, Imagen.
  ![image](https://github.com/user-attachments/assets/0b535339-5d78-4fb1-98ea-b8ad78ba4bb5)

### 🧾 Creación de Orden
- Selección de categoría y menú.
- Ingreso de cantidad, cálculo automático del monto total y cambio.
- Ingreso del pago recibido.
  ![Image](https://github.com/user-attachments/assets/401d01ad-4035-48e0-98d0-1c9c0fb366b8)

### 👨‍🍳 Vista de Cocina
- Visualización de pedidos pendientes.
- Marcar pedidos como "ENTREGADOS" una vez estén listos.
  ![Image](https://github.com/user-attachments/assets/fdd79e1b-72c7-40c8-bea2-68134869d287)

---

## 📥 Instalación y Configuración en Localhost

**Clone the project**

```bash
  git clone https://github.com/yefringeovany/Project_G_Restaurant.git
```

**Go to the project directory**

```bash
  cd my-project
```

**Install dependencies**

```bash
  npm install
```

**Start the server**

```bash
  npm run dev
```


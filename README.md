# 🚗 Sistema de Alquiler de Autos María

<div align="center">
  <img src="https://img.shields.io/badge/status-en%20desarrollo-yellow" alt="Estado del Proyecto">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Versión">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="Licencia">
</div>

<div align="center">
  <img src="https://i.postimg.cc/TRhbVczX/logo-alquileres.jpg" alt="Sistema de Alquiler de Autos" width="500">
</div>

## 📋 Índice

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Estado del Proyecto](#-estado-del-proyecto)
- [Demostración de Funciones](#-demostración-de-funciones-y-aplicaciones)
- [Acceso al Proyecto](#-acceso-al-proyecto)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Personas Contribuyentes](#-personas-contribuyentes)
- [Desarrolladores](#-personas-desarrolladoras-del-proyecto)
- [Licencia](#-licencia)

## 📖 Descripción del Proyecto

Sistema completo de gestión de alquiler de automóviles que permite a los usuarios reservar vehículos, gestionar conductores, procesar pagos y administrar sucursales. El sistema cuenta con tres tipos de usuarios (Administrador, Empleado y Cliente) cada uno con funcionalidades específicas según su rol.

### Características Principales

- **Gestión de Reservas**: Sistema completo para crear, modificar y cancelar reservas de vehículos
- **Administración de Vehículos**: Catálogo de vehículos con información detallada, imágenes y disponibilidad
- **Gestión de Usuarios**: Sistema de autenticación con roles (Admin, Empleado, Cliente)
- **Procesamiento de Pagos**: Integración de métodos de pago con tarjetas de crédito
- **Gestión de Conductores**: Registro y validación de conductores autorizados
- **Sistema de Sucursales**: Administración de múltiples sucursales
- **Recuperación de Contraseña**: Sistema de recuperación vía correo electrónico
- **Tareas Programadas**: Mantenimiento automático y notificaciones

## 🚦 Estado del Proyecto

<h4 align="center">
⚠️ Proyecto en Desarrollo
</h4>

El proyecto está actualmente en fase de desarrollo activo. Las funcionalidades principales están implementadas y funcionales, pero se continúa trabajando en mejoras y nuevas características.

### ✅ Funcionalidades Completadas

- ✓ Sistema de autenticación y autorización
- ✓ CRUD completo de vehículos
- ✓ Gestión de reservas
- ✓ Administración de usuarios y empleados
- ✓ Sistema de pagos con tarjetas
- ✓ Gestión de conductores
- ✓ Recuperación de contraseña
- ✓ Panel de administración
- ✓ Panel de empleados
- ✓ Panel de clientes

### 🔄 En Desarrollo

- 🔨 Reportes y estadísticas avanzadas
- 🔨 Sistema de notificaciones en tiempo real
- 🔨 Optimización de rendimiento
- 🔨 Tests automatizados

## 🎯 Demostración de Funciones y Aplicaciones

### Roles y Funcionalidades

#### 👨‍💼 Administrador
- Gestión completa de vehículos (crear, editar, eliminar)
- Administración de empleados y sucursales
- Visualización de todas las reservas
- Reportes y estadísticas del sistema
- Configuración de precios y disponibilidad

#### 👔 Empleado
- Crear reservas para clientes
- Registrar entrega y devolución de vehículos
- Modificar conductores autorizados
- Gestionar pagos
- Visualizar reservas por sucursal
- Actualizar información de sucursal

#### 👤 Cliente
- Buscar y filtrar vehículos disponibles
- Crear reservas de vehículos
- Ver historial de reservas
- Gestionar conductores autorizados
- Actualizar perfil y métodos de pago

### Funcionalidades Destacadas

1. **Sistema de Autenticación JWT**: Seguridad robusta con tokens de acceso
2. **Validación de Conductores**: Sistema de verificación de conductores autorizados
3. **Cálculo Automático de Tarifas**: Precios dinámicos según duración y tipo de vehículo
4. **Gestión de Imágenes**: Sistema de carga y almacenamiento de imágenes de vehículos
5. **Email Automatizado**: Notificaciones por correo para recuperación de contraseña
6. **Programación de Tareas**: Mantenimiento automático con node-cron

## 🚀 Acceso al Proyecto

### Prerrequisitos

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/AlquilerDeAutosMaria.git
cd AlquilerDeAutosMaria
```

2. **Configurar el Backend**
```bash
cd Backend
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la carpeta Backend:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=alquileres
PORT=3000
JWT_SECRET=tu_clave_secreta

# Configuración de Email
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_contraseña_app
```

4. **Configurar la base de datos**
```sql
CREATE DATABASE alquileres;
-- Ejecutar los scripts SQL necesarios para crear las tablas
```

5. **Configurar el Frontend**
```bash
cd ../frontend
npm install
```

6. **Configurar la API en el Frontend**

Crear archivo de configuración en `frontend/src/config.js`:
```javascript
export const API_URL = 'http://localhost:3000';
```

### Ejecución en Desarrollo

**Backend:**
```bash
cd Backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

El frontend estará disponible en `http://localhost:5173` y el backend en `http://localhost:3000`

### Build para Producción

**Frontend:**
```bash
cd frontend
npm run build
```

## 🛠️ Tecnologías Utilizadas

### Backend
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
- ![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
- ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
- ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

#### Dependencias Principales del Backend
- **Express**: Framework web para Node.js
- **MySQL2**: Cliente MySQL para Node.js con soporte de promesas
- **bcrypt/bcryptjs**: Encriptación de contraseñas
- **jsonwebtoken**: Autenticación basada en tokens JWT
- **nodemailer**: Envío de correos electrónicos
- **multer**: Manejo de archivos multipart/form-data
- **node-cron**: Programación de tareas automáticas
- **dotenv**: Gestión de variables de entorno
- **cors**: Middleware para habilitar CORS
- **dayjs**: Manipulación de fechas

### Frontend
- ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
- ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
- ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
- ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

#### Dependencias Principales del Frontend
- **React 19**: Biblioteca principal para la UI
- **React Router DOM**: Enrutamiento de la aplicación
- **Axios**: Cliente HTTP para llamadas API
- **React Toastify**: Notificaciones toast elegantes
- **Tailwind CSS**: Framework de utilidades CSS
- **jwt-decode**: Decodificación de tokens JWT
- **Vite**: Build tool y dev server rápido
- **dayjs**: Manipulación de fechas

### Herramientas de Desarrollo
- **Nodemon**: Reinicio automático del servidor en desarrollo
- **ESLint**: Linting de código JavaScript/React
- **PostCSS**: Procesamiento de CSS
- **Autoprefixer**: Prefijos CSS automáticos

## 🤝 Personas Contribuyentes

Actualmente este es un proyecto individual, pero las contribuciones son bienvenidas. Si deseas contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Cómo Contribuir

- 🐛 Reportar bugs
- 💡 Sugerir nuevas funcionalidades
- 📝 Mejorar la documentación
- ✨ Implementar nuevas características
- 🎨 Mejorar el diseño UI/UX

## 👨‍💻 Personas Desarrolladoras del Proyecto

<div align="center">
  <table>
    <td align="center">
      <a href="https://github.com/fabioo66">
        <img src="https://github.com/fabioo66.png" width="100px;" alt="Fabio"/>
        <br />
        <sub><b>Fabio Torrejon</b></sub>
      </a>
      <br />
      <sub>Backend & DevOps</sub>
    </td>
    <td align="center">
      <a href="https://github.com/valenaruanno">
        <img src="https://github.com/valenaruanno.png" width="100px;" alt="Fabio"/>
        <br />
        <sub><b>Valentin Aruanno</b></sub>
      </a>
      <br />
      <sub>Backend & DevOps</sub>
    </td><td align="center">
      <a href="https://github.com/Diego-JPH">
        <img src="https://github.com/Diego-JPH.png" width="100px;" alt="Fabio"/>
        <br />
        <sub><b>Diego Pingo Hisbes</b></sub>
      </a>
      <br />
      <sub>Backend & DevOps</sub>
    </td>
  </tr>
  </table>
</div>

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.

### MIT License

```
Copyright (c) 2026 Sistema de Alquiler de Autos María

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">
  <p>⭐️ Si este proyecto te ha sido útil, considera darle una estrella en GitHub ⭐️</p>
  <p>Desarrollado con ❤️ por el equipo de Alquiler de Autos María</p>
  <p>© 2026 - Todos los derechos reservados</p>
</div>

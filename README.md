# 🌌 Portfolio Fullstack — Leandro Martin Lalanda

Un portfolio web fullstack moderno de alto rendimiento con estética **Dark Obsidian**, fondo procedural interactivo de **Cromo Líquido en Canvas**, y un **Panel de Administración** completo con autenticación JWT para gestionar proyectos, experiencia laboral, educación y habilidades técnicas en tiempo real.

---

## ✨ Características Principales

- **Diseño & UX Premium**:
  - Estética *Dark Obsidian / Onyx* (`#030304`) con bordes especulares de vidrio (*Glassmorphism*).
  - Fondo procedural interactivo en **HTML5 Canvas** con ondas 3D de cromo líquido metálico reactivas al scroll y movimiento del cursor.
  - Estrellas cromadas 3D flotantes y badges metálicos.
  - Navegación fluida (*Smooth Scrolling*) entre secciones.
- **Panel de Administración (Admin Dashboard)**:
  - Autenticación segura mediante **JWT** (JSON Web Tokens) y contraseñas hasheadas con **bcrypt**.
  - Edición *in-line* fluida con animación suave tipo acordeón (*cubic-bezier ease-in-out*).
  - Subida inteligente de imágenes con **compresión automática en Canvas** (optimiza imágenes pesadas de +10MB o +1080p evitando límites de MongoDB).
  - CRUD completo de:
    - 📂 **Proyectos**: título, descripción, tecnologías, enlaces a GitHub/Demo, e indicador de proyecto destacado.
    - 💼 **Experiencia Laboral**: empresa, puesto, período de tiempo y descripción.
    - 🎓 **Educación y Certificaciones**: institución, título y fechas.
    - ⚡ **Habilidades Técnicas**: categorizadas por Frontend, Backend, etc.
- **Arquitectura Fullstack**:
  - **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, HTML5 Canvas 2D.
  - **Backend**: Node.js, Express, MongoDB Atlas (Mongoose/Driver Nativo), JWT, express-validator.

---

## 🚀 Estructura del Repositorio

```text
├── portfolio-backend/      # Servidor API REST con Express y MongoDB
│   ├── config/             # Conexión a la base de datos MongoDB Atlas
│   ├── controllers/        # Controladores CRUD (perfil, proyectos, exp, edu, skills)
│   ├── middlewares/        # Autenticación JWT y validadores
│   ├── models/             # Modelos de datos
│   ├── routes/             # Endpoints de la API
│   └── server.js           # Punto de entrada del backend
│
├── portfolio-frontend/     # Aplicación Cliente SPA en React + Vite
│   ├── src/
│   │   ├── components/     # Componentes (Canvas, Navbar, Hero, ProjectCard, Timeline, etc.)
│   │   ├── context/        # AuthContext para sesión de administrador
│   │   ├── pages/          # Home pública y Admin Dashboard / Login
│   │   ├── services/       # Clientes Axios para comunicación con la API
│   │   └── index.css       # Sistema de diseño Obsidian
│   └── package.json
│
├── .gitignore              # Ignora node_modules, .env y archivos temporales
└── README.md               # Documentación del proyecto
```

---

## 🛠️ Instalación y Ejecución Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
cd TU_REPOSITORIO
```

### 2. Configurar y Levantar el Backend
```bash
cd portfolio-backend
npm install

# Crear archivo .env en portfolio-backend con tus variables:
# PORT=4000
# MONGO_URI=mongodb+srv://...
# JWT_SECRET=tu_clave_secreta

npm run dev
```
El servidor backend se iniciará en `http://localhost:4000`.

### 3. Configurar y Levantar el Frontend
En otra terminal:
```bash
cd portfolio-frontend
npm install
npm run dev
```
La aplicación cliente se abrirá en `http://localhost:5173`.

---

## 👤 Autor

**Leandro Martin Lalanda**  
- **Rol**: Programador de videojuegos & Desarrollador Web Full Stack  
- **Email**: `lalandaleandro@gmail.com`

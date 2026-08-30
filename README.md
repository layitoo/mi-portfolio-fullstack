# Portfolio Web Full Stack

Aplicación web profesional diseñada con arquitectura desacoplada cliente-servidor, estética **Dark Obsidian Glassmorphism**, renderizado procedural en Canvas 2D, integración con **Cloudinary** para almacenamiento de medios en la nube, despacho de correos transaccionales con **Resend** y un **Panel de Administración integral** con autenticación basada en JSON Web Tokens (JWT).

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Stack Tecnológico](#stack-tecnológico)
- [Características y Funcionalidades](#características-y-funcionalidades)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación de la API REST](#documentación-de-la-api-rest)
- [Instalación y Configuración Local](#instalación-y-configuración-local)
- [Variables de Entorno](#variables-de-entorno)
- [Autor](#autor)

---

## Descripción General

El proyecto constituye una plataforma integral para la presentación y gestión de proyectos de **Desarrollo Web Full Stack**, **Diseño y Modelado 3D** y **Desarrollo de Videojuegos**. 

Incorpora un diseño visual avanzado inspirado en estéticas oscuras metálicas (*Obsidian Chrome*), optimizado para alto rendimiento (60 FPS) y una experiencia de usuario fluida con microanimaciones vectoriales, navegación reactiva, visor de galería en pantalla completa y soporte multivariable.

---

## Stack Tecnológico

### Frontend
- **Framework & Bundler:** React 18, Vite
- **Estilos & Animaciones:** Tailwind CSS, CSS3 avanzado (Grid Accordions, Mask Gradients, Glassmorphism, animaciones cúbicas de entrada/salida)
- **Renderizado Gráfico:** HTML5 Canvas 2D Procedural con profundidad espacial
- **Iconografía Oficial:** Lucide React, React Icons (Simple Icons SVG para logos oficiales de marca)
- **Cliente HTTP:** Axios (con interceptores para JWT)
- **Enrutamiento:** React Router DOM v7

### Backend
- **Entorno de Ejecución:** Node.js
- **Framework Web:** Express.js
- **Base de Datos:** MongoDB Atlas (Driver oficial nativo y bulk operations)
- **Almacenamiento en la Nube:** Cloudinary SDK (`multer-storage-cloudinary`)
- **Servicio de Correos:** Resend SDK oficial
- **Autenticación y Seguridad:** JSON Web Tokens (JWT), Bcrypt, Helmet, CORS
- **Validación de Datos:** Express-Validator
- **Manejo de Archivos:** Multer

---

## Características y Funcionalidades

### 1. Diseño Visual y UX (Obsidian Glassmorphism)
- **Paleta Ónix y Brillo Especular:** Fondos oscuros profundos (`#030304`) combinados con bordes cromados traslúcidos y filtros de desenfoque `backdrop-blur-3xl`.
- **Fondo Procedural Interactivo:** Canvas 2D continuo con partículas, líneas de luz y efecto de profundidad espacial (*Parallax Multicapa*).
- **Barra de Navegación Dinámica:** Navbar flotante tipo cápsula que adapta sus dimensiones automáticamente según el estado de sesión (detecta roles `Admin` y `Editor`).
- **Edición en Vivo del Hero:** Botón sutil de lápiz cromado que permite al administrador editar su biografía/subtítulo directamente desde la portada con persistencia instantánea en MongoDB.

### 2. Galería de Proyectos & Modal Carrusel Fluido
- **Soporte Multi-Imagen:** Los proyectos permiten almacenar y mostrar múltiples fotos, capturas y renders en alta definición.
- **Modal de Pantalla Completa:** Ventana flotante con esquinas redondeadas anti-aliasing, apertura suave cinematográfica y tira de miniaturas (*thumbnails*) en cuadrícula.
- **Carrusel con Deslizamiento Lateral:** Transición continua animada con `translateX` y aceleración suave `cubic-bezier(0.25, 1, 0.5, 1)`, controlable con botones flotantes y teclado (flechas `←` / `→` y `Esc`).
- **Logos Oficiales en SVG:** Etiquetas tecnológicas clasificadas en *Core Stack* y *Styling & Tools* con sus isotipos vectoriales y colores de marca oficiales (`React`, `Node.js`, `Express`, `MongoDB`, `Tailwind CSS`, `JavaScript`, `Blender / 3D`, `Cloudinary`, `Vite`, etc.).

### 3. Servicio de Contacto y Notificaciones Reales (`Resend`)
- **Despacho Automático a Gmail:** Cada mensaje enviado desde el formulario de contacto se procesa y despacha directamente a la casilla de correo del propietario.
- **Plantilla HTML Dark Mode:** Diseño de correo adaptativo con datos del remitente, mensaje estructurado y encabezado `reply_to` configurado para responderle al visitante en 1 clic.

### 4. Almacenamiento y Optimización Cloud (`Cloudinary`)
- **Compresión Inteligente en Cliente:** Redimensionamiento y compresión automática a formato moderno WebP antes del envío, permitiendo subir imágenes pesadas (4K/8K) sin congelar la red ni saturar la base de datos.
- **Subida en Lote:** Carga simultánea de múltiples imágenes con asignación automática de foto de portada y selector de miniaturas.

### 5. Panel de Administración (CMS)
- **Acceso Protegido por URL y Token:** Autenticación robusta con JWT y control de accesos.
- **CRUD Completo:** Gestión de Perfil, Proyectos, Experiencia Laboral, Habilidades y Educación.
- **Reordenamiento Atómico:** Organización de proyectos mediante bulk write en MongoDB.
- **Alertas Glassmorphism:** Notificaciones estilizadas de éxito, advertencia y error que reemplazan los diálogos nativos del navegador.

---

## Estructura del Proyecto

```text
├── portfolio-backend/
│   ├── config/             # Configuración de base de datos MongoDB
│   ├── controllers/        # Controladores (Auth, Perfil, Proyectos, Contacto, Skills, etc.)
│   ├── middlewares/        # Autenticación JWT, roles y configuración de subida Multer/Cloudinary
│   ├── models/             # Modelos de acceso a datos en MongoDB Atlas
│   ├── routes/             # Enrutadores Express (Auth, Upload, Proyectos, Contacto, etc.)
│   ├── services/           # Servicios (EmailService con Resend, etc.)
│   ├── server.js           # Servidor Express principal
│   └── package.json
│
├── portfolio-frontend/
│   ├── src/
│   │   ├── components/     # Componentes (Navbar, Hero, ProjectCard, ProjectModal, TechIcon, etc.)
│   │   ├── context/        # Contexto global de autenticación (AuthContext)
│   │   ├── pages/          # Vistas principales (Home, AdminDashboard, Login)
│   │   ├── services/       # Servicios de API (UploadService, ContactoService, ProyectosService, etc.)
│   │   └── index.css       # Tokens de diseño, animaciones cúbicas y Tailwind CSS
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Documentación de la API REST

Base URL: `http://localhost:4000/api`

### 1. Autenticación
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Público | Inicio de sesión (Retorna token JWT y rol) |
| `POST` | `/api/auth/registro` | Público | Registro de nuevas cuentas |
| `GET` | `/api/auth/perfil` | Autenticado | Obtiene datos del usuario en sesión |

### 2. Subida de Medios (Cloudinary)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload` | Autenticado | Sube imágenes a Cloudinary y retorna URL segura HTTPS |

### 3. Proyectos & Galería
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/proyectos` | Público | Lista todos los proyectos ordenados |
| `GET` | `/api/proyectos?tech=React` | Público | Filtra proyectos por tecnología |
| `GET` | `/api/proyectos/:id` | Público | Consulta un proyecto por ID |
| `POST` | `/api/proyectos` | Autenticado | Crea un nuevo proyecto con soporte multi-imagen |
| `PUT` | `/api/proyectos/reordenar` | Autenticado | Reordena proyectos en lote |
| `PUT` | `/api/proyectos/:id` | Autenticado | Actualiza un proyecto y su galería |
| `PATCH` | `/api/proyectos/:id/destacar`| Autenticado | Alterna estado destacado |
| `DELETE` | `/api/proyectos/:id` | Solo Admin | Elimina un proyecto |

### 4. Perfil, Experiencia, Educación y Habilidades
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/perfil` | Público | Obtiene datos del perfil público |
| `PUT` | `/api/perfil` | Autenticado | Actualiza perfil e imagen de avatar |
| `GET` | `/api/experiencia` | Público | Lista trayectoria laboral |
| `POST` | `/api/experiencia` | Autenticado | Agrega nueva experiencia |
| `GET` | `/api/educacion` | Público | Lista títulos y certificaciones |
| `POST` | `/api/educacion` | Autenticado | Agrega nueva educación |
| `GET` | `/api/skills` | Público | Lista habilidades por categorías |
| `POST` | `/api/skills` | Autenticado | Registra nueva habilidad técnica |

### 5. Contacto & Métricas
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/contacto` | Público | Envía mensaje al correo real del administrador vía Resend |
| `POST` | `/api/visitas` | Público | Incrementa contador de visitas |
| `GET` | `/api/visitas` | Público | Consulta métricas de tráfico |

---

## Instalación y Configuración Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/layitoo/mi-portfolio-fullstack.git
cd mi-portfolio-fullstack
```

### 2. Configurar e Iniciar el Backend
```bash
cd portfolio-backend
npm install
npm run dev
```

### 3. Configurar e Iniciar el Frontend
En una segunda terminal:
```bash
cd portfolio-frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## Variables de Entorno

Crear un archivo `.env` dentro de la carpeta `portfolio-backend/`:

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/Portfolio?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_jwt_super_segura

# Cloudinary (Almacenamiento de imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Resend (Servicio de correos)
RESEND_API_KEY=re_tu_resend_api_key
ADMIN_EMAIL=tu_correo@gmail.com
```

---

## Autor

**Leandro Martin Lalanda**  
- **Especialidad:** Desarrollador Web Full Stack & Artista / Diseñador 3D  
- **Contacto:** `lalandaleandro@gmail.com`  
- **Repositorio:** [https://github.com/layitoo/mi-portfolio-fullstack](https://github.com/layitoo/mi-portfolio-fullstack)

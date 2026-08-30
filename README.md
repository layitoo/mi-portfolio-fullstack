# Portfolio Web Full Stack

Aplicacion web profesional disenada con arquitectura cliente-servidor desacoplada, estetica Dark Obsidian, renderizado procedural en Canvas 2D y un Panel de Administracion integral con autenticacion basada en JSON Web Tokens (JWT).

---

## Tabla de Contenidos

- [Descripcion General](#descripcion-general)
- [Stack Tecnologico](#stack-tecnologico)
- [Caracteristicas y Funcionalidades](#caracteristicas-y-funcionalidades)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentacion de la API REST](#documentacion-de-la-api-rest)
- [Instalacion y Configuracion Local](#instalacion-y-configuracion-local)
- [Variables de Entorno](#variables-de-entorno)
- [Autor](#autor)

---

## Descripcion General

El proyecto constituye una plataforma integral para la presentacion y gestion de proyectos de desarrollo de videojuegos, diseno 3D y soluciones web modernas. Incorpora un diseno visual avanzado inspirado en esteticas obsidian/metalicas, optimizado para alto rendimiento (60 FPS) y una experiencia de usuario fluida con animaciones vectoriales y navegacion reactiva.

---

## Stack Tecnologico

### Frontend
- **Framework / Bundler**: React 18, Vite
- **Estilos**: Tailwind CSS, CSS3 personalizado (Grid Accordions, Mask Gradients, Glassmorphism)
- **Renderizado Grafico**: HTML5 Canvas 2D Procedural
- **Iconografia**: Lucide React
- **Cliente HTTP**: Axios
- **Enrutamiento**: React Router DOM v6

### Backend
- **Entorno de Ejecucion**: Node.js
- **Framework Web**: Express.js
- **Base de Datos**: MongoDB Atlas (Driver nativo y agregaciones)
- **Autenticacion y Seguridad**: JSON Web Tokens (JWT), Bcrypt, Helmet, CORS
- **Validacion de Datos**: Express-Validator
- **Manejo de Archivos**: Multer

---

## Caracteristicas y Funcionalidades

1. **Diseno Visual y UX**:
   - Paleta de color base Onix (`#030304`) con bordes especulares y paneles con efecto de vidrio (*Glassmorphism*).
   - Fondo procedural interactivo continuo implementado en Canvas 2D con efecto de profundidad espacial 3D (*Parallax Multicapa*).
   - Barra de navegacion flotante fija con transicion suave de desplazamiento (*Smooth Scrolling*).

2. **Panel de Administracion (CMS)**:
   - Acceso autenticado mediante JWT y control de roles (Administrador y Editor).
   - Edicion en linea (*In-line Accordion*) con transiciones suaves calculadas via `cubic-bezier`.
   - Sistema de compresion y redimensionamiento automatico de imagenes en el cliente mediante Canvas (soporta archivos de alta resolucion evitando sobrecargar la base de datos).
   - Reordenamiento manual de proyectos mediante Drag & Drop y controles incrementales, persistiendo el orden de forma atomica en MongoDB.

3. **Optimizaciones y Modulos Avanzados**:
   - **Filtro Dinamico por Tecnologia**: Filtrado en memoria y por parametros de consulta (`?tech=...`).
   - **Registro de Visitas**: Contador de trafico atomico con proteccion de sesion para evitar conteos duplicados.
   - **Formulario de Contacto**: Endpoint de recepcion de mensajes con validacion estricta y despacho de notificaciones por correo electronico.
   - **Cache en Memoria**: Almacenamiento en memoria RAM con TTL de 5 minutos para endpoints de alta demanda e invalidacion automatica ante mutaciones.

---

## Estructura del Proyecto

```text
├── portfolio-backend/
│   ├── config/             # Configuracion de base de datos y servicios externos
│   ├── controllers/        # Controladores de logica de negocio (Auth, Perfil, Proyectos, etc.)
│   ├── middlewares/        # Validaciones, autenticacion JWT y control de roles
│   ├── models/             # Modelos de acceso a datos en MongoDB
│   ├── routes/             # Definicion de rutas y endpoints de la API
│   ├── services/           # Servicios auxiliares (Email, logica de negocio)
│   ├── crear-admin.js      # Script de inicializacion de usuarios y roles
│   └── server.js           # Punto de entrada de la aplicacion Express
│
├── portfolio-frontend/
│   ├── src/
│   │   ├── components/     # Componentes reutilizables (Canvas, Navbar, Hero, etc.)
│   │   ├── context/        # Contexto global de autenticacion
│   │   ├── pages/          # Vistas principales (Home, AdminDashboard, Login)
│   │   ├── services/       # Clientes HTTP para consumo de la API
│   │   └── index.css       # Tokens de diseno, animaciones y utilidades
│   ├── index.html
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## Documentacion de la API REST

Base URL: `http://localhost:4000/api`

### Autenticacion
| Metodo | Endpoint | Acceso | Descripcion |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Publico | Inicio de sesion (Devuelve token JWT y datos de usuario) |
| `POST` | `/api/auth/registro` | Publico | Registro de nuevas cuentas de usuario |
| `GET` | `/api/auth/perfil` | Autenticado | Obtiene la informacion del usuario en sesion |

### Perfil
| Metodo | Endpoint | Acceso | Descripcion |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/perfil` | Publico | Obtiene informacion del perfil (Con cache en memoria) |
| `PUT` | `/api/perfil` | Autenticado | Actualiza datos del perfil e invalida la cache |

### Proyectos
| Metodo | Endpoint | Acceso | Descripcion |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/proyectos` | Publico | Lista todos los proyectos ordenados |
| `GET` | `/api/proyectos?tech=React` | Publico | Filtra proyectos por coincidencia de tecnologia |
| `GET` | `/api/proyectos/:id` | Publico | Obtiene un proyecto especifico por su identificador |
| `POST` | `/api/proyectos` | Autenticado | Crea un nuevo proyecto |
| `PUT` | `/api/proyectos/reordenar` | Autenticado | Actualiza el orden numerico de proyectos en lote |
| `PUT` | `/api/proyectos/:id` | Autenticado | Modifica los datos de un proyecto existente |
| `PATCH` | `/api/proyectos/:id/destacar` | Autenticado | Alterna el estado destacado de un proyecto |
| `DELETE` | `/api/proyectos/:id` | Solo Admin | Elimina un proyecto de la base de datos |

### Experiencia Laboral
| Metodo | Endpoint | Acceso | Descripcion |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/experiencia` | Publico | Lista el historial de experiencia laboral |
| `POST` | `/api/experiencia` | Autenticado | Registra una nueva experiencia |
| `PUT` | `/api/experiencia/:id` | Autenticado | Modifica una experiencia existente |
| `DELETE` | `/api/experiencia/:id` | Solo Admin | Elimina un registro de experiencia |

### Educacion
| Metodo | Endpoint | Acceso | Descripcion |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/educacion` | Publico | Lista los registros academicos y certificaciones |
| `POST` | `/api/educacion` | Autenticado | Registra un nuevo titulo o certificacion |
| `PUT` | `/api/educacion/:id` | Autenticado | Modifica un registro de educacion |
| `DELETE` | `/api/educacion/:id` | Solo Admin | Elimina un registro academico |

### Habilidades Tecnicas
| Metodo | Endpoint | Acceso | Descripcion |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/skills` | Publico | Lista todas las habilidades tecnicas registradas |
| `POST` | `/api/skills` | Autenticado | Registra una nueva habilidad |
| `PUT` | `/api/skills/:id` | Autenticado | Modifica los datos de una habilidad |
| `DELETE` | `/api/skills/:id` | Solo Admin | Elimina una habilidad |

### Metricas y Contacto
| Metodo | Endpoint | Acceso | Descripcion |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/visitas` | Publico | Incrementa y retorna el contador de visitas |
| `GET` | `/api/visitas` | Publico | Consulta el total de visitas registradas |
| `POST` | `/api/contacto` | Publico | Procesa y envia mensajes recibidos via formulario |

---

## Instalacion y Configuracion Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/layitoo/mi-portfolio-fullstack.git
cd mi-portfolio-fullstack
```

### 2. Configuracion del Backend
```bash
cd portfolio-backend
npm install
npm run dev
```

### 3. Configuracion del Frontend
En una terminal independiente:
```bash
cd portfolio-frontend
npm install
npm run dev
```

---

## Variables de Entorno

Crear un archivo `.env` dentro del directorio `portfolio-backend/` con los siguientes parametros:

```env
PORT=4000
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/Portfolio?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_jwt
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=lalandaleandro@gmail.com
```

---

## Autor

**Leandro Martin Lalanda**  
- Especialidad: Programador de Videojuegos & Desarrollador Web Full Stack  
- Contacto: `lalandaleandro@gmail.com`  
- Repositorio: [https://github.com/layitoo/mi-portfolio-fullstack](https://github.com/layitoo/mi-portfolio-fullstack)

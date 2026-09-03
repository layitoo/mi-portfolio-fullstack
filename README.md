# Portfolio Web Full Stack

Aplicación web profesional diseñada con arquitectura desacoplada cliente-servidor, estética **Dark Obsidian Glassmorphism**, renderizado procedural en Canvas 2D, integración con **Cloudinary** para almacenamiento de medios en la nube, despacho de correos transaccionales con **Resend**, métricas de tráfico en tiempo real, **Bot Keep-Alive anti-suspensión para Render** y un **Panel de Administración integral** con autenticación JWT robusta, rate limiting y control de acceso basado en roles (RBAC).

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Stack Tecnológico](#stack-tecnológico)
- [Características y Funcionalidades](#características-y-funcionalidades)
- [Seguridad y Buenas Prácticas](#seguridad-y-buenas-prácticas)
- [Sistema Keep-Alive Anti-Suspensión (Render)](#sistema-keep-alive-anti-suspensión-render)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación de la API REST](#documentación-de-la-api-rest)
- [Instalación y Configuración Local](#instalación-y-configuración-local)
- [Creación de Usuarios Administrador y Editor](#creación-de-usuarios-administrador-y-editor)
- [Variables de Entorno](#variables-de-entorno)
- [Autor](#autor)

---

## Descripción General

El proyecto constituye una plataforma integral para la presentación y gestión de proyectos de **Desarrollo Web Full Stack**, **Diseño y Modelado 3D** y **Desarrollo de Videojuegos**. 

Incorpora un diseño visual avanzado inspirado en estéticas oscuras metálicas (*Obsidian Chrome*), optimizado para alto rendimiento (60 FPS) y una experiencia de usuario fluida tanto en escritorio como en dispositivos móviles mediante microanimaciones vectoriales, menú hamburguesa adaptativo, navegación reactiva, visor de galería en pantalla completa, descarga directa de CV en PDF y panel administrativo interactivo.

---

## Stack Tecnológico

### Frontend
- **Framework & Bundler:** React 18+, Vite
- **Estilos & Animaciones:** Tailwind CSS, CSS3 avanzado (Grid Accordions, Mask Gradients, Glassmorphism, animaciones cúbicas de entrada/salida `cubic-bezier(0.16, 1, 0.3, 1)`)
- **Renderizado Gráfico:** HTML5 Canvas 2D Procedural con profundidad espacial
- **Iconografía Oficial:** Lucide React, React Icons (Simple Icons SVG para logos oficiales de marca)
- **Cliente HTTP:** Axios (con interceptores automáticos para tokens JWT)
- **Enrutamiento:** React Router DOM v7

### Backend
- **Entorno de Ejecución:** Node.js (con soporte de `fetch` nativo)
- **Framework Web:** Express.js
- **Base de Datos:** MongoDB Atlas (Driver nativo oficial con indexación automática y operaciones atómicas *bulk write*)
- **Seguridad & Rate Limiting:** Express Rate Limit, Helmet (con Content Security Policy y HSTS), Bcrypt, JSON Web Tokens (JWT)
- **Almacenamiento en la Nube:** Cloudinary SDK (`multer-storage-cloudinary`)
- **Servicio de Correos:** Resend SDK oficial
- **Validación de Datos:** Express-Validator
- **Manejo de Archivos:** Multer
- **Keep-Alive & Uptime:** Bot autónomo programado con intervalos de ping preventivo

---

## Características y Funcionalidades

### 1. Portada, Descarga de CV y UX (Obsidian Glassmorphism)
- **Paleta Ónix y Brillo Especular:** Fondos oscuros profundos (`#030304`) combinados con bordes cromados traslúcidos y filtros de desenfoque `backdrop-blur-3xl`.
- **Botón Destacado de Descarga de CV:** Acceso directo en el Hero para descargar el archivo `LeandroLalandaCV.pdf` o abrirlo en nueva pestaña, con enlace personalizable desde el panel de control.
- **Fondo Procedural Interactivo:** Canvas 2D continuo con partículas, líneas de luz y efecto de profundidad espacial (*Parallax Multicapa*).
- **Barra de Navegación Dinámica & Responsive:**
  - En escritorio: Cápsula flotante minimalista que detecta el estado de sesión y rol (`Admin` / `Editor`).
  - En móviles: Menú hamburguesa interactivo con transición suave, alineación derecha y tarjeta flotante con accesos rápidos.
- **Edición en Vivo del Hero:** Botón de edición rápida que permite al administrador modificar su biografía directamente desde la portada con persistencia instantánea.

### 2. Galería de Proyectos & Modal Carrusel Fluido
- **Soporte Multi-Imagen:** Almacenamiento y visualización de múltiples capturas y renders en alta definición.
- **Modal de Pantalla Completa:** Ventana flotante con esquinas redondeadas anti-aliasing, apertura suave cinematográfica y tira de miniaturas (*thumbnails*) en cuadrícula.
- **Carrusel con Deslizamiento Lateral:** Transición continua animada con `translateX` y aceleración suave `cubic-bezier(0.25, 1, 0.5, 1)`, controlable con botones flotantes y teclado (flechas `←` / `→` y `Esc`).

### 3. Servicio de Contacto y Notificaciones Reales (`Resend`)
- **Despacho Automático a Gmail:** Los mensajes enviados desde el formulario de contacto se procesan y envían directamente a la casilla de correo del propietario.
- **Plantilla HTML Dark Mode:** Diseño de correo adaptativo con datos del remitente, mensaje estructurado y encabezado `reply_to` configurado para responderle al visitante en 1 clic.

### 4. Almacenamiento y Optimización Cloud (`Cloudinary`)
- **Compresión Inteligente en Cliente:** Redimensionamiento y conversión automática a formato moderno WebP antes del envío, permitiendo subir imágenes pesadas (4K/8K) sin saturar la red ni el servidor.
- **Subida en Lote:** Carga simultánea de múltiples imágenes con asignación automática de foto de portada y selector de miniaturas.

### 5. Panel de Administración (CMS Integral)
- **Acceso Protegido por Roles (RBAC):** Roles diferenciados de `Admin` (control total y borrado) y `Editor` (creación y edición).
- **CRUD Completo:** Gestión de Perfil, Proyectos, Experiencia Laboral, Habilidades Técnicas y Educación.
- **Métricas y Tráfico en Vivo:** Widget interactivo de recuento total acumulado de visitas en tiempo real.
- **Diseño Mobile-First:** Barra superior compacta con drawer móvil para gestionar el contenido cómodamente desde cualquier celular o tablet.
- **Reordenamiento Atómico:** Organización de proyectos mediante bulk write en MongoDB.

---

## Sistema Keep-Alive Anti-Suspensión (Render)

Render suspende los servicios en su plan gratuito tras **15 minutos de inactividad**, lo que causa demoras de hasta 50 segundos (*cold start*) al cargar la web por primera vez. Para garantizar disponibilidad instantánea 24/7, se integró una solución en tres niveles:

1. **Endpoint Liviano `/api/ping`:**
   - Responde inmediatamente con código 200 OK y tiempo de actividad (`uptime`).
   - Está ubicado antes de los limitadores de tasa (*Rate Limiters*), evitando falsos bloqueos.
   - No realiza consultas a MongoDB, manteniendo el consumo de recursos en cero.

2. **Servicio Interno Autónomo (`keepAlive.service.js`):**
   - Se inicia automáticamente al levantar el servidor Express.
   - Detecta la URL del servidor automáticamente a través de `RENDER_EXTERNAL_URL` (inyectada por Render) o `SERVER_URL`.
   - Envía un ping cada **10 minutos**, reseteando el temporizador de inactividad de Render.

3. **Script CLI Independiente (`scripts/ping-bot.js`):**
   - Permite correr un bot de monitoreo desde una terminal externa o servicio programado:
     ```bash
     npm run ping-bot https://tu-backend.onrender.com
     ```

> [!TIP]
> **Respaldo recomendado en la nube (100% Gratuito):**  
> Para cubrir posibles reinicios de contenedor por mantenimiento en Render, puedes registrar la URL `https://tu-backend.onrender.com/api/ping` en [cron-job.org](https://cron-job.org) o [uptimerobot.com](https://uptimerobot.com) con frecuencia de 10 minutos.

---

## Seguridad y Buenas Prácticas

El backend cuenta con una arquitectura robusta para entornos de producción:
- **Validación Estricta de Variables de Entorno:** El servidor verifica en el arranque la existencia y robustez de claves críticas como `JWT_SECRET` y `MONGO_URI`, impidiendo el funcionamiento con configuraciones inseguras.
- **Rate Limiting:**
  - `/api/auth/login` y `/api/auth/registro`: Máximo 5 intentos cada 15 minutos por IP (protección anti fuerza bruta).
  - `/api/contacto`: Máximo 5 mensajes por hora por IP (prevención de spam).
  - `/api/*`: Límite global de 300 peticiones cada 15 minutos para mitigar ataques de denegación de servicio (DoS). Exento en `/api/ping`.
- **Protección de Cabeceras con Helmet:** Content Security Policy (CSP) explícita, HSTS (`Strict-Transport-Security` con 1 año y precarga), `X-Content-Type-Options: nosniff` y `X-Frame-Options: DENY`.
- **Límite de Payload Seguro:** Límite de carga de cuerpo JSON ajustado a `2MB` para prevenir agotamiento de memoria.
- **Indexación Automática de MongoDB:** Creación garantizada de índices para consultas eficientes (`email` único en usuarios, `orden` y `destacado` en proyectos, `orden` en educación/experiencia y `categoria` en skills).

---

## Estructura del Proyecto

```text
├── portfolio-backend/
│   ├── config/             # Configuración e indexación de base de datos MongoDB
│   ├── controllers/        # Controladores MVC (Auth, Perfil, Proyectos, Contacto, Skills, etc.)
│   ├── middlewares/        # JWT requireAuth, requireRole, RateLimiters y subida Multer/Cloudinary
│   ├── models/             # Modelos de acceso a datos con soporte de paginación
│   ├── routes/             # Enrutadores Express (Auth, Upload, Proyectos, Contacto, etc.)
│   ├── services/           # Servicios (EmailService, ProyectosService, KeepAliveService)
│   ├── scripts/            # Scripts utilitarios (ping-bot.js para mantener despierto Render)
│   ├── crear-admin.js      # Script de inicialización de usuarios y claves seguras
│   ├── server.js           # Servidor Express principal con endpoint /api/ping
│   ├── .env.example        # Plantilla documentada de variables de entorno
│   └── package.json
│
├── portfolio-frontend/
│   ├── public/
│   │   ├── LeandroLalandaCV.pdf  # Currículum Vitae descargable
│   │   └── logo.png              # Favicon e isotipo
│   ├── src/
│   │   ├── components/     # Componentes (Navbar, Hero, ProjectCard, ProjectModal, Footer, etc.)
│   │   ├── context/        # Contexto global de autenticación (AuthContext)
│   │   ├── pages/          # Vistas principales (Home, AdminDashboard, Login)
│   │   ├── services/       # Servicios de API Axios (UploadService, ContactoService, etc.)
│   │   └── index.css       # Tokens de diseño, animaciones cúbicas y Tailwind CSS
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore              # Reglas integrales para ignorar secretos, builds y archivos del SO
└── README.md
```

---

## Documentación de la API REST

Base URL: `http://localhost:4000/api`

### 1. Sistema & Keep-Alive
| Método | Endpoint | Acceso | Rate Limit | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/ping` | Público | Exento | Health check liviano para el bot Keep-Alive y uptime monitors |
| `GET` | `/api` | Público | Global | Estado general de la API y recursos disponibles |

### 2. Autenticación & Usuarios
| Método | Endpoint | Acceso | Rate Limit | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Público | 5 / 15m | Inicio de sesión (Retorna token JWT y rol) |
| `POST` | `/api/auth/registro` | Público | 5 / 15m | Registro de cuentas iniciales |
| `GET` | `/api/auth/me` | Autenticado | Estándar | Consulta perfil del usuario autenticado |

### 3. Proyectos & Galería
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/proyectos` | Público | Lista proyectos (soporta `?page=1&limit=6&tech=React&destacado=true`) |
| `GET` | `/api/proyectos/:id` | Público | Consulta un proyecto por ID |
| `POST` | `/api/proyectos` | Autenticado | Crea un nuevo proyecto con soporte multi-imagen |
| `PUT` | `/api/proyectos/reordenar` | Autenticado | Reordena proyectos en lote |
| `PUT` | `/api/proyectos/:id` | Autenticado | Actualiza un proyecto y su galería |
| `PATCH` | `/api/proyectos/:id/destacar`| Autenticado | Alterna estado destacado (máx 3) |
| `DELETE` | `/api/proyectos/:id` | Solo Admin | Elimina un proyecto |

### 4. Perfil, Experiencia, Educación y Habilidades
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/perfil` | Público | Obtiene datos del perfil público |
| `PUT` | `/api/perfil` | Autenticado | Actualiza biografía, redes y foto de perfil |
| `GET` | `/api/experiencia` | Público | Lista trayectoria laboral |
| `POST` | `/api/experiencia` | Autenticado | Agrega nueva experiencia |
| `DELETE` | `/api/experiencia/:id`| Solo Admin | Elimina experiencia |
| `GET` | `/api/educacion` | Público | Lista títulos y certificaciones |
| `POST` | `/api/educacion` | Autenticado | Agrega nueva educación |
| `DELETE` | `/api/educacion/:id` | Solo Admin | Elimina educación |
| `GET` | `/api/skills` | Público | Lista habilidades (soporta `?categoria=Frontend&page=1&limit=20`) |
| `POST` | `/api/skills` | Autenticado | Registra nueva habilidad técnica |
| `DELETE` | `/api/skills/:id` | Solo Admin | Elimina habilidad |

### 5. Contacto & Visitas
| Método | Endpoint | Acceso | Rate Limit | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/contacto` | Público | 5 / 1h | Envía mensaje al correo real vía Resend |
| `POST` | `/api/visitas` | Público | Estándar | Incrementa contador único de visitas |
| `GET` | `/api/visitas` | Público | Estándar | Consulta métricas de tráfico acumulado |

### 6. Subida de Medios (Cloudinary)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload` | Autenticado | Sube imágenes optimizadas y retorna URL segura HTTPS |

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

## Creación de Usuarios Administrador y Editor

Para inicializar o actualizar los usuarios en la base de datos:

```bash
cd portfolio-backend
node crear-admin.js
```

El script genera automáticamente credenciales criptográficas seguras y las muestra por pantalla. Opcionalmente, puedes especificar tus propias contraseñas en el archivo `.env` antes de ejecutar el script:

```env
ADMIN_EMAIL=lalandaleandro@gmail.com
ADMIN_PASSWORD=TuPasswordSegura123!
EDITOR_EMAIL=editor@miportfolio.com
EDITOR_PASSWORD=OtraPasswordSegura123!
```

---

## Variables de Entorno

### Backend (`portfolio-backend/.env`)
```env
PORT=4000
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/Portfolio?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_jwt_super_segura_de_al_menos_16_caracteres

# Cloudinary (Almacenamiento de imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Resend (Servicio de correos)
RESEND_API_KEY=re_tu_resend_api_key
ADMIN_EMAIL=tu_correo@gmail.com

# Keep-Alive Bot (Opcional en Render, ya que Render inyecta RENDER_EXTERNAL_URL automáticamente)
# SERVER_URL=https://tu-portfolio-backend.onrender.com
# PING_INTERVAL_MINUTES=10
```

### Frontend (`portfolio-frontend/.env`)
```env
VITE_API_URL=http://localhost:4000/api
```

---

## Autor

**Leandro Martin Lalanda**  
- **Especialidad:** Desarrollador Web Full Stack & Artista / Diseñador 3D  
- **Contacto:** `lalandaleandro@gmail.com`  
- **Repositorio:** [https://github.com/layitoo/mi-portfolio-fullstack](https://github.com/layitoo/mi-portfolio-fullstack)

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  obtenerPerfil,
  actualizarPerfil,
} from "../../services/perfil.service";
import {
  obtenerProyectos,
  crearProyecto,
  actualizarProyecto,
  reordenarProyectos,
  eliminarProyecto,
} from "../../services/proyectos.service";
import {
  obtenerExperiencias,
  crearExperiencia,
  actualizarExperiencia,
  eliminarExperiencia,
} from "../../services/experiencia.service";
import {
  obtenerEducacion,
  crearEducacion,
  actualizarEducacion,
  eliminarEducacion,
} from "../../services/educacion.service";
import {
  obtenerSkills,
  crearSkill,
  actualizarSkill,
  eliminarSkill,
} from "../../services/skills.service";
import { obtenerVisitas } from "../../services/visitas.service";
import { subirImagenCloudinary } from "../../services/upload.service";

import {
  User,
  Sparkles,
  Briefcase,
  GraduationCap,
  Code2,
  LogOut,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Shield,
  ShieldAlert,
  UploadCloud,
  Loader2,
  Eye,
  Menu,
} from "lucide-react";

export default function AdminDashboard() {
  const { usuario, logout } = useAuth();
  const esAdmin = (usuario?.rol || "admin") === "admin";
  const rolTexto = esAdmin ? "Admin" : "Editor";
  const [tabActiva, setTabActiva] = useState("perfil");
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [advertenciaImagen, setAdvertenciaImagen] = useState("");
  const [arrastrandoIndex, setArrastrandoIndex] = useState(null);

  // Estados de carga para subidas a Cloudinary
  const [subiendoFotoPerfil, setSubiendoFotoPerfil] = useState(false);
  const [subiendoImgNuevoProy, setSubiendoImgNuevoProy] = useState(false);
  const [subiendoImgEditProy, setSubiendoImgEditProy] = useState(false);

  // Datos principales
  const [perfil, setPerfil] = useState({
    nombre: "",
    bio: "",
    fotoUrl: "",
    redes: { github: "", linkedin: "", email: "" },
  });
  const [proyectos, setProyectos] = useState([]);
  const [experiencias, setExperiencias] = useState([]);
  const [educacion, setEducacion] = useState([]);
  const [skills, setSkills] = useState([]);
  const [visitas, setVisitas] = useState(null);

  // Estados para creación de nuevos elementos (acordeones superiores)
  const [mostrarCrearProyecto, setMostrarCrearProyecto] = useState(false);
  const [nuevoProyecto, setNuevoProyecto] = useState({
    titulo: "",
    descripcion: "",
    imagenUrl: "",
    imagenes: [],
    tecnologias: "",
    repoUrl: "",
    demoUrl: "",
    destacado: false,
  });

  const [mostrarCrearExp, setMostrarCrearExp] = useState(false);
  const [nuevaExp, setNuevaExp] = useState({
    empresa: "",
    puesto: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    actual: false,
  });

  const [mostrarCrearEdu, setMostrarCrearEdu] = useState(false);
  const [nuevaEdu, setNuevaEdu] = useState({
    institucion: "",
    titulo: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [mostrarCrearSkill, setMostrarCrearSkill] = useState(false);
  const [nuevaSkill, setNuevaSkill] = useState({
    nombre: "",
    nivel: "Intermedio",
    categoria: "Frontend",
  });

  // Estados para edición desplegable in-line (por ID de elemento)
  const [editandoProyectoId, setEditandoProyectoId] = useState(null);
  const [formEditProyecto, setFormEditProyecto] = useState({});

  const [editandoExpId, setEditandoExpId] = useState(null);
  const [formEditExp, setFormEditExp] = useState({});

  const [editandoEduId, setEditandoEduId] = useState(null);
  const [formEditEdu, setFormEditEdu] = useState({});

  const [editandoSkillId, setEditandoSkillId] = useState(null);
  const [formEditSkill, setFormEditSkill] = useState({});

  const notificar = (msg) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(""), 3500);
  };

  const notificarError = (msg) => {
    setMensajeError(msg);
    setTimeout(() => setMensajeError(""), 6000);
  };

  // Compresor y optimizador automático a 1080p y WebP antes de subir a Cloudinary
  const optimizarYComprimirArchivo = (file) => {
    return new Promise((resolve, reject) => {
      // Si no es imagen o es SVG, retornarlo tal cual
      if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
        return resolve(file);
      }

      const pesoOriginalMB = (file.size / (1024 * 1024)).toFixed(1);
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxW = 1920;
          const maxH = 1080;
          let w = img.width;
          let h = img.height;
          let ajustada = false;

          if (w > maxW || h > maxH) {
            ajustada = true;
            if (w / maxW > h / maxH) {
              h = Math.round((h * maxW) / w);
              w = maxW;
            } else {
              w = Math.round((w * maxH) / h);
              h = maxH;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return resolve(file);
              }

              const pesoFinalKB = (blob.size / 1024).toFixed(0);
              if (ajustada || file.size > 1.5 * 1024 * 1024) {
                setAdvertenciaImagen(
                  `✨ Imagen optimizada automáticamente: de ${pesoOriginalMB}MB (${img.width}x${img.height}) a ${pesoFinalKB}KB (${w}x${h}) antes de subir a la nube.`
                );
                setTimeout(() => setAdvertenciaImagen(""), 7000);
              }

              const nombreLimpio = file.name.replace(/\.[^/.]+$/, "") + ".webp";
              const archivoOptimizado = new File([blob], nombreLimpio, {
                type: "image/webp",
                lastModified: Date.now(),
              });

              resolve(archivoOptimizado);
            },
            "image/webp",
            0.88
          );
        };
        img.onerror = () => reject(new Error("No se pudo procesar la imagen"));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error("Error leyendo el archivo"));
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    cargarTodosLosDatos();
  }, []);

  const cargarTodosLosDatos = async () => {
    try {
      const [p, proy, exp, edu, sk, vis] = await Promise.all([
        obtenerPerfil().catch(() => null),
        obtenerProyectos().catch(() => []),
        obtenerExperiencias().catch(() => []),
        obtenerEducacion().catch(() => []),
        obtenerSkills().catch(() => []),
        obtenerVisitas().catch(() => null),
      ]);
      if (p) setPerfil(p);
      setProyectos(proy);
      setExperiencias(exp);
      setEducacion(edu);
      setSkills(sk);
      if (vis?.total !== undefined) setVisitas(vis.total);
    } catch (err) {
      console.error(err);
    }
  };

  // 1. Guardar Perfil
  const handleGuardarPerfil = async (e) => {
    e.preventDefault();
    try {
      const actualizado = await actualizarPerfil(perfil);
      setPerfil(actualizado);
      notificar("Perfil actualizado correctamente ✅");
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.detalle || "Error al actualizar perfil";
      alert(msg);
    }
  };

  // 2. Proyectos CRUD
  const handleCrearProyecto = async (e) => {
    e.preventDefault();
    try {
      const techsArray = typeof nuevoProyecto.tecnologias === "string"
        ? nuevoProyecto.tecnologias.split(",").map((t) => t.trim()).filter(Boolean)
        : nuevoProyecto.tecnologias;

      const imagenes = Array.isArray(nuevoProyecto.imagenes) && nuevoProyecto.imagenes.length > 0
        ? nuevoProyecto.imagenes
        : nuevoProyecto.imagenUrl ? [nuevoProyecto.imagenUrl] : [];
      const imagenUrl = imagenes[0] || nuevoProyecto.imagenUrl || "";

      const payload = { ...nuevoProyecto, imagenes, imagenUrl, tecnologias: techsArray };
      const creado = await crearProyecto(payload);
      setProyectos([creado, ...proyectos]);
      notificar("Proyecto creado con éxito 🚀");
      setNuevoProyecto({
        titulo: "",
        descripcion: "",
        imagenUrl: "",
        imagenes: [],
        tecnologias: "",
        repoUrl: "",
        demoUrl: "",
        destacado: false,
      });
      setMostrarCrearProyecto(false);
    } catch (err) {
      const msg = err.response?.data?.detalles?.[0]?.msg || err.response?.data?.error || err.response?.data?.detalle || "Error al crear proyecto";
      notificarError(msg);
    }
  };

  const handleIniciarEditarProyecto = (p) => {
    if (editandoProyectoId === p._id) {
      setEditandoProyectoId(null);
      setFormEditProyecto({});
    } else {
      setEditandoProyectoId(p._id);
      const imagenes = Array.isArray(p.imagenes) && p.imagenes.length > 0
        ? p.imagenes
        : p.imagenUrl ? [p.imagenUrl] : [];

      setFormEditProyecto({
        ...p,
        imagenes,
        imagenUrl: imagenes[0] || p.imagenUrl || "",
        tecnologias: Array.isArray(p.tecnologias) ? p.tecnologias.join(", ") : p.tecnologias || "",
      });
    }
  };

  const handleGuardarEdicionProyecto = async (id) => {
    try {
      const techsArray = typeof formEditProyecto.tecnologias === "string"
        ? formEditProyecto.tecnologias.split(",").map((t) => t.trim()).filter(Boolean)
        : formEditProyecto.tecnologias;

      const imagenes = Array.isArray(formEditProyecto.imagenes) && formEditProyecto.imagenes.length > 0
        ? formEditProyecto.imagenes
        : formEditProyecto.imagenUrl ? [formEditProyecto.imagenUrl] : [];
      const imagenUrl = imagenes[0] || formEditProyecto.imagenUrl || "";

      const payload = { ...formEditProyecto, imagenes, imagenUrl, tecnologias: techsArray };
      await actualizarProyecto(id, payload);
      setProyectos(proyectos.map((p) => (p._id === id ? { ...p, ...payload } : p)));
      notificar("Proyecto actualizado correctamente 🚀");
      setEditandoProyectoId(null);
      setFormEditProyecto({});
    } catch (err) {
      const msg = err.response?.data?.detalles?.[0]?.msg || err.response?.data?.error || err.response?.data?.detalle || "Error al actualizar proyecto";
      notificarError(msg);
    }
  };

  // Reto 1: Reordenar Proyectos (Drag & Drop + ⬆️/⬇️)
  const handleMoverProyecto = async (indexActual, nuevoIndex) => {
    if (nuevoIndex < 0 || nuevoIndex >= proyectos.length) return;
    const lista = [...proyectos];
    const [movido] = lista.splice(indexActual, 1);
    lista.splice(nuevoIndex, 0, movido);
    setProyectos(lista);

    try {
      await reordenarProyectos(lista.map((p, i) => ({ _id: p._id, orden: i })));
      notificar("Orden de proyectos actualizado 🔄");
    } catch (err) {
      console.error("Error al reordenar proyectos:", err);
    }
  };

  const handleDragStart = (e, index) => {
    setArrastrandoIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, targetIndex) => {
    e.preventDefault();
    if (arrastrandoIndex === null || arrastrandoIndex === targetIndex) {
      setArrastrandoIndex(null);
      return;
    }
    await handleMoverProyecto(arrastrandoIndex, targetIndex);
    setArrastrandoIndex(null);
  };

  const handleEliminarProyecto = async (id) => {
    if (!esAdmin) {
      alert("Permiso denegado: Solo los usuarios Administradores pueden eliminar registros (Rol actual: Editor).");
      return;
    }
    if (!confirm("¿Seguro que querés borrar este proyecto?")) return;
    try {
      await eliminarProyecto(id);
      setProyectos(proyectos.filter((p) => p._id !== id));
      notificar("Proyecto eliminado");
    } catch (err) {
      const msg = err.response?.data?.detalles?.[0]?.msg || err.response?.data?.error || "Error al eliminar proyecto";
      alert(msg);
    }
  };

  // 3. Experiencia CRUD
  const handleCrearExperiencia = async (e) => {
    e.preventDefault();
    try {
      const creado = await crearExperiencia(nuevaExp);
      setExperiencias([creado, ...experiencias]);
      notificar("Experiencia agregada ✅");
      setNuevaExp({ empresa: "", puesto: "", descripcion: "", fechaInicio: "", fechaFin: "", actual: false });
      setMostrarCrearExp(false);
    } catch (err) {
      const msg = err.response?.data?.detalles?.[0]?.msg || err.response?.data?.error || err.response?.data?.detalle || "Error al crear experiencia";
      alert(msg);
    }
  };

  const handleIniciarEditarExp = (exp) => {
    if (editandoExpId === exp._id) {
      setEditandoExpId(null);
      setFormEditExp({});
    } else {
      setEditandoExpId(exp._id);
      setFormEditExp({ ...exp });
    }
  };

  const handleGuardarEdicionExp = async (id) => {
    try {
      await actualizarExperiencia(id, formEditExp);
      setExperiencias(experiencias.map((e) => (e._id === id ? { ...e, ...formEditExp } : e)));
      notificar("Experiencia actualizada ✅");
      setEditandoExpId(null);
    } catch (err) {
      const msg = err.response?.data?.detalles?.[0]?.msg || err.response?.data?.error || err.response?.data?.detalle || "Error al actualizar experiencia";
      alert(msg);
    }
  };

  const handleEliminarExperiencia = async (id) => {
    if (!esAdmin) {
      alert("Permiso denegado: Solo los usuarios Administradores pueden eliminar registros (Rol actual: Editor).");
      return;
    }
    if (!confirm("¿Seguro que querés eliminar esta experiencia?")) return;
    try {
      await eliminarExperiencia(id);
      setExperiencias(experiencias.filter((e) => e._id !== id));
      notificar("Experiencia eliminada");
    } catch (err) {
      const msg = err.response?.data?.detalles?.[0]?.msg || err.response?.data?.error || "Error al eliminar";
      alert(msg);
    }
  };

  // 4. Educación CRUD
  const handleCrearEducacion = async (e) => {
    e.preventDefault();
    try {
      const creado = await crearEducacion(nuevaEdu);
      setEducacion([creado, ...educacion]);
      notificar("Educación agregada ✅");
      setNuevaEdu({ institucion: "", titulo: "", fechaInicio: "", fechaFin: "" });
      setMostrarCrearEdu(false);
    } catch (err) {
      const msg = err.response?.data?.detalles?.[0]?.msg || err.response?.data?.error || err.response?.data?.detalle || "Error al crear educación";
      alert(msg);
    }
  };

  const handleIniciarEditarEdu = (edu) => {
    if (editandoEduId === edu._id) {
      setEditandoEduId(null);
      setFormEditEdu({});
    } else {
      setEditandoEduId(edu._id);
      setFormEditEdu({ ...edu });
    }
  };

  const handleGuardarEdicionEdu = async (id) => {
    try {
      await actualizarEducacion(id, formEditEdu);
      setEducacion(educacion.map((e) => (e._id === id ? { ...e, ...formEditEdu } : e)));
      notificar("Educación actualizada ✅");
      setEditandoEduId(null);
    } catch (err) {
      const msg = err.response?.data?.detalles?.[0]?.msg || err.response?.data?.error || err.response?.data?.detalle || "Error al actualizar educación";
      alert(msg);
    }
  };

  const handleEliminarEducacion = async (id) => {
    if (!esAdmin) {
      alert("Permiso denegado: Solo los usuarios Administradores pueden eliminar registros (Rol actual: Editor).");
      return;
    }
    if (!confirm("¿Seguro que querés eliminar esta educación?")) return;
    try {
      await eliminarEducacion(id);
      setEducacion(educacion.filter((e) => e._id !== id));
      notificar("Educación eliminada");
    } catch (err) {
      const msg = err.response?.data?.detalles?.[0]?.msg || err.response?.data?.error || "Error al eliminar";
      alert(msg);
    }
  };

  // 5. Skills CRUD
  const handleCrearSkill = async (e) => {
    e.preventDefault();
    try {
      const creado = await crearSkill(nuevaSkill);
      setSkills([creado, ...skills]);
      notificar("Skill agregada ✅");
      setNuevaSkill({ nombre: "", nivel: "Intermedio", categoria: "Frontend" });
      setMostrarCrearSkill(false);
    } catch (err) {
      const msg = err.response?.data?.detalles?.[0]?.msg || err.response?.data?.error || err.response?.data?.detalle || "Error al crear skill";
      alert(msg);
    }
  };

  const handleIniciarEditarSkill = (sk) => {
    if (editandoSkillId === sk._id) {
      setEditandoSkillId(null);
      setFormEditSkill({});
    } else {
      setEditandoSkillId(sk._id);
      setFormEditSkill({ ...sk });
    }
  };

  const handleGuardarEdicionSkill = async (id) => {
    try {
      await actualizarSkill(id, formEditSkill);
      setSkills(skills.map((s) => (s._id === id ? { ...s, ...formEditSkill } : s)));
      notificar("Skill actualizada ✅");
      setEditandoSkillId(null);
    } catch (err) {
      const msg = err.response?.data?.detalles?.[0]?.msg || err.response?.data?.error || err.response?.data?.detalle || "Error al actualizar skill";
      alert(msg);
    }
  };

  const handleEliminarSkill = async (id) => {
    if (!esAdmin) {
      alert("Permiso denegado: Solo los usuarios Administradores pueden eliminar registros (Rol actual: Editor).");
      return;
    }
    if (!confirm("¿Seguro que querés borrar esta skill?")) return;
    try {
      await eliminarSkill(id);
      setSkills(skills.filter((s) => s._id !== id));
      notificar("Skill eliminada");
    } catch (err) {
      const msg = err.response?.data?.detalles?.[0]?.msg || err.response?.data?.error || "Error al eliminar";
      alert(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#030304] text-neutral-100 flex flex-col md:flex-row bg-grid-pattern selection:bg-white selection:text-black">
      {/* Top Header Barra Móvil (Solo visible en móviles) */}
      <div className="md:hidden sticky top-0 z-40 bg-[#08080a]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <Link
            to="/"
            className="p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 hover:text-white border border-white/10 transition"
            title="Volver a la web"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20 shadow-md shrink-0 bg-black flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block leading-tight">Panel {rolTexto}</span>
              <span className="text-[10px] text-neutral-400 font-mono capitalize">{tabActiva}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Badge de Sección Activa */}
          <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/10 rounded-full px-2.5 py-1 text-[11px] text-neutral-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="capitalize">{tabActiva}</span>
          </div>

          {/* Botón Hamburguesa Móvil */}
          <button
            onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
            className="p-2 rounded-xl text-neutral-200 hover:text-white bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 transition-all cursor-pointer flex items-center justify-center active:scale-95"
            aria-label={menuMovilAbierto ? "Cerrar menú" : "Abrir menú"}
          >
            {menuMovilAbierto ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Drawer / Menú Desplegable Móvil Flotante con Apertura y Cierre Suave */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col p-4 pt-14 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menuMovilAbierto
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuMovilAbierto(false)}
      >
        <div
          className={`bg-[#0b0b0e] border border-white/15 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[88vh] overflow-y-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            menuMovilAbierto
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-4 scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-white text-black text-xs font-bold flex items-center justify-center">◈</span>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Panel de Control</h3>
                <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-mono mt-0.5 ${
                  esAdmin
                    ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                    : "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                }`}>
                  {esAdmin ? <Shield className="w-2.5 h-2.5" /> : <Edit2 className="w-2.5 h-2.5" />}
                  {esAdmin ? "Administrador" : "Editor"}
                </span>
              </div>
            </div>
            <button
              onClick={() => setMenuMovilAbierto(false)}
              className="p-2 rounded-full text-neutral-400 hover:text-white bg-white/[0.06] border border-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-1.5 text-xs font-medium">
            <button
              onClick={() => {
                setTabActiva("perfil");
                setMenuMovilAbierto(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition cursor-pointer ${
                tabActiva === "perfil"
                  ? "bg-white text-black font-bold shadow-md shadow-white/10"
                  : "text-neutral-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <User className="w-4 h-4" /> Perfil
              </span>
              <span className="text-[10px] opacity-70">Hero & Redes</span>
            </button>
            <button
              onClick={() => {
                setTabActiva("proyectos");
                setMenuMovilAbierto(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition cursor-pointer ${
                tabActiva === "proyectos"
                  ? "bg-white text-black font-bold shadow-md shadow-white/10"
                  : "text-neutral-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4" /> Proyectos
              </span>
              <span className="text-[10px] font-mono opacity-70">({proyectos.length})</span>
            </button>
            <button
              onClick={() => {
                setTabActiva("experiencia");
                setMenuMovilAbierto(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition cursor-pointer ${
                tabActiva === "experiencia"
                  ? "bg-white text-black font-bold shadow-md shadow-white/10"
                  : "text-neutral-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" /> Experiencia
              </span>
              <span className="text-[10px] font-mono opacity-70">({experiencias.length})</span>
            </button>
            <button
              onClick={() => {
                setTabActiva("educacion");
                setMenuMovilAbierto(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition cursor-pointer ${
                tabActiva === "educacion"
                  ? "bg-white text-black font-bold shadow-md shadow-white/10"
                  : "text-neutral-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4" /> Educación
              </span>
              <span className="text-[10px] font-mono opacity-70">({educacion.length})</span>
            </button>
            <button
              onClick={() => {
                setTabActiva("skills");
                setMenuMovilAbierto(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition cursor-pointer ${
                tabActiva === "skills"
                  ? "bg-white text-black font-bold shadow-md shadow-white/10"
                  : "text-neutral-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Code2 className="w-4 h-4" /> Skills
              </span>
              <span className="text-[10px] font-mono opacity-70">({skills.length})</span>
            </button>
          </nav>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
            <Link
              to="/"
              onClick={() => setMenuMovilAbierto(false)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-neutral-300 hover:text-white border border-white/10 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver a la web
            </Link>
            <button
              onClick={() => {
                setMenuMovilAbierto(false);
                logout();
              }}
              className="px-3.5 py-2.5 rounded-xl text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Salir
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar de Escritorio (Solo visible en pantallas md en adelante) */}
      <aside className="hidden md:flex md:w-64 bg-[#08080a] border-r border-white/10 p-6 flex-col justify-between shrink-0 h-screen sticky top-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Link to="/" className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition">
              <ArrowLeft className="w-3.5 h-3.5" /> Volver a la web
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 shadow-md shadow-white/10 shrink-0 bg-black flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Panel de Control</h2>
              <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-mono mt-0.5 ${
                esAdmin
                  ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  : "bg-blue-500/10 text-blue-300 border border-blue-500/20"
              }`}>
                {esAdmin ? <Shield className="w-2.5 h-2.5" /> : <Edit2 className="w-2.5 h-2.5" />}
                {esAdmin ? "Administrador" : "Editor"}
              </span>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-medium">
            <button
              onClick={() => setTabActiva("perfil")}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-full transition cursor-pointer ${
                tabActiva === "perfil"
                  ? "bg-white text-black font-semibold shadow-md shadow-white/10"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <User className="w-4 h-4" /> Perfil
            </button>
            <button
              onClick={() => setTabActiva("proyectos")}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-full transition cursor-pointer ${
                tabActiva === "proyectos"
                  ? "bg-white text-black font-semibold shadow-md shadow-white/10"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4" /> Proyectos ({proyectos.length})
            </button>
            <button
              onClick={() => setTabActiva("experiencia")}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-full transition cursor-pointer ${
                tabActiva === "experiencia"
                  ? "bg-white text-black font-semibold shadow-md shadow-white/10"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Briefcase className="w-4 h-4" /> Experiencia ({experiencias.length})
            </button>
            <button
              onClick={() => setTabActiva("educacion")}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-full transition cursor-pointer ${
                tabActiva === "educacion"
                  ? "bg-white text-black font-semibold shadow-md shadow-white/10"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Educación ({educacion.length})
            </button>
            <button
              onClick={() => setTabActiva("skills")}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-full transition cursor-pointer ${
                tabActiva === "skills"
                  ? "bg-white text-black font-semibold shadow-md shadow-white/10"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Code2 className="w-4 h-4" /> Skills ({skills.length})
            </button>
          </nav>

          {/* Widget de Visitas / Tráfico en Sidebar (Desktop) */}
          <div className="mt-8 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2 font-medium">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <Eye className="w-3.5 h-3.5 text-emerald-400" /> Tráfico Web
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white font-mono tracking-tight">
                {visitas !== null ? visitas.toLocaleString() : "..."}
              </span>
              <span className="text-[11px] text-neutral-500">visitas</span>
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">Conteo total acumulado</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Cerrar sesión
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-5xl overflow-y-auto">
        {/* Banner de Éxito */}
        {mensajeExito && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-2 animate-bounce">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{mensajeExito}</span>
            </div>
            <button onClick={() => setMensajeExito("")} className="text-emerald-400/70 hover:text-emerald-200">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Banner de Error Estilizado */}
        {mensajeError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-3 shadow-lg shadow-rose-500/10 animate-fade-in">
            <span className="text-base leading-none">🚫</span>
            <div className="flex-1">
              <strong className="font-semibold block mb-0.5 text-rose-300">Hubo un problema:</strong>
              <p className="text-rose-200/90 leading-relaxed">{mensajeError}</p>
            </div>
            <button onClick={() => setMensajeError("")} className="text-rose-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Banner de Advertencia / Optimización de Imagen */}
        {advertenciaImagen && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-start gap-2.5 shadow-lg shadow-amber-500/10 animate-fade-in">
            <span className="text-base leading-none">✨</span>
            <div className="flex-1">
              <strong className="font-semibold block mb-0.5">Control y Optimización de Imagen:</strong>
              <p className="text-amber-200/90 leading-relaxed">{advertenciaImagen}</p>
            </div>
            <button onClick={() => setAdvertenciaImagen("")} className="text-amber-400 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Resumen Superior de Métricas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider block">Visitas</span>
              <span className="text-lg font-bold text-white font-mono">
                {visitas !== null ? visitas.toLocaleString() : "..."}
              </span>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider block">Proyectos</span>
              <span className="text-lg font-bold text-white font-mono">{proyectos.length}</span>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider block">Experiencia</span>
              <span className="text-lg font-bold text-white font-mono">{experiencias.length}</span>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider block">Skills</span>
              <span className="text-lg font-bold text-white font-mono">{skills.length}</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            TAB 1: PERFIL
        ======================================================== */}
        {tabActiva === "perfil" && (
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white tracking-tight">Editar Perfil</h3>
              <p className="text-xs text-neutral-400 mt-1">Modificá tus datos personales y enlaces que se muestran en el Hero.</p>
            </div>

            <form onSubmit={handleGuardarPerfil} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={perfil.nombre || ""}
                  onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
                  className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Foto de Perfil (Cloudinary o URL)</label>
                <input
                  type="text"
                  value={perfil.fotoUrl || ""}
                  onChange={(e) => setPerfil({ ...perfil, fotoUrl: e.target.value })}
                  placeholder="https://res.cloudinary.com/... o sube una imagen"
                  className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 mb-2 transition"
                />
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={subiendoFotoPerfil}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        try {
                          setSubiendoFotoPerfil(true);
                          const archivoOptimizado = await optimizarYComprimirArchivo(file);
                          const res = await subirImagenCloudinary(archivoOptimizado);
                          setPerfil({ ...perfil, fotoUrl: res.url });
                          notificar("¡Foto de perfil subida a Cloudinary! ☁️");
                        } catch (err) {
                          notificarError("Error al subir foto de perfil: " + (err.response?.data?.error || err.message));
                        } finally {
                          setSubiendoFotoPerfil(false);
                          e.target.value = "";
                        }
                      }
                    }}
                    className="text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-semibold file:bg-white/[0.08] file:text-white hover:file:bg-white/15 cursor-pointer disabled:opacity-50"
                  />
                  {subiendoFotoPerfil && (
                    <span className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Subiendo a Cloudinary...
                    </span>
                  )}
                </div>
                {perfil.fotoUrl && (
                  <div className="mt-3 relative w-16 h-16 rounded-full overflow-hidden border border-white/20 shadow-md">
                    <img src={perfil.fotoUrl} alt="Preview Perfil" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Biografía Corta</label>
                <textarea
                  rows={3}
                  value={perfil.bio || ""}
                  onChange={(e) => setPerfil({ ...perfil, bio: e.target.value })}
                  className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Email de Contacto</label>
                  <input
                    type="email"
                    value={perfil.redes?.email || ""}
                    onChange={(e) => setPerfil({ ...perfil, redes: { ...perfil.redes, email: e.target.value } })}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">URL GitHub</label>
                  <input
                    type="text"
                    value={perfil.redes?.github || ""}
                    onChange={(e) => setPerfil({ ...perfil, redes: { ...perfil.redes, github: e.target.value } })}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">URL LinkedIn</label>
                  <input
                    type="text"
                    value={perfil.redes?.linkedin || ""}
                    onChange={(e) => setPerfil({ ...perfil, redes: { ...perfil.redes, linkedin: e.target.value } })}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 font-semibold text-xs transition-all shadow-md shadow-white/10 flex items-center gap-2 cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================
            TAB 2: PROYECTOS (Edición Desplegable In-Line)
        ======================================================== */}
        {tabActiva === "proyectos" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Gestión de Proyectos</h3>
                <p className="text-xs text-neutral-400 mt-1">Crea, edita y destaca los proyectos de tu portfolio.</p>
              </div>
              <button
                onClick={() => setMostrarCrearProyecto(!mostrarCrearProyecto)}
                className="px-4 py-2 rounded-full bg-white text-black hover:bg-neutral-200 font-semibold text-xs transition-all shadow-md shadow-white/10 flex items-center gap-1.5 cursor-pointer"
              >
                {mostrarCrearProyecto ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {mostrarCrearProyecto ? "Cerrar" : "Nuevo Proyecto"}
              </button>
            </div>

            {/* Formulario Crear Nuevo Proyecto (Desplegable Smooth Accordion) */}
            <div className={`smooth-accordion ${mostrarCrearProyecto ? "is-open" : ""}`}>
              <div className="smooth-accordion-content">
                <form onSubmit={handleCrearProyecto} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 mb-6">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-white" /> Crear Nuevo Proyecto
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Título del Proyecto</label>
                      <input
                        type="text"
                        required
                        value={nuevoProyecto.titulo}
                        onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, titulo: e.target.value })}
                        placeholder="Mi Aplicación Full Stack"
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Tecnologías (separadas por coma)</label>
                      <input
                        type="text"
                        value={nuevoProyecto.tecnologias}
                        onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, tecnologias: e.target.value })}
                        placeholder="React, Node.js, Express, MongoDB"
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Descripción</label>
                    <textarea
                      rows={2}
                      required
                      value={nuevoProyecto.descripcion}
                      onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, descripcion: e.target.value })}
                      placeholder="Descripción detallada de la arquitectura y funciones..."
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                      Imágenes del Proyecto (Galería / Carrusel)
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-2">
                      <input
                        type="text"
                        value={nuevoProyecto.imagenUrl || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          const actual = nuevoProyecto.imagenes || [];
                          setNuevoProyecto({
                            ...nuevoProyecto,
                            imagenUrl: val,
                            imagenes: val ? (actual.includes(val) ? actual : [val, ...actual]) : actual,
                          });
                        }}
                        placeholder="Pega una URL https://... o sube una o varias fotos abajo"
                        className="flex-1 px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition"
                      />
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={subiendoImgNuevoProy}
                          onChange={async (e) => {
                            const files = Array.from(e.target.files);
                            if (files.length > 0) {
                              try {
                                setSubiendoImgNuevoProy(true);
                                const urlsSubidas = [];
                                for (const file of files) {
                                  const archivoOptimizado = await optimizarYComprimirArchivo(file);
                                  const res = await subirImagenCloudinary(archivoOptimizado);
                                  if (res.url) urlsSubidas.push(res.url);
                                }
                                const actuales = nuevoProyecto.imagenes || (nuevoProyecto.imagenUrl ? [nuevoProyecto.imagenUrl] : []);
                                const nuevaLista = [...actuales, ...urlsSubidas];
                                setNuevoProyecto({
                                  ...nuevoProyecto,
                                  imagenes: nuevaLista,
                                  imagenUrl: nuevaLista[0] || "",
                                });
                                notificar(`¡${urlsSubidas.length} foto(s) subida(s) a Cloudinary! ☁️`);
                              } catch (err) {
                                notificarError("Error al subir imágenes: " + (err.response?.data?.error || err.message));
                              } finally {
                                setSubiendoImgNuevoProy(false);
                                e.target.value = "";
                              }
                            }
                          }}
                          className="text-xs text-neutral-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-semibold file:bg-white/[0.08] file:text-white hover:file:bg-white/15 cursor-pointer disabled:opacity-50"
                        />
                        {subiendoImgNuevoProy && (
                          <span className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium animate-pulse">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Subiendo...
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Miniaturas de imágenes agregadas */}
                    {Array.isArray(nuevoProyecto.imagenes) && nuevoProyecto.imagenes.length > 0 && (
                      <div className="flex flex-wrap gap-2.5 mt-2 p-3 bg-black/40 rounded-2xl border border-white/5">
                        {nuevoProyecto.imagenes.map((img, idx) => (
                          <div key={idx} className="relative group w-20 h-14 rounded-xl overflow-hidden border border-white/20">
                            <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const filtradas = nuevoProyecto.imagenes.filter((_, i) => i !== idx);
                                setNuevoProyecto({
                                  ...nuevoProyecto,
                                  imagenes: filtradas,
                                  imagenUrl: filtradas[0] || "",
                                });
                              }}
                              className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
                              title="Eliminar esta foto"
                            >
                              ×
                            </button>
                            {idx === 0 && (
                              <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] text-center text-cyan-300 font-mono py-0.5">
                                Portada
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Link Repo (GitHub)</label>
                      <input
                        type="text"
                        value={nuevoProyecto.repoUrl}
                        onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, repoUrl: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Link Demo (Vercel/Web)</label>
                      <input
                        type="text"
                        value={nuevoProyecto.demoUrl}
                        onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, demoUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="destacadoNuevo"
                      checked={nuevoProyecto.destacado}
                      onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, destacado: e.target.checked })}
                      className="w-4 h-4 rounded accent-white cursor-pointer"
                    />
                    <label htmlFor="destacadoNuevo" className="text-xs text-neutral-300 cursor-pointer">
                      Mostrar como Proyecto Destacado ★
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 font-semibold text-xs transition-all shadow-md shadow-white/10 cursor-pointer"
                    >
                      Guardar Proyecto
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Lista de Proyectos con Edición Desplegable In-Line Smooth Accordion & Reordenamiento Drag & Drop */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Proyectos Actuales ({proyectos.length})
                </h4>
                <span className="text-[11px] text-neutral-500 hidden sm:inline-block">
                  💡 Arrastrá las tarjetas o usá las flechas para ordenar
                </span>
              </div>

              {proyectos.map((p, index) => {
                const estaEditando = editandoProyectoId === p._id;
                const estaArrastrando = arrastrandoIndex === index;

                return (
                  <div
                    key={p._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`glass-panel rounded-3xl overflow-hidden transition-all duration-300 ${
                      estaArrastrando ? "opacity-40 scale-[0.98] border-white/40" : ""
                    }`}
                  >
                    {/* Header de la tarjeta */}
                    <div className="p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Drag Handle & Flechas de Orden */}
                        <div className="flex items-center gap-1 text-neutral-500 shrink-0">
                          <span className="cursor-grab active:cursor-grabbing p-1 hover:text-white transition" title="Arrastrar para ordenar">
                            <GripVertical className="w-4 h-4" />
                          </span>
                          <div className="flex flex-col">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMoverProyecto(index, index - 1)}
                              className="p-0.5 hover:text-white disabled:opacity-20 disabled:hover:text-neutral-500 transition cursor-pointer"
                              title="Subir orden"
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={index === proyectos.length - 1}
                              onClick={() => handleMoverProyecto(index, index + 1)}
                              className="p-0.5 hover:text-white disabled:opacity-20 disabled:hover:text-neutral-500 transition cursor-pointer"
                              title="Bajar orden"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {p.imagenUrl && (
                          <div className="w-16 h-12 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
                            <img src={p.imagenUrl} alt={p.titulo} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h5 className="font-bold text-sm text-white truncate flex items-center gap-2">
                            <span className="text-xs font-mono text-neutral-500">#{index + 1}</span>
                            {p.titulo}
                            {p.destacado && <span className="text-[10px] text-amber-300 font-normal">★ Destacado</span>}
                          </h5>
                          <p className="text-xs text-neutral-400 truncate max-w-md">{p.descripcion}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleIniciarEditarProyecto(p)}
                          title="Editar in-line"
                          className={`p-2 rounded-full transition cursor-pointer ${
                            estaEditando
                              ? "bg-white text-black"
                              : "text-neutral-400 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEliminarProyecto(p._id)}
                          title={esAdmin ? "Eliminar proyecto" : "Función restringida a Administradores"}
                          className={`p-2 rounded-full transition cursor-pointer ${
                            esAdmin
                              ? "text-neutral-400 hover:text-red-400 hover:bg-red-500/10"
                              : "text-neutral-600 opacity-40 hover:opacity-70"
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Formulario Desplegable In-Line con Smooth Accordion */}
                    <div className={`smooth-accordion ${estaEditando ? "is-open" : ""}`}>
                      <div className="smooth-accordion-content">
                        <div className="border-t border-white/10 p-6 bg-black/40 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Título</label>
                              <input
                                type="text"
                                value={formEditProyecto.titulo || ""}
                                onChange={(e) => setFormEditProyecto({ ...formEditProyecto, titulo: e.target.value })}
                                className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white/30"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Tecnologías</label>
                              <input
                                type="text"
                                value={formEditProyecto.tecnologias || ""}
                                onChange={(e) => setFormEditProyecto({ ...formEditProyecto, tecnologias: e.target.value })}
                                className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white/30"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Descripción</label>
                            <textarea
                              rows={2}
                              value={formEditProyecto.descripcion || ""}
                              onChange={(e) => setFormEditProyecto({ ...formEditProyecto, descripcion: e.target.value })}
                              className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white/30"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                              Imágenes del Proyecto (Galería / Carrusel)
                            </label>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mb-2">
                              <input
                                type="text"
                                value={formEditProyecto.imagenUrl || ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const actual = formEditProyecto.imagenes || [];
                                  setFormEditProyecto({
                                    ...formEditProyecto,
                                    imagenUrl: val,
                                    imagenes: val ? (actual.includes(val) ? actual : [val, ...actual]) : actual,
                                  });
                                }}
                                placeholder="URL https://... o sube una o varias fotos abajo"
                                className="flex-1 px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white/30"
                              />
                              <div className="flex items-center gap-2 shrink-0">
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  disabled={subiendoImgEditProy}
                                  onChange={async (e) => {
                                    const files = Array.from(e.target.files);
                                    if (files.length > 0) {
                                      try {
                                        setSubiendoImgEditProy(true);
                                        const urlsSubidas = [];
                                        for (const file of files) {
                                          const archivoOptimizado = await optimizarYComprimirArchivo(file);
                                          const res = await subirImagenCloudinary(archivoOptimizado);
                                          if (res.url) urlsSubidas.push(res.url);
                                        }
                                        const actuales = formEditProyecto.imagenes || (formEditProyecto.imagenUrl ? [formEditProyecto.imagenUrl] : []);
                                        const nuevaLista = [...actuales, ...urlsSubidas];
                                        setFormEditProyecto({
                                          ...formEditProyecto,
                                          imagenes: nuevaLista,
                                          imagenUrl: nuevaLista[0] || "",
                                        });
                                        notificar(`¡${urlsSubidas.length} foto(s) subida(s) a Cloudinary! ☁️`);
                                      } catch (err) {
                                        notificarError("Error al actualizar imágenes: " + (err.response?.data?.error || err.message));
                                      } finally {
                                        setSubiendoImgEditProy(false);
                                        e.target.value = "";
                                      }
                                    }
                                  }}
                                  className="text-xs text-neutral-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-white/[0.08] file:text-white hover:file:bg-white/15 cursor-pointer disabled:opacity-50"
                                />
                                {subiendoImgEditProy && (
                                  <span className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium animate-pulse">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Subiendo...
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Miniaturas de imágenes agregadas */}
                            {Array.isArray(formEditProyecto.imagenes) && formEditProyecto.imagenes.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2 p-2.5 bg-black/40 rounded-xl border border-white/5">
                                {formEditProyecto.imagenes.map((img, idx) => (
                                  <div key={idx} className="relative group w-16 h-12 rounded-lg overflow-hidden border border-white/20">
                                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const filtradas = formEditProyecto.imagenes.filter((_, i) => i !== idx);
                                        setFormEditProyecto({
                                          ...formEditProyecto,
                                          imagenes: filtradas,
                                          imagenUrl: filtradas[0] || "",
                                        });
                                      }}
                                      className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-red-600 text-white flex items-center justify-center text-[9px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                                      title="Eliminar esta foto"
                                    >
                                      ×
                                    </button>
                                    {idx === 0 && (
                                      <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[7px] text-center text-cyan-300 font-mono py-0.2">
                                        Portada
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Link Repo (GitHub)</label>
                              <input
                                type="text"
                                value={formEditProyecto.repoUrl || ""}
                                onChange={(e) => setFormEditProyecto({ ...formEditProyecto, repoUrl: e.target.value })}
                                className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Link Demo (Vercel)</label>
                              <input
                                type="text"
                                value={formEditProyecto.demoUrl || ""}
                                onChange={(e) => setFormEditProyecto({ ...formEditProyecto, demoUrl: e.target.value })}
                                className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`destacado_${p._id}`}
                              checked={formEditProyecto.destacado || false}
                              onChange={(e) => setFormEditProyecto({ ...formEditProyecto, destacado: e.target.checked })}
                              className="w-4 h-4 rounded accent-white cursor-pointer"
                            />
                            <label htmlFor={`destacado_${p._id}`} className="text-xs text-neutral-300 cursor-pointer">
                              Mostrar como Proyecto Destacado ★
                            </label>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => handleGuardarEdicionProyecto(p._id)}
                              className="px-5 py-2 rounded-full bg-white text-black hover:bg-neutral-200 font-semibold text-xs transition shadow-md shadow-white/10 cursor-pointer"
                            >
                              Guardar Cambios
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditandoProyectoId(null)}
                              className="px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/10 text-neutral-300 text-xs transition border border-white/10 cursor-pointer"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: EXPERIENCIA (Edición Desplegable In-Line Smooth)
        ======================================================== */}
        {tabActiva === "experiencia" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Experiencia Laboral</h3>
                <p className="text-xs text-neutral-400 mt-1">Gestioná tu historial y roles profesionales.</p>
              </div>
              <button
                onClick={() => setMostrarCrearExp(!mostrarCrearExp)}
                className="px-4 py-2 rounded-full bg-white text-black hover:bg-neutral-200 font-semibold text-xs transition-all shadow-md shadow-white/10 flex items-center gap-1.5 cursor-pointer"
              >
                {mostrarCrearExp ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {mostrarCrearExp ? "Cerrar" : "Nueva Experiencia"}
              </button>
            </div>

            {/* Formulario Crear Nueva Experiencia (Smooth Accordion) */}
            <div className={`smooth-accordion ${mostrarCrearExp ? "is-open" : ""}`}>
              <div className="smooth-accordion-content">
                <form onSubmit={handleCrearExperiencia} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 mb-6">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-white" /> Agregar Experiencia
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Empresa</label>
                      <input
                        type="text"
                        required
                        value={nuevaExp.empresa}
                        onChange={(e) => setNuevaExp({ ...nuevaExp, empresa: e.target.value })}
                        placeholder="Empresa o Estudio"
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Puesto / Rol</label>
                      <input
                        type="text"
                        required
                        value={nuevaExp.puesto}
                        onChange={(e) => setNuevaExp({ ...nuevaExp, puesto: e.target.value })}
                        placeholder="Full Stack Developer"
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Fecha Inicio</label>
                      <input
                        type="text"
                        required
                        value={nuevaExp.fechaInicio}
                        onChange={(e) => setNuevaExp({ ...nuevaExp, fechaInicio: e.target.value })}
                        placeholder="2023 o Ene 2023"
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Fecha Fin</label>
                      <input
                        type="text"
                        disabled={nuevaExp.actual}
                        value={nuevaExp.fechaFin}
                        onChange={(e) => setNuevaExp({ ...nuevaExp, fechaFin: e.target.value })}
                        placeholder="2024 o Presente"
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 disabled:opacity-40"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="actualExp"
                      checked={nuevaExp.actual}
                      onChange={(e) => setNuevaExp({ ...nuevaExp, actual: e.target.checked })}
                      className="w-4 h-4 rounded accent-white cursor-pointer"
                    />
                    <label htmlFor="actualExp" className="text-xs text-neutral-300 cursor-pointer">Trabajo actual</label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Descripción de Responsabilidades</label>
                    <textarea
                      rows={3}
                      value={nuevaExp.descripcion}
                      onChange={(e) => setNuevaExp({ ...nuevaExp, descripcion: e.target.value })}
                      placeholder="Desarrollo de microservicios, optimización de endpoints..."
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 leading-relaxed"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 font-semibold text-xs transition-all shadow-md shadow-white/10 cursor-pointer"
                    >
                      Guardar Experiencia
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Lista de Experiencias con Edición In-Line Smooth Accordion */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Experiencias Registradas ({experiencias.length})
              </h4>

              {experiencias.map((exp) => {
                const estaEditando = editandoExpId === exp._id;

                return (
                  <div
                    key={exp._id}
                    className="glass-panel rounded-3xl overflow-hidden transition-all duration-300"
                  >
                    <div className="p-5 flex items-center justify-between gap-4">
                      <div>
                        <h5 className="font-bold text-sm text-white">{exp.puesto}</h5>
                        <p className="text-xs text-neutral-400">
                          {exp.empresa} • {exp.fechaInicio} {exp.actual ? "— Presente" : exp.fechaFin ? `— ${exp.fechaFin}` : ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleIniciarEditarExp(exp)}
                          title="Editar in-line"
                          className={`p-2 rounded-full transition cursor-pointer ${
                            estaEditando
                              ? "bg-white text-black"
                              : "text-neutral-400 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEliminarExperiencia(exp._id)}
                          title="Eliminar"
                          className="p-2 rounded-full text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* In-Line Edit Form Smooth Accordion */}
                    <div className={`smooth-accordion ${estaEditando ? "is-open" : ""}`}>
                      <div className="smooth-accordion-content">
                        <div className="border-t border-white/10 p-6 bg-black/40 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Empresa</label>
                              <input
                                type="text"
                                value={formEditExp.empresa || ""}
                                onChange={(e) => setFormEditExp({ ...formEditExp, empresa: e.target.value })}
                                className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Puesto</label>
                              <input
                                type="text"
                                value={formEditExp.puesto || ""}
                                onChange={(e) => setFormEditExp({ ...formEditExp, puesto: e.target.value })}
                                className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Fecha Inicio</label>
                              <input
                                type="text"
                                value={formEditExp.fechaInicio || ""}
                                onChange={(e) => setFormEditExp({ ...formEditExp, fechaInicio: e.target.value })}
                                className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Fecha Fin</label>
                              <input
                                type="text"
                                disabled={formEditExp.actual}
                                value={formEditExp.fechaFin || ""}
                                onChange={(e) => setFormEditExp({ ...formEditExp, fechaFin: e.target.value })}
                                className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none disabled:opacity-40"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`actual_${exp._id}`}
                              checked={formEditExp.actual || false}
                              onChange={(e) => setFormEditExp({ ...formEditExp, actual: e.target.checked })}
                              className="w-4 h-4 rounded accent-white cursor-pointer"
                            />
                            <label htmlFor={`actual_${exp._id}`} className="text-xs text-neutral-300 cursor-pointer">Trabajo actual</label>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Descripción</label>
                            <textarea
                              rows={3}
                              value={formEditExp.descripcion || ""}
                              onChange={(e) => setFormEditExp({ ...formEditExp, descripcion: e.target.value })}
                              className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                            />
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => handleGuardarEdicionExp(exp._id)}
                              className="px-5 py-2 rounded-full bg-white text-black hover:bg-neutral-200 font-semibold text-xs transition shadow-md shadow-white/10 cursor-pointer"
                            >
                              Guardar Cambios
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditandoExpId(null)}
                              className="px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/10 text-neutral-300 text-xs transition border border-white/10 cursor-pointer"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: EDUCACIÓN (Edición Desplegable In-Line Smooth)
        ======================================================== */}
        {tabActiva === "educacion" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Educación y Certificaciones</h3>
                <p className="text-xs text-neutral-400 mt-1">Registrá tus títulos, carreras y cursos.</p>
              </div>
              <button
                onClick={() => setMostrarCrearEdu(!mostrarCrearEdu)}
                className="px-4 py-2 rounded-full bg-white text-black hover:bg-neutral-200 font-semibold text-xs transition-all shadow-md shadow-white/10 flex items-center gap-1.5 cursor-pointer"
              >
                {mostrarCrearEdu ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {mostrarCrearEdu ? "Cerrar" : "Nueva Educación"}
              </button>
            </div>

            {/* Formulario Crear Nueva Educación (Smooth Accordion) */}
            <div className={`smooth-accordion ${mostrarCrearEdu ? "is-open" : ""}`}>
              <div className="smooth-accordion-content">
                <form onSubmit={handleCrearEducacion} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 mb-6">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-white" /> Agregar Educación
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Institución / Universidad</label>
                      <input
                        type="text"
                        required
                        value={nuevaEdu.institucion}
                        onChange={(e) => setNuevaEdu({ ...nuevaEdu, institucion: e.target.value })}
                        placeholder="Universidad Tecnológica Nacional"
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Título Obtenido</label>
                      <input
                        type="text"
                        required
                        value={nuevaEdu.titulo}
                        onChange={(e) => setNuevaEdu({ ...nuevaEdu, titulo: e.target.value })}
                        placeholder="Tecnicatura en Programación"
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Año de Inicio</label>
                      <input
                        type="text"
                        required
                        value={nuevaEdu.fechaInicio}
                        onChange={(e) => setNuevaEdu({ ...nuevaEdu, fechaInicio: e.target.value })}
                        placeholder="2021"
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Año de Fin / Graduación</label>
                      <input
                        type="text"
                        value={nuevaEdu.fechaFin}
                        onChange={(e) => setNuevaEdu({ ...nuevaEdu, fechaFin: e.target.value })}
                        placeholder="2024"
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 font-semibold text-xs transition-all shadow-md shadow-white/10 cursor-pointer"
                    >
                      Guardar Educación
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Lista de Educación con Edición In-Line Smooth Accordion */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Títulos Registrados ({educacion.length})
              </h4>

              {educacion.map((edu) => {
                const estaEditando = editandoEduId === edu._id;

                return (
                  <div
                    key={edu._id}
                    className="glass-panel rounded-3xl overflow-hidden transition-all duration-300"
                  >
                    <div className="p-5 flex items-center justify-between gap-4">
                      <div>
                        <h5 className="font-bold text-sm text-white">{edu.titulo}</h5>
                        <p className="text-xs text-neutral-400">
                          {edu.institucion} • {edu.fechaInicio} {edu.fechaFin ? `— ${edu.fechaFin}` : ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleIniciarEditarEdu(edu)}
                          title="Editar in-line"
                          className={`p-2 rounded-full transition cursor-pointer ${
                            estaEditando
                              ? "bg-white text-black"
                              : "text-neutral-400 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEliminarEducacion(edu._id)}
                          title="Eliminar"
                          className="p-2 rounded-full text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* In-Line Edit Form Smooth Accordion */}
                    <div className={`smooth-accordion ${estaEditando ? "is-open" : ""}`}>
                      <div className="smooth-accordion-content">
                        <div className="border-t border-white/10 p-6 bg-black/40 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Institución</label>
                              <input
                                type="text"
                                value={formEditEdu.institucion || ""}
                                onChange={(e) => setFormEditEdu({ ...formEditEdu, institucion: e.target.value })}
                                className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Título</label>
                              <input
                                type="text"
                                value={formEditEdu.titulo || ""}
                                onChange={(e) => setFormEditEdu({ ...formEditEdu, titulo: e.target.value })}
                                className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Año Inicio</label>
                              <input
                                type="text"
                                value={formEditEdu.fechaInicio || ""}
                                onChange={(e) => setFormEditEdu({ ...formEditEdu, fechaInicio: e.target.value })}
                                className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Año Fin</label>
                              <input
                                type="text"
                                value={formEditEdu.fechaFin || ""}
                                onChange={(e) => setFormEditEdu({ ...formEditEdu, fechaFin: e.target.value })}
                                className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => handleGuardarEdicionEdu(edu._id)}
                              className="px-5 py-2 rounded-full bg-white text-black hover:bg-neutral-200 font-semibold text-xs transition shadow-md shadow-white/10 cursor-pointer"
                            >
                              Guardar Cambios
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditandoEduId(null)}
                              className="px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/10 text-neutral-300 text-xs transition border border-white/10 cursor-pointer"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: SKILLS (Edición Desplegable In-Line Smooth)
        ======================================================== */}
        {tabActiva === "skills" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Habilidades Técnicas</h3>
                <p className="text-xs text-neutral-400 mt-1">Gestioná tus tecnologías y niveles de dominio.</p>
              </div>
              <button
                onClick={() => setMostrarCrearSkill(!mostrarCrearSkill)}
                className="px-4 py-2 rounded-full bg-white text-black hover:bg-neutral-200 font-semibold text-xs transition-all shadow-md shadow-white/10 flex items-center gap-1.5 cursor-pointer"
              >
                {mostrarCrearSkill ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {mostrarCrearSkill ? "Cerrar" : "Nueva Skill"}
              </button>
            </div>

            {/* Formulario Crear Nueva Skill (Smooth Accordion) */}
            <div className={`smooth-accordion ${mostrarCrearSkill ? "is-open" : ""}`}>
              <div className="smooth-accordion-content">
                <form onSubmit={handleCrearSkill} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 mb-6">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-white" /> Agregar Habilidad
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Nombre</label>
                      <input
                        type="text"
                        required
                        value={nuevaSkill.nombre}
                        onChange={(e) => setNuevaSkill({ ...nuevaSkill, nombre: e.target.value })}
                        placeholder="React, Docker, Node.js"
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Categoría</label>
                      <select
                        value={nuevaSkill.categoria}
                        onChange={(e) => setNuevaSkill({ ...nuevaSkill, categoria: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white focus:outline-none cursor-pointer"
                      >
                        <option value="Frontend" className="bg-neutral-900 text-white">Frontend</option>
                        <option value="Backend" className="bg-neutral-900 text-white">Backend</option>
                        <option value="Base de Datos" className="bg-neutral-900 text-white">Base de Datos</option>
                        <option value="DevOps & Herramientas" className="bg-neutral-900 text-white">DevOps & Herramientas</option>
                        <option value="Videojuegos & Motores" className="bg-neutral-900 text-white">Videojuegos & Motores</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Nivel</label>
                      <select
                        value={nuevaSkill.nivel}
                        onChange={(e) => setNuevaSkill({ ...nuevaSkill, nivel: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white focus:outline-none cursor-pointer"
                      >
                        <option value="Básico" className="bg-neutral-900 text-white">Básico</option>
                        <option value="Intermedio" className="bg-neutral-900 text-white">Intermedio</option>
                        <option value="Avanzado" className="bg-neutral-900 text-white">Avanzado</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 font-semibold text-xs transition-all shadow-md shadow-white/10 cursor-pointer"
                    >
                      Guardar Skill
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Lista de Skills con Edición In-Line Smooth Accordion */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.map((sk) => {
                const estaEditando = editandoSkillId === sk._id;

                return (
                  <div
                    key={sk._id}
                    className="glass-panel rounded-3xl overflow-hidden transition-all duration-300"
                  >
                    <div className="p-4 flex items-center justify-between gap-3">
                      <div>
                        <h5 className="font-bold text-sm text-white">{sk.nombre}</h5>
                        <p className="text-[11px] text-neutral-400">{sk.categoria} • {sk.nivel}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleIniciarEditarSkill(sk)}
                          title="Editar in-line"
                          className={`p-1.5 rounded-full transition cursor-pointer ${
                            estaEditando
                              ? "bg-white text-black"
                              : "text-neutral-400 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEliminarSkill(sk._id)}
                          title="Eliminar"
                          className="p-1.5 rounded-full text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* In-Line Edit Form Smooth Accordion */}
                    <div className={`smooth-accordion ${estaEditando ? "is-open" : ""}`}>
                      <div className="smooth-accordion-content">
                        <div className="border-t border-white/10 p-4 bg-black/40 space-y-3">
                          <div>
                            <label className="block text-[10px] font-semibold text-neutral-400 uppercase mb-1">Nombre</label>
                            <input
                              type="text"
                              value={formEditSkill.nombre || ""}
                              onChange={(e) => setFormEditSkill({ ...formEditSkill, nombre: e.target.value })}
                              className="w-full px-3 py-1.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-semibold text-neutral-400 uppercase mb-1">Categoría</label>
                              <select
                                value={formEditSkill.categoria || "Frontend"}
                                onChange={(e) => setFormEditSkill({ ...formEditSkill, categoria: e.target.value })}
                                className="w-full px-2 py-1.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                              >
                                <option value="Frontend" className="bg-neutral-900 text-white">Frontend</option>
                                <option value="Backend" className="bg-neutral-900 text-white">Backend</option>
                                <option value="Base de Datos" className="bg-neutral-900 text-white">Base de Datos</option>
                                <option value="DevOps & Herramientas" className="bg-neutral-900 text-white">DevOps</option>
                                <option value="Videojuegos & Motores" className="bg-neutral-900 text-white">Videojuegos</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-neutral-400 uppercase mb-1">Nivel</label>
                              <select
                                value={formEditSkill.nivel || "Intermedio"}
                                onChange={(e) => setFormEditSkill({ ...formEditSkill, nivel: e.target.value })}
                                className="w-full px-2 py-1.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                              >
                                <option value="Básico" className="bg-neutral-900 text-white">Básico</option>
                                <option value="Intermedio" className="bg-neutral-900 text-white">Intermedio</option>
                                <option value="Avanzado" className="bg-neutral-900 text-white">Avanzado</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleGuardarEdicionSkill(sk._id)}
                              className="px-4 py-1.5 rounded-full bg-white text-black hover:bg-neutral-200 font-semibold text-xs transition shadow-sm cursor-pointer"
                            >
                              Guardar
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditandoSkillId(null)}
                              className="px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/10 text-neutral-300 text-xs transition border border-white/10 cursor-pointer"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

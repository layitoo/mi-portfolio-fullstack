import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

import TechIcon from "./TechIcon";

function GithubIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function renderTechBadge(tech) {
  return (
    <div
      key={tech}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-neutral-200 hover:border-white/25 hover:bg-white/[0.07] transition backdrop-blur-sm shadow-sm"
    >
      <TechIcon tech={tech} className="w-3.5 h-3.5" />
      <span>{tech}</span>
    </div>
  );
}

export default function ProjectModal({ proyecto, onClose }) {
  const [indiceActual, setIndiceActual] = useState(0);

  // Obtener lista completa de imágenes
  const imagenes = proyecto?.imagenes && Array.isArray(proyecto.imagenes) && proyecto.imagenes.length > 0
    ? proyecto.imagenes
    : proyecto?.imagenUrl
    ? [proyecto.imagenUrl]
    : ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"];

  const siguiente = useCallback(() => {
    setIndiceActual((prev) => (prev + 1) % imagenes.length);
  }, [imagenes.length]);

  const anterior = useCallback(() => {
    setIndiceActual((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  }, [imagenes.length]);

  // Manejo de teclado (Esc, Flechas)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") siguiente();
      if (e.key === "ArrowLeft") anterior();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose, siguiente, anterior]);

  if (!proyecto) return null;

  // Clasificar tecnologías en Core Stack vs Styling & Tools
  const todasTechs = Array.isArray(proyecto.tecnologias) ? proyecto.tecnologias : [];
  const coreKeywords = ["react", "node", "express", "mongo", "database", "sql", "api", "next", "vue", "angular", "python", "backend", "fullstack", "javascript", "js"];
  
  const coreStack = todasTechs.filter((tech) => 
    coreKeywords.some((k) => tech.toLowerCase().includes(k))
  );
  const stylingToolsStack = todasTechs.filter((tech) => 
    !coreKeywords.some((k) => tech.toLowerCase().includes(k))
  );

  // Si todas quedaron en una sola, repartir equilibradamente
  const finalCore = coreStack.length > 0 ? coreStack : todasTechs.slice(0, Math.ceil(todasTechs.length / 2));
  const finalTools = stylingToolsStack.length > 0 ? stylingToolsStack : todasTechs.slice(Math.ceil(todasTechs.length / 2));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto">
      {/* Backdrop translúcido con desenfoque de fondo frosted glass suave */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xl animate-backdrop-fade cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Card con animación de entrada suave y estilo Obsidian Glassmorphism */}
      <div className="relative w-full max-w-3xl my-auto z-10 rounded-[28px] bg-[#0c0c10]/90 border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.75),inset_0_1px_1px_rgba(255,255,255,0.25)] backdrop-blur-2xl p-6 sm:p-8 flex flex-col animate-modal-enter">
        
        {/* 1. Header con Título y Botón Cerrar (X) */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {proyecto.titulo}
          </h2>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-neutral-400 hover:text-white border border-white/10 transition-all flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 shrink-0"
            title="Cerrar (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Visor de Imagen Principal con Transición de Deslizamiento Horizontal (Carrusel real) */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black/70 border border-white/10 shadow-2xl mb-4 group select-none">
          {/* Track contenedor con deslizamiento animado suave */}
          <div
            className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ transform: `translateX(-${indiceActual * 100}%)` }}
          >
            {imagenes.map((img, idx) => (
              <div key={idx} className="w-full h-full shrink-0 flex-none relative">
                <img
                  src={img}
                  alt={`${proyecto.titulo} - captura ${idx + 1}`}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
              </div>
            ))}
          </div>

          {/* Flechas de Navegación flotantes */}
          {imagenes.length > 1 && (
            <>
              <button
                onClick={anterior}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/65 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
                title="Anterior (←)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={siguiente}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/65 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
                title="Siguiente (→)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* 3. Tira de Miniaturas Horizontales con selector animado */}
        {imagenes.length > 1 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-6 w-full">
            {imagenes.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setIndiceActual(idx)}
                className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                  idx === indiceActual
                    ? "border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.4)] scale-[1.02]"
                    : "border-white/10 opacity-50 hover:opacity-85 hover:border-white/30"
                }`}
              >
                <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* 4. Descripción del Proyecto */}
        <div className="mb-6 text-left">
          <h4 className="text-sm font-bold text-white mb-1.5">Descripción del Proyecto:</h4>
          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
            {proyecto.descripcion}
          </p>
        </div>

        {/* 5. Secciones de Stack Tecnológico con Distribución Asimétrica (Core a la izquierda, Tools a la derecha) */}
        {todasTechs.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-7 text-left">
            {/* Core Stack con espacio prioritario amplio */}
            <div className="flex-1 min-w-0 pr-0 sm:pr-4">
              <h5 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">
                Core Stack:
              </h5>
              <div className="flex flex-wrap gap-2">
                {finalCore.map((tech) => renderTechBadge(tech))}
              </div>
            </div>

            {/* Styling & Tools desplazado a la derecha */}
            {finalTools.length > 0 && (
              <div className="sm:w-auto shrink-0">
                <h5 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">
                  Styling & Tools:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {finalTools.map((tech) => renderTechBadge(tech))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. Botones de Acción de Ancho Completo */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {proyecto.demoUrl && (
            <a
              href={proyecto.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-3 px-6 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" /> Ver Demo en Vivo
            </a>
          )}

          {proyecto.repoUrl ? (
            <a
              href={proyecto.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-3 px-6 rounded-full bg-transparent hover:bg-white/[0.06] text-white border border-white/20 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <GithubIcon className="w-4 h-4" /> GitHub Repository
            </a>
          ) : (
            !proyecto.demoUrl && (
              <div className="w-full py-3 rounded-full bg-white/[0.03] border border-white/10 text-neutral-500 text-xs text-center font-mono">
                Proyecto privado
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}

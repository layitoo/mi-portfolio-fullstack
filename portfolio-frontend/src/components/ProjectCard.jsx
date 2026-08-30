import { ExternalLink, Star, Images, Maximize2 } from "lucide-react";
import TechIcon from "./TechIcon";

function GithubIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function ProjectCard({ proyecto, onOpenModal }) {
  if (!proyecto) return null;

  const totalImagenes = Array.isArray(proyecto.imagenes) && proyecto.imagenes.length > 0
    ? proyecto.imagenes.length
    : proyecto.imagenUrl ? 1 : 0;

  const imagenPortada = (Array.isArray(proyecto.imagenes) && proyecto.imagenes[0]) || proyecto.imagenUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80";

  return (
    <article className="glass-panel group relative rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-white/25 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      {/* Image container con trigger para abrir modal */}
      <div
        onClick={() => onOpenModal && onOpenModal(proyecto)}
        className="relative aspect-[16/10] w-full overflow-hidden bg-[#0c0c10] cursor-pointer"
        title="Clic para ver galería y detalles en pantalla completa"
      >
        <img
          src={imagenPortada}
          alt={proyecto.titulo}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80";
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d10] via-transparent to-transparent opacity-90 group-hover:opacity-60 transition-opacity" />

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none backdrop-blur-[2px]">
          <span className="px-4 py-2 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-xl scale-95 group-hover:scale-100 transition-transform">
            <Maximize2 className="w-3.5 h-3.5" /> Ver Galería
          </span>
        </div>

        {/* Badges superiores */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          {totalImagenes > 1 ? (
            <div className="px-3 py-1 rounded-full text-[10px] font-semibold bg-black/70 text-white border border-white/15 flex items-center gap-1.5 backdrop-blur-md shadow-lg">
              <Images className="w-3 h-3 text-cyan-300" />
              <span>{totalImagenes} fotos</span>
            </div>
          ) : (
            <div />
          )}

          {proyecto.destacado && (
            <div className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white text-black flex items-center gap-1 shadow-lg shadow-white/10">
              <Star className="w-3 h-3 fill-current text-black" /> Destacado
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onOpenModal && onOpenModal(proyecto)}
            className="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors mb-2 cursor-pointer"
          >
            {proyecto.titulo}
          </h3>
          <p className="text-neutral-400 text-xs leading-relaxed mb-5 line-clamp-3">
            {proyecto.descripcion}
          </p>
        </div>

        <div>
          {/* Tech badges con logos oficiales */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {proyecto.tecnologias &&
              proyecto.tecnologias.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/[0.04] text-neutral-300 border border-white/10"
                >
                  <TechIcon tech={tech} className="w-3 h-3" />
                  <span>{tech}</span>
                </span>
              ))}
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2.5 pt-4 border-t border-white/5">
            {proyecto.demoUrl && (
              <a
                href={proyecto.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <ExternalLink className="w-3 h-3" /> Ver Demo
              </a>
            )}
            {proyecto.repoUrl && (
              <a
                href={proyecto.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-white/10"
              >
                <GithubIcon className="w-3.5 h-3.5" /> Código
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

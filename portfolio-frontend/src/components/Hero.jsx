import { useState, useEffect } from "react";
import { Mail, ArrowRight, Edit2, Check, X, Loader2, Sparkles, Download } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { actualizarPerfil } from "../services/perfil.service";
import ChromeStar from "./ChromeStar";

function GithubIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
    </svg>
  );
}

export default function Hero({ perfil, onPerfilActualizado }) {
  const { usuario } = useAuth();
  const esAdmin = Boolean(usuario);

  const [editandoBio, setEditandoBio] = useState(false);
  const [bioTexto, setBioTexto] = useState(perfil?.bio || "");
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);

  useEffect(() => {
    if (perfil?.bio !== undefined) {
      setBioTexto(perfil.bio);
    }
  }, [perfil?.bio]);

  if (!perfil) return null;

  const handleGuardarBio = async (e) => {
    e?.preventDefault();
    try {
      setGuardando(true);
      const datosActualizados = { ...perfil, bio: bioTexto };
      const res = await actualizarPerfil(datosActualizados);
      if (onPerfilActualizado) {
        onPerfilActualizado(res);
      }
      setEditandoBio(false);
      setMensajeExito(true);
      setTimeout(() => setMensajeExito(false), 3000);
    } catch (error) {
      alert("Error al guardar texto: " + (error.response?.data?.error || error.message));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section className="relative pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      {/* Floating 3D Chrome Stars */}
      <div className="hidden lg:block absolute top-12 right-[12%] animate-float pointer-events-none opacity-90 z-0" style={{ animationDelay: "-1s" }}>
        <ChromeStar size={85} className="drop-shadow-[0_15px_30px_rgba(255,255,255,0.25)]" />
      </div>
      <div className="hidden lg:block absolute top-48 right-[8%] animate-float pointer-events-none opacity-70 z-0" style={{ animationDelay: "-3.5s" }}>
        <ChromeStar size={48} className="drop-shadow-[0_10px_20px_rgba(255,255,255,0.15)]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-5">
          Bienvenido!{" "}
          <span className="bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Me llamo Leandro Lalanda.
          </span>
        </h1>

        {/* Subtitle / Bio con Botón de Edición Obsidian Chrommy (Solo Admin) */}
        <div className="mb-8 relative max-w-3xl">
          {editandoBio ? (
            <form
              onSubmit={handleGuardarBio}
              className="p-5 rounded-3xl bg-neutral-900/90 border border-neutral-700/80 shadow-[0_8px_30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-xl max-w-2xl animate-fade-in"
            >
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-300" /> Editar presentación / Subtítulo
                </span>
                <span className="text-[10px] text-neutral-400 font-mono bg-white/[0.06] px-2.5 py-0.5 rounded-full border border-white/5">
                  Admin en vivo
                </span>
              </div>
              <textarea
                rows={3}
                value={bioTexto}
                onChange={(e) => setBioTexto(e.target.value)}
                placeholder="Escribe aquí tu presentación personalizada..."
                className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-2xl text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition resize-none leading-relaxed"
                autoFocus
              />
              <div className="flex items-center justify-end gap-2.5 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setBioTexto(perfil?.bio || "");
                    setEditandoBio(false);
                  }}
                  disabled={guardando}
                  className="px-4 py-2 rounded-full text-xs font-medium text-neutral-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5" /> Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-5 py-2 rounded-full text-xs font-semibold text-black bg-white hover:bg-neutral-200 shadow-md shadow-white/10 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {guardando ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" /> Guardar
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between gap-6">
              <p className="text-base sm:text-lg text-neutral-400 font-normal leading-relaxed max-w-2xl">
                {perfil?.bio || "Desarrollador Full Stack enfocado en aplicaciones web modernas y escalables."}
              </p>

              {esAdmin && (
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setBioTexto(perfil?.bio || "");
                      setEditandoBio(true);
                    }}
                    className="p-3 rounded-full bg-gradient-to-b from-neutral-800/90 to-neutral-900/95 border border-neutral-700/80 hover:border-neutral-400 text-neutral-400 hover:text-white shadow-[0_2px_12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all cursor-pointer hover:scale-110 active:scale-95 group backdrop-blur-md"
                    title="Editar presentación (Admin)"
                  >
                    <Edit2 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                  </button>
                  {mensajeExito && (
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> Guardado
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3.5">
          <a
            href="#proyectos"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("proyectos")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-4.5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:bg-neutral-200 transition-all shadow-lg shadow-white/10 flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0"
          >
            Ver Proyectos <ArrowRight className="w-3.5 h-3.5" />
          </a>

          {perfil.redes?.email && (
            <a
              href={`mailto:${perfil.redes.email}`}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#121216]/80 hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm border border-white/10 transition flex items-center gap-1.5 sm:gap-2 backdrop-blur-md shrink-0"
            >
              <Mail className="w-3.5 h-3.5 text-neutral-400" /> Contactarme
            </a>
          )}

          {/* Iconos de Redes y Descarga de CV con el mismo tamaño pequeño */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {perfil.redes?.github && (
              <a
                href={perfil.redes.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#121216]/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/10 transition flex items-center justify-center shrink-0"
                title="GitHub"
              >
                <GithubIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}

            {perfil.redes?.linkedin && (
              <a
                href={perfil.redes.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#121216]/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/10 transition flex items-center justify-center shrink-0"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}

            <a
              href={perfil.redes?.cv || "/LeandroLalandaCV.pdf"}
              download="LeandroLalandaCV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#121216]/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/10 transition flex items-center justify-center shrink-0 group cursor-pointer"
              title="Descargar CV (PDF)"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:text-emerald-400 transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

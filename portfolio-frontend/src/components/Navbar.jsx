import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, LogOut, Sparkles, Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const { usuario, token, logout } = useAuth();
  const esEditor = usuario?.rol === "editor";
  const rolTexto = esEditor ? "Editor" : "Admin";

  const [menuAbierto, setMenuAbierto] = useState(false);

  // Cerrar menú móvil al redimensionar a pantalla grande o con ESC
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuAbierto(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuAbierto(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    setMenuAbierto(false);
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 w-full px-4 flex flex-col items-center pointer-events-none">
      {/* Backdrop transparente para cerrar con animación suave al hacer click afuera */}
      {menuAbierto && (
        <div
          className="fixed inset-0 z-40 pointer-events-auto"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      <div
        className={`relative z-50 pointer-events-auto rounded-full bg-[#0a0a0c]/85 backdrop-blur-xl border border-white/10 px-4 sm:px-7 h-13 sm:h-14 flex items-center justify-between gap-3 sm:gap-8 shadow-2xl shadow-black/90 w-full transition-all duration-300 ${
          token ? "max-w-3xl" : "max-w-2xl"
        }`}
      >
        {/* Brand / Logo (Smooth Scroll to top) */}
        <Link
          to="/"
          onClick={(e) => handleScrollTo(e, "top")}
          className="flex items-center gap-2.5 group shrink-0 cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-b from-white via-neutral-300 to-neutral-700 flex items-center justify-center text-black shadow-md shadow-white/10 group-hover:scale-105 transition">
            <span className="font-extrabold text-[10px]">◈</span>
          </div>
          <span className="font-semibold text-xs sm:text-sm tracking-tight text-white group-hover:text-neutral-300 transition">
            Leandro Lalanda
          </span>
        </Link>

        {/* Navigation links (Desktop) */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-xs font-medium text-neutral-400 shrink-0">
          <a
            href="#proyectos"
            onClick={(e) => handleScrollTo(e, "proyectos")}
            className="hover:text-white transition cursor-pointer"
          >
            Proyectos
          </a>
          <a
            href="#experiencia"
            onClick={(e) => handleScrollTo(e, "experiencia")}
            className="hover:text-white transition cursor-pointer"
          >
            Experiencia
          </a>
          <a
            href="#skills"
            onClick={(e) => handleScrollTo(e, "skills")}
            className="hover:text-white transition cursor-pointer"
          >
            Habilidades
          </a>
          <a
            href="#educacion"
            onClick={(e) => handleScrollTo(e, "educacion")}
            className="hover:text-white transition cursor-pointer"
          >
            Educación
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {token && (
            <div className="hidden sm:flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-full px-1.5 py-0.5 backdrop-blur-sm">
              <Link
                to="/admin"
                title={`Panel de ${rolTexto}`}
                className="px-2.5 py-1 rounded-full text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.08] transition flex items-center gap-1.5"
              >
                {esEditor ? (
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                ) : (
                  <Shield className="w-3.5 h-3.5 text-neutral-300" />
                )}
                <span className="hidden sm:inline font-semibold">{rolTexto}</span>
              </Link>
              <button
                onClick={logout}
                title="Cerrar sesión"
                className="p-1.5 rounded-full text-neutral-400 hover:text-red-400 hover:bg-white/10 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Botón de Contacto principal (Desktop/Tablet) */}
          <a
            href="#contacto"
            onClick={(e) => handleScrollTo(e, "contacto")}
            className="hidden sm:flex px-4 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-all shadow-md shadow-white/10 items-center gap-1.5 cursor-pointer"
          >
            Contacto
          </a>

          {/* Botón Hamburguesa Móvil */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className={`md:hidden p-2 rounded-full text-neutral-300 hover:text-white border transition-all duration-200 cursor-pointer flex items-center justify-center active:scale-95 ${
              menuAbierto
                ? "bg-white/15 border-white/30 text-white rotate-90"
                : "bg-white/[0.06] hover:bg-white/[0.12] border-white/10"
            }`}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
          >
            {menuAbierto ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Contenedor del Menú Desplegable Móvil: Alineado a la derecha del contenedor navbar con Apertura/Cierre Suave */}
      <div
        className={`relative z-50 md:hidden w-full ${
          token ? "max-w-3xl" : "max-w-2xl"
        } flex justify-end transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top-right ${
          menuAbierto
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto mt-2"
            : "opacity-0 scale-90 -translate-y-2 pointer-events-none mt-0"
        }`}
      >
        <div className="w-64 sm:w-72 rounded-3xl bg-[#0a0a0c]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.95)] p-3">
          <nav className="flex flex-col space-y-1 text-xs font-medium text-neutral-300">
            <a
              href="#proyectos"
              onClick={(e) => handleScrollTo(e, "proyectos")}
              className="flex items-center justify-between px-4 py-2.5 rounded-2xl hover:bg-white/[0.08] hover:text-white transition cursor-pointer"
            >
              <span className="font-semibold text-white">Proyectos</span>
              <span className="text-[10px] text-neutral-500 font-mono">01</span>
            </a>
            <a
              href="#experiencia"
              onClick={(e) => handleScrollTo(e, "experiencia")}
              className="flex items-center justify-between px-4 py-2.5 rounded-2xl hover:bg-white/[0.08] hover:text-white transition cursor-pointer"
            >
              <span className="font-semibold text-white">Experiencia</span>
              <span className="text-[10px] text-neutral-500 font-mono">02</span>
            </a>
            <a
              href="#skills"
              onClick={(e) => handleScrollTo(e, "skills")}
              className="flex items-center justify-between px-4 py-2.5 rounded-2xl hover:bg-white/[0.08] hover:text-white transition cursor-pointer"
            >
              <span className="font-semibold text-white">Habilidades</span>
              <span className="text-[10px] text-neutral-500 font-mono">03</span>
            </a>
            <a
              href="#educacion"
              onClick={(e) => handleScrollTo(e, "educacion")}
              className="flex items-center justify-between px-4 py-2.5 rounded-2xl hover:bg-white/[0.08] hover:text-white transition cursor-pointer"
            >
              <span className="font-semibold text-white">Educación</span>
              <span className="text-[10px] text-neutral-500 font-mono">04</span>
            </a>
            <a
              href="#contacto"
              onClick={(e) => handleScrollTo(e, "contacto")}
              className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white text-black font-bold hover:bg-neutral-200 transition mt-1 shadow-md shadow-white/10 cursor-pointer"
            >
              <span>Contacto</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Accesos de Admin/Editor en móvil si está autenticado */}
            {token && (
              <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between gap-2">
                <Link
                  to="/admin"
                  onClick={() => setMenuAbierto(false)}
                  className="flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-neutral-200 hover:text-white transition"
                >
                  {esEditor ? (
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  ) : (
                    <Shield className="w-3.5 h-3.5 text-neutral-300" />
                  )}
                  Panel de {rolTexto}
                </Link>
                <button
                  onClick={() => {
                    setMenuAbierto(false);
                    logout();
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Salir
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

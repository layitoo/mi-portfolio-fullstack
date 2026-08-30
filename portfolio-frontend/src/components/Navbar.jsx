import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, LogOut, Sparkles } from "lucide-react";

export default function Navbar() {
  const { usuario, token, logout } = useAuth();
  const esEditor = usuario?.rol === "editor";
  const rolTexto = esEditor ? "Editor" : "Admin";

  const handleScrollTo = (e, id) => {
    e.preventDefault();
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
    <header className="fixed top-4 left-0 right-0 z-50 w-full px-4 flex justify-center pointer-events-none">
      <div
        className={`pointer-events-auto rounded-full bg-[#0a0a0c]/85 backdrop-blur-xl border border-white/10 px-5 sm:px-7 h-13 sm:h-14 flex items-center justify-between gap-5 sm:gap-8 shadow-2xl shadow-black/90 w-full transition-all duration-300 ${
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
            portfolio<span className="text-neutral-500">.dev</span>
          </span>
        </Link>

        {/* Navigation links (Smooth scroll) */}
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

        {/* Action Button: Badge Rol + Logout + Contacto */}
        <div className="flex items-center gap-3 shrink-0">
          {token && (
            <div className="flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-full px-1.5 py-0.5 backdrop-blur-sm">
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

          {/* Botón de Contacto principal */}
          <a
            href="#contacto"
            onClick={(e) => handleScrollTo(e, "contacto")}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-all shadow-md shadow-white/10 flex items-center gap-1.5 cursor-pointer"
          >
            Contacto
          </a>
        </div>
      </div>
    </header>
  );
}

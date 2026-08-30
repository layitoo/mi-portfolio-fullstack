import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, LogOut } from "lucide-react";

export default function Navbar() {
  const { token, logout } = useAuth();

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
      <div className="pointer-events-auto rounded-full bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/10 px-6 sm:px-8 h-14 flex items-center justify-between gap-6 sm:gap-10 shadow-2xl shadow-black/90 max-w-3xl w-full transition-all duration-300">
        {/* Brand / Logo (Smooth Scroll to top) */}
        <Link
          to="/"
          onClick={(e) => handleScrollTo(e, "top")}
          className="flex items-center gap-2.5 group shrink-0 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-b from-white via-neutral-300 to-neutral-700 flex items-center justify-center text-black shadow-md shadow-white/10 group-hover:scale-105 transition">
            <span className="font-extrabold text-[11px]">◈</span>
          </div>
          <span className="font-semibold text-sm tracking-tight text-white group-hover:text-neutral-300 transition">
            portfolio<span className="text-neutral-500">.dev</span>
          </span>
        </Link>

        {/* Navigation links (Proyectos first, smooth scroll) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-400 shrink-0">
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

        {/* Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          {token ? (
            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/15 text-white border border-white/15 transition flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-neutral-300" /> Admin
              </Link>
              <button
                onClick={logout}
                title="Cerrar sesión"
                className="p-1.5 rounded-full text-neutral-400 hover:text-red-400 hover:bg-white/5 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-all shadow-md shadow-white/10 flex items-center gap-1.5"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

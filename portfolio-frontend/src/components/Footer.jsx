export default function Footer({ perfil }) {
  const anio = new Date().getFullYear();

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const nombreCompleto = perfil?.nombre || "Leandro Martin Lalanda";

  return (
    <footer className="mt-16 sm:mt-24 border-t border-white/10 pt-10 pb-16 sm:pb-10 text-center text-xs bg-[#030304]/95 backdrop-blur-md relative z-20 overflow-hidden">
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-24 bg-white/[0.04] rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-4 relative z-10">
        {/* Enlaces de Navegación del Footer */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-neutral-300 font-medium">
          <a
            href="#proyectos"
            onClick={(e) => handleScrollTo(e, "proyectos")}
            className="hover:text-white transition-colors cursor-pointer py-1"
          >
            Proyectos
          </a>
          <a
            href="#experiencia"
            onClick={(e) => handleScrollTo(e, "experiencia")}
            className="hover:text-white transition-colors cursor-pointer py-1"
          >
            Experiencia
          </a>
          <a
            href="#skills"
            onClick={(e) => handleScrollTo(e, "skills")}
            className="hover:text-white transition-colors cursor-pointer py-1"
          >
            Habilidades
          </a>
          <a
            href="#educacion"
            onClick={(e) => handleScrollTo(e, "educacion")}
            className="hover:text-white transition-colors cursor-pointer py-1"
          >
            Educación
          </a>
          <a
            href="#contacto"
            onClick={(e) => handleScrollTo(e, "contacto")}
            className="hover:text-white transition-colors cursor-pointer py-1"
          >
            Contacto
          </a>
        </div>

        {/* Copyright y Créditos */}
        <p className="text-neutral-400 text-xs font-normal tracking-wide">
          © {anio} {nombreCompleto}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

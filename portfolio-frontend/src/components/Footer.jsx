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
    <footer className="mt-16 border-t border-white/5 py-8 text-center text-xs text-neutral-500 bg-[#030304]/80 backdrop-blur-md relative overflow-hidden">
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-20 bg-white/[0.02] rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-3">

        <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-neutral-400 font-medium">
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
          <a
            href="#contacto"
            onClick={(e) => handleScrollTo(e, "contacto")}
            className="hover:text-white transition cursor-pointer"
          >
            Contacto
          </a>
        </div>

        <p className="text-neutral-500 text-[11px]">
          © {anio} {nombreCompleto}.
        </p>
      </div>
    </footer>
  );
}

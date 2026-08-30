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
    <footer className="mt-32 border-t border-white/5 py-16 text-center text-xs text-neutral-500 bg-[#030304] relative overflow-hidden">
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        {/* Giant Watermark Typography */}
        <div className="text-3xl sm:text-6xl font-black tracking-tighter text-white/[0.04] uppercase select-none mb-6">
          {nombreCompleto}
        </div>

        <div className="flex items-center justify-center gap-6 mb-4 text-xs text-neutral-400 font-medium">
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
        </div>

        <p className="text-neutral-500 text-[11px]">
          © {anio} {nombreCompleto}.
        </p>
      </div>
    </footer>
  );
}

import { Mail, ArrowRight } from "lucide-react";
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

export default function Hero({ perfil }) {
  if (!perfil) return null;

  const stack = ["React.js", "Node.js", "Express", "MongoDB", "Tailwind CSS"];

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
        {/* Top Tag Pill */}
        <div className="flex items-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-neutral-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Disponible para nuevos proyectos
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-5">
          Desarrollo de Videojuegos &{" "}
          <span className="bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Diseño 3D.
          </span>
        </h1>

        {/* Subtitle / Bio */}
        <p className="text-base sm:text-lg text-neutral-400 max-w-2xl font-normal leading-relaxed mb-6">
          Hola, soy <strong className="text-white font-semibold">{perfil.nombre || "Leandro Martin Lalanda"}</strong> - {perfil.titulo || ""}. {perfil.bio || ""}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5 mb-6">
          <a
            href="#proyectos"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("proyectos")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 py-3 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:bg-neutral-200 transition-all shadow-lg shadow-white/10 flex items-center gap-2 cursor-pointer"
          >
            Ver Proyectos <ArrowRight className="w-3.5 h-3.5" />
          </a>

          {perfil.redes?.email && (
            <a
              href={`mailto:${perfil.redes.email}`}
              className="px-5 py-3 rounded-full bg-[#121216]/80 hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm border border-white/10 transition flex items-center gap-2 backdrop-blur-md"
            >
              <Mail className="w-3.5 h-3.5 text-neutral-400" /> Contactarme
            </a>
          )}

          {perfil.redes?.github && (
            <a
              href={perfil.redes.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-[#121216]/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/10 transition"
              title="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}

          {perfil.redes?.linkedin && (
            <a
              href={perfil.redes.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-[#121216]/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/10 transition"
              title="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Metallic Grey Pill Badges ("Nubes grises") */}
        <div className="flex flex-wrap items-center gap-2.5">
          {stack.map((item, i) => (
            <div
              key={i}
              className="px-4 py-1.5 rounded-full bg-gradient-to-b from-neutral-800/90 to-neutral-900/95 border border-neutral-700/70 shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.16)] text-neutral-300 text-xs font-medium hover:border-neutral-500 hover:text-white transition-all cursor-default select-none backdrop-blur-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

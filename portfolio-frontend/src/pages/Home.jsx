import { useEffect, useState, useMemo } from "react";
import { obtenerPerfil } from "../services/perfil.service";
import { obtenerProyectos } from "../services/proyectos.service";
import { obtenerExperiencias } from "../services/experiencia.service";
import { obtenerEducacion } from "../services/educacion.service";
import { obtenerSkills } from "../services/skills.service";
import { incrementarVisitas } from "../services/visitas.service";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProjectCard from "../components/ProjectCard";
import { ExperienceTimeline, EducationTimeline } from "../components/Timeline";
import SkillsGrid from "../components/SkillsGrid";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import LiquidChromeCanvas from "../components/LiquidChromeCanvas";

export default function Home() {
  const [perfil, setPerfil] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [experiencias, setExperiencias] = useState([]);
  const [educacion, setEducacion] = useState([]);
  const [skills, setSkills] = useState([]);
  const [visitas, setVisitas] = useState(null);
  const [techFiltro, setTechFiltro] = useState("Todos");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [perfilData, proyectosData, experienciasData, educacionData, skillsData, visitasData] =
          await Promise.all([
            obtenerPerfil().catch(() => null),
            obtenerProyectos().catch(() => []),
            obtenerExperiencias().catch(() => []),
            obtenerEducacion().catch(() => []),
            obtenerSkills().catch(() => []),
            incrementarVisitas().catch(() => ({ total: 1 })),
          ]);

        setPerfil(perfilData);
        setProyectos(proyectosData);
        setExperiencias(experienciasData);
        setEducacion(educacionData);
        setSkills(skillsData);
        setVisitas(visitasData?.total || 1);
      } catch (error) {
        console.error("Error cargando datos del portfolio:", error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  // Extraer lista única de tecnologías presentes en los proyectos para la barra de filtros
  const tecnologiasDisponibles = useMemo(() => {
    const set = new Set();
    proyectos.forEach((p) => {
      if (Array.isArray(p.tecnologias)) {
        p.tecnologias.forEach((t) => set.add(t.trim()));
      } else if (typeof p.tecnologias === "string") {
        p.tecnologias.split(",").forEach((t) => set.add(t.trim()));
      }
    });
    return ["Todos", ...Array.from(set).filter(Boolean)];
  }, [proyectos]);

  // Proyectos filtrados según la tecnología seleccionada (Reto 4)
  const proyectosFiltrados = useMemo(() => {
    if (techFiltro === "Todos") return proyectos;
    return proyectos.filter((p) => {
      const techs = Array.isArray(p.tecnologias)
        ? p.tecnologias
        : typeof p.tecnologias === "string"
        ? p.tecnologias.split(",").map((t) => t.trim())
        : [];
      return techs.some((t) => t.toLowerCase() === techFiltro.toLowerCase());
    });
  }, [proyectos, techFiltro]);

  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#030304] text-white">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin mb-4"></div>
        <p className="text-xs text-neutral-500 font-mono tracking-wider uppercase">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-white selection:text-black overflow-x-hidden bg-grid-pattern">
      {/* Procedural Liquid Chrome Canvas */}
      <LiquidChromeCanvas />

      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        <Navbar />

        <main className="flex-1">
          {/* 1. Hero */}
          <Hero perfil={perfil} />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-32">
            {/* 2. Proyectos & Reto 4 (Filtro por Tecnología) */}
            <section id="proyectos" className="scroll-mt-28">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/[0.04] border border-white/10 text-neutral-400 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    Trabajos Destacados
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                    Proyectos & Aplicaciones
                  </h2>
                  <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                    Soluciones web completas construidas de punta a punta.
                  </p>
                </div>
              </div>

              {/* Barra de Filtros por Tecnología (Reto 4) */}
              {tecnologiasDisponibles.length > 2 && (
                <div className="flex flex-wrap items-center gap-2 mb-8">
                  {tecnologiasDisponibles.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => setTechFiltro(tech)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        techFiltro === tech
                          ? "bg-white text-black font-semibold shadow-md shadow-white/10"
                          : "bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/5"
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              )}

              {proyectosFiltrados.length === 0 ? (
                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
                  <p className="text-neutral-500 text-xs italic">
                    No se encontraron proyectos con la tecnología seleccionada ({techFiltro}).
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {proyectosFiltrados.map((proyecto) => (
                    <ProjectCard key={proyecto._id} proyecto={proyecto} />
                  ))}
                </div>
              )}
            </section>

            {/* 3. Experiencia Laboral */}
            <section id="experiencia" className="scroll-mt-28">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/[0.04] border border-white/10 text-neutral-400 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  Trayectoria
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Experiencia Profesional
                </h2>
              </div>
              <ExperienceTimeline items={experiencias} />
            </section>

            {/* 4. Skills / Habilidades */}
            <section id="skills" className="scroll-mt-28">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/[0.04] border border-white/10 text-neutral-400 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  Capacidades
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Habilidades Técnicas
                </h2>
              </div>
              <SkillsGrid skills={skills} />
            </section>

            {/* 5. Educación */}
            <section id="educacion" className="scroll-mt-28">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/[0.04] border border-white/10 text-neutral-400 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  Formación
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Educación y Certificaciones
                </h2>
              </div>
              <EducationTimeline items={educacion} />
            </section>

            {/* 6. Formulario de Contacto (Reto 3) */}
            <ContactSection emailDestino={perfil?.redes?.email} />
          </div>
        </main>

        <Footer perfil={perfil} visitas={visitas} />
      </div>
    </div>
  );
}

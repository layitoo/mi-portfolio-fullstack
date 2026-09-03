import { useEffect, useState } from "react";
import { obtenerPerfil } from "../services/perfil.service";
import { obtenerProyectos } from "../services/proyectos.service";
import { obtenerExperiencias } from "../services/experiencia.service";
import { obtenerEducacion } from "../services/educacion.service";
import { obtenerSkills } from "../services/skills.service";
import { incrementarVisitas, obtenerVisitas } from "../services/visitas.service";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
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
  const [cargando, setCargando] = useState(true);
  const [proyectoModal, setProyectoModal] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        // Manejo de visita única por sesión (evita doble conteo por React StrictMode en desarrollo)
        let promesaVisita;
        if (!sessionStorage.getItem("portfolio_visita_registrada")) {
          sessionStorage.setItem("portfolio_visita_registrada", "true");
          promesaVisita = incrementarVisitas().catch(() => ({ total: 1 }));
        } else {
          promesaVisita = obtenerVisitas().catch(() => ({ total: 1 }));
        }

        const [perfilData, proyectosData, experienciasData, educacionData, skillsData] =
          await Promise.all([
            obtenerPerfil().catch(() => null),
            obtenerProyectos().catch(() => []),
            obtenerExperiencias().catch(() => []),
            obtenerEducacion().catch(() => []),
            obtenerSkills().catch(() => []),
            promesaVisita,
          ]);

        setPerfil(perfilData);
        setProyectos(proyectosData);
        setExperiencias(experienciasData);
        setEducacion(educacionData);
        setSkills(skillsData);
      } catch (error) {
        console.error("Error cargando datos del portfolio:", error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);



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
        <Navbar perfil={perfil} />

        <main className="flex-1">
          {/* 1. Hero */}
          <Hero perfil={perfil} onPerfilActualizado={setPerfil} />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-32">
            {/* 2. Proyectos */}
            <section id="proyectos" className="scroll-mt-28">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/[0.04] border border-white/10 text-neutral-400 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    Trabajos Destacados
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                    Proyectos & Aplicaciones
                  </h2>
                </div>
              </div>

              {proyectos.length === 0 ? (
                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
                  <p className="text-neutral-500 text-xs italic">
                    No hay proyectos disponibles actualmente.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {proyectos.map((proyecto) => (
                    <ProjectCard
                      key={proyecto._id}
                      proyecto={proyecto}
                      onOpenModal={setProyectoModal}
                    />
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

        <Footer perfil={perfil} />
      </div>

      {/* Modal de Galería / Carrusel Obsidian Glassmorphism */}
      {proyectoModal && (
        <ProjectModal
          proyecto={proyectoModal}
          onClose={() => setProyectoModal(null)}
        />
      )}
    </div>
  );
}

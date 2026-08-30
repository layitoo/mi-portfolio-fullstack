import { Layout, Server, Cloud, Box, Terminal, Sparkles } from "lucide-react";
import TechIcon from "./TechIcon";

function getCategoriaIcon(categoria) {
  const cat = categoria.toLowerCase();
  if (cat.includes("front")) return <Layout className="w-4 h-4 text-neutral-300" />;
  if (cat.includes("back")) return <Server className="w-4 h-4 text-neutral-300" />;
  if (cat.includes("cloud") || cat.includes("data") || cat.includes("base")) return <Cloud className="w-4 h-4 text-neutral-300" />;
  if (cat.includes("3d") || cat.includes("creat") || cat.includes("diseño")) return <Box className="w-4 h-4 text-cyan-300" />;
  if (cat.includes("herr") || cat.includes("tool") || cat.includes("git")) return <Terminal className="w-4 h-4 text-neutral-300" />;
  return <Sparkles className="w-4 h-4 text-neutral-300" />;
}

function getNivelBadgeClass(nivel) {
  const n = (nivel || "").toLowerCase();
  if (n === "avanzado") return "text-emerald-400/90 font-medium";
  if (n === "intermedio") return "text-neutral-400";
  return "text-neutral-500";
}

export default function SkillsGrid({ skills }) {
  if (!skills || skills.length === 0) {
    return <p className="text-neutral-500 text-xs italic">Sin habilidades agregadas aún.</p>;
  }

  const categorias = [...new Set(skills.map((s) => s.categoria || "Generales"))];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-6">
      {categorias.map((cat) => {
        const skillsDeCat = skills.filter((s) => (s.categoria || "Generales") === cat);
        const es3D = cat.toLowerCase().includes("3d");

        return (
          <div
            key={cat}
            className={`glass-panel p-6 rounded-3xl transition-all duration-300 hover:border-white/20 ${
              es3D ? "border-cyan-500/20 bg-gradient-to-b from-neutral-900/90 to-neutral-950/95" : ""
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                {getCategoriaIcon(cat)}
                <span>{cat}</span>
              </h4>
              <span className="text-[10px] font-mono text-neutral-500 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/5">
                {skillsDeCat.length}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {skillsDeCat.map((s) => (
                <div
                  key={s._id}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.04] text-neutral-200 border border-white/10 flex items-center gap-2 hover:border-white/30 hover:bg-white/[0.08] hover:text-white transition cursor-default select-none backdrop-blur-sm"
                >
                  <TechIcon tech={s.nombre} className="w-3.5 h-3.5" />
                  <span>{s.nombre}</span>
                  {s.nivel && (
                    <span className={`text-[10px] ${getNivelBadgeClass(s.nivel)}`}>
                      • {s.nivel}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

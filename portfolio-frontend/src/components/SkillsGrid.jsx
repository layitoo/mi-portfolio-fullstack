import { Code, CheckCircle2 } from "lucide-react";

export default function SkillsGrid({ skills }) {
  if (!skills || skills.length === 0) return <p className="text-neutral-500 text-xs italic">Sin skills agregadas aún.</p>;

  const categorias = [...new Set(skills.map((s) => s.categoria || "Generales"))];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-6">
      {categorias.map((cat) => {
        const skillsDeCat = skills.filter((s) => (s.categoria || "Generales") === cat);
        return (
          <div
            key={cat}
            className="glass-panel p-6 rounded-3xl transition-all duration-300"
          >
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white/70"></span>
              {cat}
            </h4>
            <div className="flex flex-wrap gap-2">
              {skillsDeCat.map((s) => (
                <div
                  key={s._id}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.04] text-neutral-300 border border-white/10 flex items-center gap-1.5 hover:border-white/25 hover:text-white transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{s.nombre}</span>
                  {s.nivel && (
                    <span className="text-[10px] text-neutral-500 font-normal">
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

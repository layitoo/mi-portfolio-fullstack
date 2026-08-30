import { Calendar, Building2, GraduationCap } from "lucide-react";

export function ExperienceTimeline({ items }) {
  if (!items || items.length === 0) return <p className="text-neutral-500 text-xs italic">Sin experiencia agregada aún.</p>;

  return (
    <div className="space-y-4 my-6">
      {items.map((item) => (
        <div
          key={item._id}
          className="glass-panel p-6 rounded-3xl transition-all duration-300 group"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <h4 className="text-base font-bold text-white group-hover:text-neutral-200 transition">
              {item.puesto}
            </h4>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 bg-white/[0.04] px-3 py-1 rounded-full border border-white/10">
              <Calendar className="w-3 h-3 text-neutral-400" />
              {item.fechaInicio} {item.actual ? "— Presente" : item.fechaFin ? `— ${item.fechaFin}` : ""}
            </span>
          </div>

          <p className="text-xs font-medium text-neutral-300 flex items-center gap-1.5 mb-3">
            <Building2 className="w-3.5 h-3.5 text-neutral-500" /> {item.empresa}
          </p>

          <p className="text-xs text-neutral-400 leading-relaxed whitespace-pre-line">
            {item.descripcion}
          </p>
        </div>
      ))}
    </div>
  );
}

export function EducationTimeline({ items }) {
  if (!items || items.length === 0) return <p className="text-neutral-500 text-xs italic">Sin educación agregada aún.</p>;

  return (
    <div className="space-y-4 my-6">
      {items.map((item) => (
        <div
          key={item._id}
          className="glass-panel p-6 rounded-3xl transition-all duration-300 group"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <h4 className="text-base font-bold text-white group-hover:text-neutral-200 transition">
              {item.titulo}
            </h4>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 bg-white/[0.04] px-3 py-1 rounded-full border border-white/10">
              <Calendar className="w-3 h-3 text-neutral-400" />
              {item.fechaInicio} {item.fechaFin ? `— ${item.fechaFin}` : ""}
            </span>
          </div>

          <p className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-neutral-500" /> {item.institucion}
          </p>
        </div>
      ))}
    </div>
  );
}

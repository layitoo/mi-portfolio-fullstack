import {
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiTailwindcss,
  SiJavascript,
  SiTypescript,
  SiBlender,
  SiVite,
  SiPostman,
  SiGit,
  SiGithub,
  SiCloudinary,
  SiHtml5,
  SiCss,
  SiPython,
  SiDocker,
  SiNextdotjs,
  SiFigma,
  SiThreedotjs,
  SiPostgresql,
  SiMysql,
  SiFirebase,
  SiSupabase,
  SiGraphql,
  SiJsonwebtokens,
} from "react-icons/si";

export default function TechIcon({ tech, className = "w-3.5 h-3.5" }) {
  if (!tech) return <span className="text-neutral-400">◈</span>;
  const t = tech.toLowerCase().trim();

  if (t.includes("react")) return <SiReact className={`${className} text-[#61DAFB] shrink-0`} />;
  if (t.includes("node")) return <SiNodedotjs className={`${className} text-[#5FA04E] shrink-0`} />;
  if (t.includes("express")) return <SiExpress className={`${className} text-neutral-200 shrink-0`} />;
  if (t.includes("mongo")) return <SiMongodb className={`${className} text-[#47A248] shrink-0`} />;
  if (t.includes("tailwind")) return <SiTailwindcss className={`${className} text-[#06B6D4] shrink-0`} />;
  if (t.includes("javascript") || t === "js" || t.includes("es6")) {
    return <SiJavascript className={`${className} text-[#F7DF1E] rounded-xs shrink-0`} />;
  }
  if (t.includes("typescript") || t === "ts") return <SiTypescript className={`${className} text-[#3178C6] shrink-0`} />;
  if (t.includes("html")) return <SiHtml5 className={`${className} text-[#E34F26] shrink-0`} />;
  if (t.includes("css")) return <SiCss className={`${className} text-[#1572B6] shrink-0`} />;
  if (t.includes("vite")) return <SiVite className={`${className} text-[#646CFF] shrink-0`} />;
  if (t.includes("blender") || t.includes("3d") || t.includes("modelado") || t.includes("animacion")) {
    return <SiBlender className={`${className} text-[#E87D0D] shrink-0`} />;
  }
  if (t.includes("three")) return <SiThreedotjs className={`${className} text-white shrink-0`} />;
  if (t.includes("git") && !t.includes("hub")) return <SiGit className={`${className} text-[#F05032] shrink-0`} />;
  if (t.includes("github")) return <SiGithub className={`${className} text-white shrink-0`} />;
  if (t.includes("postman")) return <SiPostman className={`${className} text-[#FF6C37] shrink-0`} />;
  if (t.includes("cloud")) return <SiCloudinary className={`${className} text-[#3448C5] shrink-0`} />;
  if (t.includes("figma")) return <SiFigma className={`${className} text-[#F24E1E] shrink-0`} />;
  if (t.includes("jwt") || t.includes("token")) return <SiJsonwebtokens className={`${className} text-[#D63AFF] shrink-0`} />;
  if (t.includes("python")) return <SiPython className={`${className} text-[#3776AB] shrink-0`} />;
  if (t.includes("docker")) return <SiDocker className={`${className} text-[#2496ED] shrink-0`} />;
  if (t.includes("next")) return <SiNextdotjs className={`${className} text-white shrink-0`} />;
  if (t.includes("postgres")) return <SiPostgresql className={`${className} text-[#4169E1] shrink-0`} />;
  if (t.includes("mysql")) return <SiMysql className={`${className} text-[#4479A1] shrink-0`} />;
  if (t.includes("firebase")) return <SiFirebase className={`${className} text-[#FFCA28] shrink-0`} />;
  if (t.includes("supabase")) return <SiSupabase className={`${className} text-[#3ECF8E] shrink-0`} />;
  if (t.includes("graphql")) return <SiGraphql className={`${className} text-[#E10098] shrink-0`} />;

  return <span className="text-neutral-400">◈</span>;
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Lock, Mail, AlertCircle, ArrowLeft } from "lucide-react";
import ChromeStar from "../../components/ChromeStar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.mensaje || "Credenciales incorrectas");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030304] bg-grid-pattern px-4 relative overflow-hidden">
      {/* Background Chrome Star Accents */}
      <div className="absolute top-12 right-12 opacity-30 pointer-events-none hidden sm:block">
        <ChromeStar size={70} />
      </div>
      <div className="absolute bottom-12 left-12 opacity-20 pointer-events-none hidden sm:block">
        <ChromeStar size={50} />
      </div>

      <div className="glass-panel relative w-full max-w-md rounded-3xl p-8 sm:p-10 shadow-2xl z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al Portfolio
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm shadow-lg shadow-white/10">
            ◈
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Ingresar
            </h1>
            <p className="text-xs text-neutral-400">
              Acceso exclusivo para el administrador
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu-email@ejemplo.com"
                className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full mt-4 py-3 rounded-full bg-white text-black hover:bg-neutral-200 font-semibold text-xs transition-all shadow-md shadow-white/10 disabled:opacity-50 cursor-pointer"
          >
            {cargando ? "Iniciando sesión..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Mail, User, MessageSquare } from "lucide-react";
import { enviarContacto } from "../services/contacto.service";

export default function ContactSection({ emailDestino }) {
  const [formData, setFormData] = useState({ nombre: "", email: "", mensaje: "" });
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      await enviarContacto(formData);
      setEnviado(true);
      setFormData({ nombre: "", email: "", mensaje: "" });
    } catch (err) {
      setError(err.response?.data?.detalles?.[0]?.msg || err.response?.data?.error || "Error al enviar el mensaje");
    } finally {
      setCargando(false);
    }
  };

  return (
    <section id="contacto" className="scroll-mt-28">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/[0.04] border border-white/10 text-neutral-400 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Contacto
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Iniciemos un Proyecto Juntos
        </h2>
        <p className="text-neutral-400 text-xs sm:text-sm mt-1">
          Completá el formulario o escribime directamente a{" "}
          <a href={`mailto:${emailDestino || "lalandaleandro@gmail.com"}`} className="text-white underline hover:text-neutral-300 transition">
            {emailDestino || "lalandaleandro@gmail.com"}
          </a>
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 relative overflow-hidden">
        {enviado ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10 animate-bounce">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">¡Mensaje Enviado con Éxito!</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Muchas gracias por ponerte en contacto. Recibí tu mensaje y te responderé lo antes posible.
            </p>
            <button
              type="button"
              onClick={() => setEnviado(false)}
              className="mt-4 px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Tu nombre"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu-email@empresa.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Mensaje o Consulta
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                <textarea
                  required
                  rows={4}
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  placeholder="Contame sobre tu idea, propuesta o proyecto..."
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {cargando ? (
                "Enviando mensaje..."
              ) : (
                <>
                  Enviar Mensaje <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

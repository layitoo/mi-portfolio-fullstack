import { createContext, useContext, useState, useEffect, useRef } from "react";
import { login as loginService, obtenerMiPerfil } from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const estaAutenticadoRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function sincronizarUsuario() {
      // Si no hay token, terminar carga
      if (!token) {
        if (isMounted) {
          setUsuario(null);
          setCargando(false);
        }
        return;
      }

      // Si ya fue autenticado y tenemos los datos de usuario en memoria (ej. tras login), evitar doble fetch
      if (estaAutenticadoRef.current && usuario) {
        if (isMounted) setCargando(false);
        return;
      }

      try {
        const datosUsuario = await obtenerMiPerfil();
        if (isMounted) {
          setUsuario(datosUsuario);
          estaAutenticadoRef.current = true;
        }
      } catch (err) {
        if (isMounted) {
          console.warn("Sesión inválida o expirada. Limpiando almacenamiento local.");
          localStorage.removeItem("token");
          setToken(null);
          setUsuario(null);
          estaAutenticadoRef.current = false;
        }
      } finally {
        if (isMounted) {
          setCargando(false);
        }
      }
    }

    sincronizarUsuario();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (email, password) => {
    const data = await loginService({ email, password });
    localStorage.setItem("token", data.token);
    estaAutenticadoRef.current = true;
    setToken(data.token);
    setUsuario(data.usuario);
    return data;
  };

  const logout = () => {
    estaAutenticadoRef.current = false;
    localStorage.removeItem("token");
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

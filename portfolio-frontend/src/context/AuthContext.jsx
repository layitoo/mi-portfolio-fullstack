import { createContext, useContext, useState, useEffect } from "react";
import { login as loginService, obtenerMiPerfil } from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (token) {
      obtenerMiPerfil()
        .then((data) => setUsuario(data))
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
          setUsuario(null);
        })
        .finally(() => setCargando(false));
    } else {
      setCargando(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await loginService({ email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUsuario(data.usuario);
    return data;
  };

  const logout = () => {
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

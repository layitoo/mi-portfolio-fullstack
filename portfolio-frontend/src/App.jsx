import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RutaPrivada from "./components/RutaPrivada";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública del Portfolio */}
          <Route path="/" element={<Home />} />

          {/* Login de Administrador */}
          <Route path="/admin/login" element={<Login />} />

          {/* Panel de Administración Privado */}
          <Route
            path="/admin"
            element={
              <RutaPrivada>
                <AdminDashboard />
              </RutaPrivada>
            }
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

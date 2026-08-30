module.exports = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: "Acceso no autorizado: Debe iniciar sesión" });
    }

    const rolUsuario = req.usuario.rol || "admin";
    if (!rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({
        error: `Permiso denegado: Se requiere rol de Administrador para eliminar registros. Tu rol actual es [${rolUsuario}].`,
      });
    }

    next();
  };
};

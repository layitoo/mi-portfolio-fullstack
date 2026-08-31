module.exports = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: "Acceso no autorizado: Debe iniciar sesión" });
    }

    const rolUsuario = req.usuario.rol;
    if (!rolUsuario || !rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({
        error: `Permiso denegado: Se requiere uno de los siguientes roles [${rolesPermitidos.join(
          ", "
        )}]. Tu rol actual es [${rolUsuario || "ninguno"}].`,
      });
    }

    next();
  };
};

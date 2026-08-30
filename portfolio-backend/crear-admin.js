require("dotenv").config();
const bcrypt = require("bcrypt");
const { conectarDB, getDB } = require("./config/db");

async function crearAdmin() {
  await conectarDB();
  const db = getDB();

  const email = "admin@miportfolio.com";
  const passwordPlano = "admin123";

  const passwordHash = await bcrypt.hash(passwordPlano, 10);

  await db.collection("usuarios").updateOne(
    { email },
    {
      $set: {
        email,
        passwordHash,
        rol: "admin",
        cuentaVerificada: true,
        actualizadoEn: new Date().toISOString(),
      },
    },
    { upsert: true }
  );

  console.log("-----------------------------------------");
  console.log("✅ Usuario Administrador configurado con éxito:");
  console.log(`👤 Email:      ${email}`);
  console.log(`🔑 Contraseña: ${passwordPlano}`);
  console.log("-----------------------------------------");
  process.exit(0);
}

crearAdmin().catch(console.error);

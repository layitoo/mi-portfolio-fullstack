require("dotenv").config();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { conectarDB, getDB } = require("./config/db");

async function crearUsuarios() {
  await conectarDB();
  const db = getDB();

  // 1. Usuario Administrador (Permite leer de .env o genera password criptográfica segura)
  const adminEmail = process.env.ADMIN_EMAIL || "admin@miportfolio.com";
  const adminPass = process.env.ADMIN_PASSWORD || crypto.randomBytes(8).toString("hex") + "!";
  const adminHash = await bcrypt.hash(adminPass, 10);

  await db.collection("usuarios").updateOne(
    { email: adminEmail },
    {
      $set: {
        email: adminEmail,
        passwordHash: adminHash,
        rol: "admin",
        cuentaVerificada: true,
        actualizadoEn: new Date().toISOString(),
      },
    },
    { upsert: true }
  );

  // 2. Usuario Editor (Permite leer de .env o genera password criptográfica segura)
  const editorEmail = process.env.EDITOR_EMAIL || "editor@miportfolio.com";
  const editorPass = process.env.EDITOR_PASSWORD || crypto.randomBytes(8).toString("hex") + "!";
  const editorHash = await bcrypt.hash(editorPass, 10);

  await db.collection("usuarios").updateOne(
    { email: editorEmail },
    {
      $set: {
        email: editorEmail,
        passwordHash: editorHash,
        rol: "editor",
        cuentaVerificada: true,
        actualizadoEn: new Date().toISOString(),
      },
    },
    { upsert: true }
  );

  console.log("=================================================");
  console.log("🔐 CUENTAS DE ACCESO GENERADAS / ACTUALIZADAS:");
  console.log("-------------------------------------------------");
  console.log("👑 ADMINISTRADOR (Acceso Total):");
  console.log(`   Email:      ${adminEmail}`);
  console.log(`   Password:   ${adminPass}`);
  console.log("-------------------------------------------------");
  console.log("✏️ EDITOR (Creación y Edición sin permisos de borrado):");
  console.log(`   Email:      ${editorEmail}`);
  console.log(`   Password:   ${editorPass}`);
  console.log("=================================================");
  console.log("💡 Tip de Seguridad: Guarda estas credenciales en un gestor seguro.");
  console.log("=================================================");
  process.exit(0);
}

crearUsuarios().catch(console.error);

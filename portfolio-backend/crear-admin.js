require("dotenv").config();
const bcrypt = require("bcrypt");
const { conectarDB, getDB } = require("./config/db");

async function crearUsuarios() {
  await conectarDB();
  const db = getDB();

  // 1. Usuario Administrador (Acceso total)
  const adminEmail = "admin@miportfolio.com";
  const adminPass = "admin123";
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

  // 2. Usuario Editor (Puede crear y editar, pero NO eliminar - Reto 5)
  const editorEmail = "editor@miportfolio.com";
  const editorPass = "editor123";
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

  console.log("=========================================");
  console.log("✅ Cuentas de acceso configuradas con éxito:");
  console.log("-----------------------------------------");
  console.log("👑 ADMINISTRADOR (Acceso Total):");
  console.log(`   Email:      ${adminEmail}`);
  console.log(`   Password:   ${adminPass}`);
  console.log("-----------------------------------------");
  console.log("✏️ EDITOR (Creación y Edición sin borrado):");
  console.log(`   Email:      ${editorEmail}`);
  console.log(`   Password:   ${editorPass}`);
  console.log("=========================================");
  process.exit(0);
}

crearUsuarios().catch(console.error);

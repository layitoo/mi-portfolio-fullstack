const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const { MongoClient } = require("mongodb");

let db;

async function asegurarIndices(database) {
  try {
    // 1. Usuarios: email único
    await database.collection("usuarios").createIndex({ email: 1 }, { unique: true });

    // 2. Proyectos: orden ascendente y filtro destacado
    await database.collection("proyectos").createIndex({ orden: 1, destacado: -1 });
    await database.collection("proyectos").createIndex({ destacado: 1 });

    // 3. Experiencia: orden ascendente
    await database.collection("experiencia").createIndex({ orden: 1 });

    // 4. Educacion: orden ascendente
    await database.collection("educacion").createIndex({ orden: 1 });

    // 5. Skills: categoría y orden
    await database.collection("skills").createIndex({ categoria: 1, orden: 1 });

    console.log("⚡ Índices de MongoDB optimizados y verificados ✅");
  } catch (error) {
    console.warn("⚠️ Aviso al inicializar índices de MongoDB:", error.message);
  }
}

async function conectarDB() {
  try {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const dbName = process.env.DB_NAME || "Portfolio";
    db = client.db(dbName);
    console.log(`Conectado a MongoDB ✅ (Base de datos: ${dbName})`);

    // Asegurar índices de base de datos
    await asegurarIndices(db);

    return db;
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
}

function getDB() {
  if (!db) {
    throw new Error("La base de datos todavía no está conectada");
  }
  return db;
}

module.exports = { conectarDB, getDB };

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const { MongoClient } = require("mongodb");

let db;

async function conectarDB() {
  try {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const dbName = process.env.DB_NAME || "Portfolio";
    db = client.db(dbName);
    console.log(`Conectado a MongoDB ✅ (Base de datos: ${dbName})`);
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

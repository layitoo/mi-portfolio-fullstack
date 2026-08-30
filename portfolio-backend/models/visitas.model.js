const { getDB } = require("../config/db");

const coleccion = () => getDB().collection("visitas");

exports.incrementar = async () => {
  const resultado = await coleccion().findOneAndUpdate(
    { _id: "global" },
    {
      $inc: { total: 1 },
      $set: { ultimaVisita: new Date() },
    },
    { upsert: true, returnDocument: "after" }
  );
  return resultado?.total || resultado?.value?.total || 1;
};

exports.obtener = async () => {
  const doc = await coleccion().findOne({ _id: "global" });
  return { total: doc?.total || 0, ultimaVisita: doc?.ultimaVisita || null };
};

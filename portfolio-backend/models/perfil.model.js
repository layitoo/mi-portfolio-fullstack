const { getDB } = require("../config/db");

const coleccion = () => getDB().collection("perfil");

exports.obtener = () => {
  return coleccion().findOne({});
};

exports.actualizar = async (datos) => {
  // Extraemos _id para que MongoDB no intente modificar el campo inmutable _id
  const { _id, ...datosSinId } = datos;
  const perfilExistente = await coleccion().findOne({});
  const fechaActual = new Date().toISOString();

  if (!perfilExistente) {
    const resultado = await coleccion().insertOne({
      ...datosSinId,
      actualizadoEn: fechaActual,
    });
    return { _id: resultado.insertedId, ...datosSinId, actualizadoEn: fechaActual };
  }

  await coleccion().updateOne(
    { _id: perfilExistente._id },
    { $set: { ...datosSinId, actualizadoEn: fechaActual } }
  );

  return { ...perfilExistente, ...datosSinId, actualizadoEn: fechaActual };
};

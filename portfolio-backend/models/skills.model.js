const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const coleccion = () => getDB().collection("skills");

exports.obtenerTodos = () => {
  return coleccion().find({}).toArray();
};

exports.obtenerPorId = (id) => {
  return coleccion().findOne({ _id: new ObjectId(id) });
};

exports.crear = async (datos) => {
  const { _id, ...datosSinId } = datos;
  const resultado = await coleccion().insertOne(datosSinId);
  return { _id: resultado.insertedId, ...datosSinId };
};

exports.actualizar = (id, datos) => {
  const { _id, ...datosSinId } = datos;
  return coleccion().updateOne({ _id: new ObjectId(id) }, { $set: datosSinId });
};

exports.eliminar = (id) => {
  return coleccion().deleteOne({ _id: new ObjectId(id) });
};

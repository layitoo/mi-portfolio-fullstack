const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const coleccion = () => getDB().collection("proyectos");

exports.obtenerTodos = () => {
  return coleccion().find({}).sort({ destacado: -1 }).toArray();
};

exports.obtenerPorId = (id) => {
  const objectId = ObjectId.isValid(id) ? new ObjectId(id) : id;
  return coleccion().findOne({ _id: objectId });
};

exports.crear = async (datos) => {
  const { _id, ...datosSinId } = datos;
  const resultado = await coleccion().insertOne(datosSinId);
  return { _id: resultado.insertedId, ...datosSinId };
};

exports.actualizar = (id, datos) => {
  const { _id, ...datosSinId } = datos;
  const objectId = ObjectId.isValid(id) ? new ObjectId(id) : id;
  return coleccion().updateOne({ _id: objectId }, { $set: datosSinId });
};

exports.eliminar = (id) => {
  const objectId = ObjectId.isValid(id) ? new ObjectId(id) : id;
  return coleccion().deleteOne({ _id: objectId });
};

exports.contarDestacados = () => {
  return coleccion().countDocuments({ destacado: true });
};

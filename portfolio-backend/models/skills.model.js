const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const coleccion = () => getDB().collection("skills");

exports.obtenerTodos = async (filtro = {}, opciones = {}) => {
  const query = {};
  if (filtro.categoria) {
    query.categoria = filtro.categoria;
  }

  const cursor = coleccion().find(query).sort({ categoria: 1, orden: 1, _id: 1 });

  if (opciones.page || opciones.limit) {
    const page = Math.max(1, parseInt(opciones.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(opciones.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [datos, total] = await Promise.all([
      cursor.skip(skip).limit(limit).toArray(),
      coleccion().countDocuments(query),
    ]);

    return {
      datos,
      total,
      pagina: page,
      limite: limit,
      totalPaginas: Math.ceil(total / limit),
    };
  }

  return cursor.toArray();
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

const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const coleccion = () => getDB().collection("proyectos");

exports.obtenerTodos = (filtro = {}) => {
  const query = {};
  if (filtro.tech) {
    query.tecnologias = { $regex: filtro.tech, $options: "i" };
  }
  return coleccion()
    .find(query)
    .sort({ orden: 1, destacado: -1, _id: -1 })
    .toArray();
};

exports.obtenerPorId = (id) => {
  const objectId = ObjectId.isValid(id) ? new ObjectId(id) : id;
  return coleccion().findOne({ _id: objectId });
};

exports.crear = async (datos) => {
  const { _id, ...datosSinId } = datos;
  if (datosSinId.orden === undefined) {
    const total = await coleccion().countDocuments();
    datosSinId.orden = total;
  }
  const resultado = await coleccion().insertOne(datosSinId);
  return { _id: resultado.insertedId, ...datosSinId };
};

exports.actualizar = (id, datos) => {
  const { _id, ...datosSinId } = datos;
  const objectId = ObjectId.isValid(id) ? new ObjectId(id) : id;
  return coleccion().updateOne({ _id: objectId }, { $set: datosSinId });
};

exports.reordenar = async (items) => {
  const operaciones = items.map((item, index) => {
    const objectId = ObjectId.isValid(item._id) ? new ObjectId(item._id) : item._id;
    return {
      updateOne: {
        filter: { _id: objectId },
        update: { $set: { orden: item.orden !== undefined ? item.orden : index } },
      },
    };
  });
  if (operaciones.length === 0) return;
  return coleccion().bulkWrite(operaciones);
};

exports.eliminar = (id) => {
  const objectId = ObjectId.isValid(id) ? new ObjectId(id) : id;
  return coleccion().deleteOne({ _id: objectId });
};

exports.contarDestacados = () => {
  return coleccion().countDocuments({ destacado: true });
};

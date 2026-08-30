const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const coleccion = () => getDB().collection("usuarios");

exports.obtenerPorEmail = (email) => {
  return coleccion().findOne({ email: email.toLowerCase().trim() });
};

exports.obtenerPorId = (id) => {
  return coleccion().findOne({ _id: new ObjectId(id) });
};

exports.crear = async (datos) => {
  const usuario = {
    ...datos,
    email: datos.email.toLowerCase().trim(),
    creadoEn: new Date().toISOString(),
  };
  const resultado = await coleccion().insertOne(usuario);
  return { _id: resultado.insertedId, ...usuario };
};

exports.verificarCuenta = (id) => {
  return coleccion().updateOne(
    { _id: new ObjectId(id) },
    { $set: { cuentaVerificada: true } }
  );
};

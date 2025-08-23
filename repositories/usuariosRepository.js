import db from "../db/db.js"; 

export const findUserByEmail = async (email) => {
  return db("usuarios").where({ email }).first();
};

export const findUserById = async (id) => {
  return db("usuarios").where({ id }).first();
};

export const insertUser = async (user) => {
  const [row] = await db("usuarios")
    .insert({
      nome: user.nome,
      email: user.email,
      senha: user.senha
    })
    .returning("id");

  return findUserById(row.id); 
};

export const deleteUser = async (id) => {
  return db("usuarios").where({ id }).del();
};

export default {
  findUserByEmail,
  findUserById,
  insertUser,
  deleteUser
};

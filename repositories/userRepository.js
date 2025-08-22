import db from "../db/db.js"; 

export const findUserByEmail = async (email) => {
  return db("users").where({ email }).first();
};

export const findUserById = async (id) => {
  return db("users").where({ id }).first();
};

export const insertUser = async (user) => {
  const [row] = await db("users")
    .insert({
      nome: user.nome,
      email: user.email,
      senha: user.senha
    })
    .returning("id");

  return findUserById(row.id); 
};

export default {
  findUserByEmail,
  findUserById,
  insertUser,
};

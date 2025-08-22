import db from "../db/db.js"; 

export const findUserByEmail = async (email) => {
  return db("users").where({ email }).first();
};

export const findUserById = async (id) => {
  return db("users").where({ id }).first();
};

export const insertUser = async (user) => {
  const [id] = await db("users").insert(user).returning("id");
  return findUserById(id);
};

export default {
  findUserByEmail,
  findUserById,
  insertUser,
};

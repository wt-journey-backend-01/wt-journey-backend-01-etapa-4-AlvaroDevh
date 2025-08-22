/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex)  {
  await knex("agentes").del();

  await knex("agentes").insert([
    { nome: "João Silva", dataDeIncorporacao: "2020-01-10", cargo: "Investigador" },
    { nome: "Maria Souza", dataDeIncorporacao: "2018-06-15", cargo: "Delegada" }
  ]);
};

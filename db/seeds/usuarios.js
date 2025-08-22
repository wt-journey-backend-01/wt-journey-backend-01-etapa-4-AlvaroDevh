export async function seed(knex)  {
  await knex("usuarios").del();

  await knex("usuarios").insert([
    {
      nome: "Alice Souza",
      email: "alice@example.com",
      senha: "hashed_password_1",
    },
    {
      nome: "Bruno Lima",
      email: "bruno@example.com",
      senha: "hashed_password_2",
    },
    {
      nome: "Carla Mendes",
      email: "carla@example.com",
      senha: "hashed_password_3",
    },
  ]);
};

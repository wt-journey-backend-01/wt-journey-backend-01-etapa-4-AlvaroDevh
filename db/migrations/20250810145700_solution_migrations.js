/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("agentes", (table) => {
    table.increments("id").primary();
    table.string("nome").notNullable();
    table.date("dataDeIncorporacao").notNullable();
    table.string("cargo").notNullable();
  });

  await knex.schema.createTable("casos", (table) => {
    table.increments("id").primary();
    table.string("titulo").notNullable();
    table.text("descricao").notNullable();
    table.enu("status", ["aberto", "solucionado"]).notNullable();
    table.integer("agente_id")
         .unsigned()
         .references("id")
         .inTable("agentes")
         .onDelete("CASCADE");
  });

  await knex.schema.createTable("usuarios", (table) => {
    table.increments("id").primary();
    table.string("nome").notNullable();
    table.string("email").unique().notNullable();
    table.string("senha").notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("casos");
  await knex.schema.dropTableIfExists("agentes");
  await knex.schema.dropTableIfExists("usuarios");
}

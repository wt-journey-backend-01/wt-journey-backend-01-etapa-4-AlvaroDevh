import 'dotenv/config';
import knex from 'knex';
import knexConfig from '../knexfile.js';

const nodeEnv = process.env.NODE_ENV || 'development';
const config = knexConfig[nodeEnv];

const db = knex(config);

export default db
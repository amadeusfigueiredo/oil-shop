import '../config/env.js';
import { Sequelize } from 'sequelize';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const url = new URL(process.env.DATABASE_URL);
const database = decodeURIComponent(url.pathname.slice(1));
if (!database) throw new Error('DATABASE_URL must include a database name');
url.pathname = '/postgres';
const sequelize = new Sequelize(url.toString(), { logging: false });
try {
  const direction = process.argv[2];
  const identifier = sequelize.getQueryInterface().quoteIdentifier(database);
  if (direction === 'create')
    await sequelize.query(`CREATE DATABASE ${identifier}`);
  else if (direction === 'drop')
    await sequelize.query(`DROP DATABASE ${identifier}`);
  else throw new Error('Expected database operation: create or drop');
} finally {
  await sequelize.close();
}

import { createRequire } from 'node:module';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { SequelizeStorage, Umzug } from 'umzug';
import Sequelize from 'sequelize';
import db from '../models/index.js';

const require = createRequire(import.meta.url);
const directory = new URL('../migrations/', import.meta.url);
const files = (await readdir(directory))
  .filter((name) => name.endsWith('.cjs'))
  .sort();
const runner = new Umzug({
  migrations: files.map((name) => {
    const migration = require(fileURLToPath(new URL(name, directory)));
    return {
      name,
      up: () => migration.up(db.sequelize.getQueryInterface(), Sequelize),
      down: () => migration.down(db.sequelize.getQueryInterface(), Sequelize),
    };
  }),
  context: db.sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize: db.sequelize,
    tableName: 'SequelizeMeta',
  }),
  logger: console,
});

try {
  const direction = process.argv[2];
  if (direction === 'up') await runner.up();
  else if (direction === 'down') await runner.down();
  else throw new Error('Expected migration direction: up or down');
} finally {
  await db.sequelize.close();
}

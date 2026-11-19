const { runner } = require('node-pg-migrate');

const direction = process.argv[2];

if (!['up', 'down'].includes(direction)) {
  throw new Error(
    'Укажи направление миграции: up или down'
  );
}

const databaseUrl = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
};

try {
  async () => await runner({
    databaseUrl,
    dir: 'database/migrations',
    direction,

    count: direction === 'up' ? Infinity : 1,

    migrationsTable: 'pgmigrations',
    verbose: true
  });

  console.log(
    direction === 'up'
      ? 'Миграции успешно применены'
      : 'Последняя миграция успешно отменена'
  );
}
catch (error) {
  console.error('Ошибка выполнения миграции:');
  console.error(error.message);
  process.exitCode = 1;
}
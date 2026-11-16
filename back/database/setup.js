import pg from "pg"
import { password } from "@inquirer/prompts"

const { Client } = pg;

const {
    DB_HOST,
    DB_PORT,
    DB_ADMIN_USER,
    DB_NAME,
    DB_USER,
    DB_PASSWORD
} = process.env;

const databasePort = Number(DB_PORT);
if (!Number.isInteger(databasePort) || databasePort < 1 || databasePort > 65535) {
    throw new Error('DB_PORT должен быть целым числом от 1 до 65535');
}

const adminPassword = await password({
    message: `Введите пароль роли ${DB_ADMIN_USER}: `,
    mask: '*'
});

const adminClient = new Client({
    host: DB_HOST,
    port: databasePort,
    database: 'postgres',
    user: DB_ADMIN_USER,
    password: adminPassword,
});

async function createApplicationRole() {
    const roleResult = await adminClient.query(
        `SELECT 1 FROM pg_roles WHERE rolname = $1`, [DB_USER]
    );

    if (roleResult.rowCount > 0) {
        console.log(`Роль "${DB_USER}" уже существует`);
        return;
    }

    await adminClient.query(
        `CREATE ROLE "${DB_USER}" WITH LOGIN PASSWORD '${DB_PASSWORD}' NOSUPERUSER NOCREATEDB NOCREATEROLE`
    );
    console.log(`Роль \"${DB_USER}\" успешно создана`);
}

async function createApplicationDB() {
    const DBResult = await adminClient.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`, [DB_NAME]
    );

    if (DBResult.rows > 0) {
        console.log(`База данных \"${DB_NAME}\" уже существует`);
        return;
    }

    await adminClient.query(
        `CREATE DATABASE "${DB_NAME}" WITH OWNER = "${DB_USER}" ENCODING = 'UTF8'`
    );
    console.log(`База данных \"${DB_NAME}\" успешно создана`);
}

async function setupDatabase() {
    try {
        await adminClient.connect();

        await createApplicationRole();
        await createApplicationDB();
    }
    catch (error) {
        console.error("Ошибка настройки БД.");
        console.error(error.message);
    }
    finally {
        await adminClient.end();
    }
}

await setupDatabase();
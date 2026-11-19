const pg = require("pg")
const fs = require("fs").promises;
const path = require("path");

const { Client } = pg;

const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

async function seedDatabase() {
    let transactionProcces = false;     //для исключения ошибки при ROLLBACK
    try {
        const dataFilePath = path.join(__dirname, 'data.json');
        const text = await fs.readFile(dataFilePath, 'utf8');
        const users = JSON.parse(text);

        if (!Array.isArray(users)) {
            throw new Error('Корневым элементом data.json должен быть массив');
        }

        await client.connect();

        const existingUsers = await client.query(
            'SELECT COUNT(*)::integer AS count FROM users'
        );

        if (existingUsers.rows[0].count > 0) {
            throw new Error(
                'Таблица users уже содержит данные. Импорт отменён.'
            );
        }

        await client.query('BEGIN');
        transactionProcces = true;

        for (const user of users) {
            const userResult = await client.query(
                `
                    INSERT INTO users (
                        username,
                        password_hash
                    )
                    VALUES ($1, $2)
                    RETURNING id
                `,
                [user.username, user.passwordHash]
            );

            const userId = userResult.rows[0].id;

            for (const task of user.tasks ?? []) {
                const taskResult = await client.query(
                    `
                        INSERT INTO tasks (
                            user_id,
                            name,
                            description,
                            priority
                        )
                        VALUES ($1, $2, $3, $4)
                        RETURNING id
                    `,
                    [
                        userId,
                        task.name,
                        task.description ?? null,
                        task.priority ?? 4
                    ]
                );

                const taskId = taskResult.rows[0].id;

                for (const tagName of task.tags ?? []) {
                    const tagResult = await client.query(
                        `
                            INSERT INTO tags (name)
                            VALUES ($1)
                            ON CONFLICT (name)
                            DO UPDATE SET name = EXCLUDED.name
                            RETURNING id
                        `,
                        [tagName]
                    );

                    const tagId = tagResult.rows[0].id;

                    await client.query(
                        `
                            INSERT INTO task_tags (
                                task_id,
                                tag_id
                            )
                            VALUES ($1, $2)
                            ON CONFLICT DO NOTHING
                        `,
                        [taskId, tagId]
                    );
                }
            }
        }

        await client.query('COMMIT');
        transactionStarted = false;

        console.log('Стартовые данные успешно добавлены');
    }
    catch (error) {
        if (transactionProcces) {
            try {
                await client.query('ROLLBACK');
            } 
            catch (err) {
                console.error('Не удалось отменить транзакцию:', err.message);
            }
        }

        console.error('Ошибка заполнения БД:');
        console.error(error.message);

        process.exitCode = 1;
    } 
    finally {
        await client.end();
    }
}

seedDatabase();
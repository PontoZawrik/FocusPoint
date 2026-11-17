/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('users', {
        id: {
            type: 'bigserial',
            primaryKey: true
        },

        username: {
            type: 'varchar(50)',
            notNull: true,
            unique: true
        },

        password_hash: {
            type: 'text',
            notNull: true
        },

        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP')
        }
    });

    pgm.createTable('tasks', {
        id: {
            type: 'bigserial',
            primaryKey: true
        },

        user_id: {
            type: 'bigint',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE'
        },

        name: {
            type: 'varchar(255)',
            notNull: true
        },

        description: {
            type: 'text'
        },

        priority: {
            type: 'smallint',
            notNull: true,
            default: 4
        },

        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP')
        },

        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP')
        }
    });

    pgm.addConstraint('tasks', 'tasks_priority_check', {
        check: 'priority BETWEEN 1 AND 5'
    });

    pgm.createIndex('tasks', 'user_id');

    pgm.createTable('tags', {
        id: {
            type: 'bigserial',
            primaryKey: true
        },

        name: {
            type: 'varchar(50)',
            notNull: true,
            unique: true
        }
    });

    pgm.createTable('task_tags', {
        task_id: {
            type: 'bigint',
            notNull: true,
            references: '"tasks"',
            onDelete: 'CASCADE'
        },

        tag_id: {
            type: 'bigint',
            notNull: true,
            references: '"tags"',
            onDelete: 'CASCADE'
        }
    });

    pgm.addConstraint('task_tags', 'task_tags_primary_key', {
        primaryKey: ['task_id', 'tag_id']
    });

    pgm.createIndex('task_tags', 'tag_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('task_tags');
    pgm.dropTable('tags');
    pgm.dropTable('tasks');
    pgm.dropTable('users');
};

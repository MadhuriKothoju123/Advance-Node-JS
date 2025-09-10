require('dotenv').config();
import { exec } from 'child_process';

const migrations: string[] = [
    "src/migrations/001_create_tables.sql",
    "src/migrations/002_add_triggers.sql"
];

export const runMigrations = async () => {
    for (const migration of migrations) {
        const command = `psql -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -f ${migration}`;
        console.log(`Running migration: ${migration}`);

        exec(command, (error: Error | null, stdout: string, stderr: string) => {
            if (error) {
                console.error(` Migration failed: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(` Migration warnings: ${stderr}`);
            }
            console.log(` Migration successful: ${stdout}`);
        });
    }
};



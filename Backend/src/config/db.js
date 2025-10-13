import pg, { Result } from 'pg';

export const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});


pool.query('SELECT NOW()').then(Result => {
    console.log(Result)
})
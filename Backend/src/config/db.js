import pg, { Result } from 'pg';

export const pool = new pg.Pool({
    user: "Monitor",
    host: "localhost",
    password: "Doremifa",
    database: "SyspymeDB",
    port: 5432

})

pool.query('SELECT NOW()').then(Result => {
    console.log(Result)
})
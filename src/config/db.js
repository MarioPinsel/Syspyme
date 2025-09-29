import pg, { Result } from 'pg';

export const pool = new pg.Pool({
    user: `${POSTGRES_USER}`,
    host: "localhost",
    password: `${POSTGRES_PASSWORD}`,
    database: `${POSTGRES_NAME}`,
    port: "5432"

})

pool.query('SELECT NOW()').then(Result =>{
    console.log(Result)
})
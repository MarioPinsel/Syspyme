import { SecretClient } from "@azure/keyvault-secrets";

let client = null;
const url = `https://${process.env.AZURE_KEYVAULT}.vault.azure.net`;

export async function createConection(credential) {
    client = new SecretClient(url, credential);
}

export async function createSecret(DBname) {
    const value = {
        host: process.env.DB_HOST,
        name: DBname,
        creationDate: new Date().toISOString()
    };

    try {
        client.setSecret(`DB-${dbName}-conn`, JSON.stringify(value));
    } catch (err) {
        console.log(`Error al crear el secreto de '${dbName}': `, err.mensage);
    }
}

export async function getSecret(company) {
    const DBconnection = await client.getSecret(`DB-${company}-conn`);
    
    const pool = new pg.Pool({
        user: process.env.DB_USER,
        host: DBconnection.host,
        password: process.env.DB_PASSWORD,
        database: DBconnection.DBname,
        port: process.env.DB_PORT,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const schema = await fs.readFile('./models/schema-companies.sql', 'utf8');
        await pool.query(schema);
        console.log('Esquema aplicado correctamente');
    } catch (err) {
        console.error('Error al aplicar esquema:', err.message);
    }
    return pool;
}


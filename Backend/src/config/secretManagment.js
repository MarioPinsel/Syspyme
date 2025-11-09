import { SecretClient } from "@azure/keyvault-secrets";
import fs from 'fs/promises';
import pg, { Result } from 'pg';

let client = null;
const url = `https://${process.env.AZURE_KEYVAULT}.vault.azure.net`;
const pools = [];

export async function createConection(credential) {
    try {
        client = new SecretClient(url, credential);
    } catch (err) {
        console.log('Error 403: Credenciales invalidas al crear el cliente', err.message)
    }
}

export async function createSecret(company) {
    const secretName = normalizeName(company);
    const value = {
        host: process.env.DB_HOST,
        name: secretName,
        creationDate: new Date().toISOString()
    };
    try {
        await client.setSecret(`db-${secretName}-conn`, JSON.stringify(value));
    } catch (err) {
        console.log(`Error al crear el secreto de '${company}':`, err.message);
    }
}

export async function getPool(company) {
    if (pools[company]) {
        return pools[company];
    }
    return await createPool(company);
}

export const createPool = async (company) => {
    const secret = normalizeName(company);
    const lastSecret = await client.getSecret(`db-${secret}-conn`);    
    let secretInfo;
    try {
        secretInfo = JSON.parse(lastSecret.value);
    } catch (err) {
        throw new Error('Error al obtener el valor del secreto', err.message)
    }
    const pool = new pg.Pool({
        user: process.env.DB_USER,
        host: secretInfo.host,
        password: process.env.DB_PASSWORD,
        database: secretInfo.name,
        port: process.env.DB_PORT,
        ssl: { rejectUnauthorized: false }
    });
    pools[company] = pool;
    return pool;
}

export async function supplyDataBase(pool) {
    try {
        const schema = await fs.readFile('./models/schema-companies.sql', 'utf8');
        await pool.query(schema);
        console.log('Esquema aplicado correctamente');
    } catch (err) {
        console.error('Error al aplicar esquema:', err.message);
    }
}
function normalizeName(originalName) {
    return originalName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 63);
}
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
        client.setSecret(`DB-${DBname}-conn`,JSON.stringify(value));
    } catch (err) {
        console.log(`Error al crear el secreto de '${DBname}': `, err.mensage);
    }
}


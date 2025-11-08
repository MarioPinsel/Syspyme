import { DefaultAzureCredential } from "@azure/identity";
import { PostgreSQLManagementFlexibleServerClient } from "@azure/arm-postgresql-flexible";
import { createConection, createSecret, getPool, supplyDataBase } from "./secretManagment.js";

const credential = new DefaultAzureCredential();
const client = new PostgreSQLManagementFlexibleServerClient(credential, process.env.SUSCRIPTION_ID);

export async function createDataBase(company) {
    await createDB(company);
    await createConection(credential);
    await createSecret(company);

    const pool = await getPool(company);
    await supplyDataBase(pool);
};

async function createDB(company) {
    const dbName = normalizeName(company);
    const params = {
        location: "centralus",
        charset: "UTF8",
        collation: "en_US.utf8",
        tags: {
            nombre: dbName,
            entorno: "desarrollo"
        }
    };
    try {
        await client.databases.beginCreateAndWait(process.env.AZURE_GROUP_RESOURCES, process.env.AZURESERVER, dbName, params);
    } catch (err) {
        console.log('Error al crear la Base de Datos:', err.message);
    }
}

function normalizeName(originalName) {
    return originalName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 63);
}
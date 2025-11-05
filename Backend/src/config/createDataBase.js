import { DefaultAzureCredential } from "@azure/identity";
import { PostgreSQLManagementFlexibleServerClient } from "@azure/arm-postgresql-flexible";
import {createConection, createSecret} from "./secretManagment.js";

const credential = new DefaultAzureCredential();
const client = new PostgreSQLManagementFlexibleServerClient(credential, process.env.SUSCRIPTION_ID);

export const createDataBase = async (DBname) => {
    await createDB(DBname);
    await createConection(credential);
    await createSecret(DBname);
};

async function createDB(DBname) {
    let params = {
        location: "centralus",
        charset: "UTF8",
        collation: "en_US.utf8",
        tags: {
            nombre: DBname,
            entorno: "desarrollo"
        }
    };
    try {
         await client.databases.beginCreateAndWait(process.env.AZURE_GROUP_RESOURCES, process.env.AZURE_SERVER, DBname, params);         
    } catch (err) {
        console.log('Error al crear la Base de Datos:', err.message);
    }
}



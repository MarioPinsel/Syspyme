import { DefaultAzureCredential } from "@azure/identity";
import { PostgreSQLManagementFlexibleServerClient } from "@azure/arm-postgresql-flexible";

const credential = new DefaultAzureCredential();
const client = new PostgreSQLManagementFlexibleServerClient(credential, process.env.SUSCRIPTION_ID);

export const createDataBase = async (DBname) => {
    createDB(DBname);

    /*try {
        const schema = await fs.readFile('./models/schema-companies.sql', 'utf8');
        await pool.query(schema);
        console.log('Esquema aplicado correctamente');
    } catch (err) {
        console.error('Error al aplicar esquema:', err.message);
    } REQUIERE TENER EL SECRETO PARA LA CONEXION DINAMICA*/
};

async function createDB(DBname) {
    const params = {
        location: "centralus",
        charset: "UTF8",
        collation: "en_US.utf8",
        tags: {
            nombre: DBname,
            entorno: "desarrollo"
        }
    };
    try {
        return await client.databases.beginCreateAndWait(process.env.AZURE_GROUP_RESOURCES, process.env.AZURE_SERVER, DBname, params);
    } catch (err) {
        console.log('Error al crear la Base de Datos:', err.message);
    }
}



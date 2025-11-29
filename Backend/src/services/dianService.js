import { generateToken } from '../utils/tokenUtils.js';
import { findTempEmpresaByVerificacion, findTempEmpresaByCorreo, createEmpresa, deleteTempEmpresa } from '../repositories/enterprise/companyRepository.js'
import { createUsuario } from '../repositories/user/userRepository.js';
import { createDataBase } from '../config/createDataBase.js';
import { getPool } from '../config/secretManagment.js';
import { sendResponseDIANAccepted, sendResponseDIANRejected } from '../utils/sendResponseDIAN.js';
import { findUserDIANByUsuario } from '../repositories/userDIAN/userDIANRepository.js'
import { hashPassword } from '../utils/hashUtils.js';

export const loginDIANService = async ({ usuario, password }) => {

    const exists = await findUserDIANByUsuario(usuario);

    if (exists.rowCount === 0) {
        return {
            status: 400,
            message: `El usuario no existe.`,
        };
    }
    const user = exists.rows[0];

    if (user.password !== password) {
        return {
            status: 400,
            message: `Contraseña incorrecta.`,
        };
    }

    const token = generateToken({ isDIAN: true }, '2h');

    return {
        status: 200,
        message: 'Inicio de sesión exitoso.',
        token
    }

};

export const getCompaniesDIANServices = async () => {
    const result = await findTempEmpresaByVerificacion();

    if (result.rowCount === 0) {
        return {
            status: 400,
            message: "No hay ninguna empresa pendiente por revisión.",
            data: []
        };
    }

    return {
        status: 200,
        message: "Empresas pendientes encontradas.",
        data: result.rows
    };
};

export const registerCompanyServices = async ({ correo, action, motivo }) => {
    const tempEmpresaResult = await findTempEmpresaByCorreo(correo);
    const te = tempEmpresaResult.rows[0];
    if (action === 'aceptar') {
        await createDataBase(te.nombre);
        await createEmpresa(te.nombre, te.nit, te.correo, te.password, te.telefono, te.direccion, te.regimen)
        const pool = await getPool(te.nombre);
        const hashed = await hashPassword(process.env.ADMIN_PASS);
        await createUsuario(pool, te.nombre_admin, te.correo_admin, 'admin', te.telefono_admin, hashed);
        await sendResponseDIANAccepted(te.correo_admin, te.nombre, 'admin', process.env.ADMIN_PASS);
        await deleteTempEmpresa(correo);
        return {
            status: 200,
            message: "Empresa registrada exitosamente.",
        };
    } else if (action === 'rechazar') {
        await sendResponseDIANRejected(te.correo_admin, motivo);
        await deleteTempEmpresa(correo);
        return {
            status: 200,
            message: "Empresa rechazada exitosamente.",
        };
    }
};


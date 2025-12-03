import { generateToken } from '../utils/tokenUtils.js';
import { findTempEmpresaByVerificacion, findTempEmpresaByCorreo, createEmpresa, deleteTempEmpresa, findEmpresasPendientes, findEmpresaByNombre, updateCertificadoEmpresa } from '../repositories/enterprise/companyRepository.js'
import { createUsuario, findUsuarioByHandle } from '../repositories/user/userRepository.js';
import { createDataBase } from '../config/createDataBase.js';
import { getPool } from '../config/secretManagment.js';
import { sendResponseDIANAccepted, sendResponseDIANRejected, sendCertificateAcceptedEmail, sendCertificateRejectedEmail } from '../utils/sendResponseDIAN.js';
import { findUserDIANByUsuario } from '../repositories/userDIAN/userDIANRepository.js'
import { hashPassword } from '../utils/hashUtils.js';
import { getFirmaDigital } from '../utils/firmaDigital.js'
import { generateSelfieLetterHTML } from '../utils/generateSelfieLetterHTML.js';

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

    const token = generateToken({ isDIAN: true, created: false }, '2h');

    return {
        status: 200,
        message: 'Inicio de sesión exitoso.',
        token
    }

};

export const getCompaniesDIANService = async () => {
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

export const registerCompanyService = async ({ correo, action, motivo }) => {
    const tempEmpresaResult = await findTempEmpresaByCorreo(correo);
    const te = tempEmpresaResult.rows[0];
    if (action === 'aceptar') {
        await createDataBase(te.nombre);
        await createEmpresa(te.nombre, te.nit, te.correo, te.password, te.telefono, te.direccion, te.regimen)
        const pool = await getPool(te.nombre);
        const hashed = await hashPassword(process.env.ADMIN_PASS);
        console.log({
            nombre: te.nombre_admin,
            correo: te.correo_admin,
            handle: 'admin',
            telefono: te.telefono_admin,
            password: hashed
        });

        await createUsuario(pool, {
            nombre: te.nombre_admin,
            correo: te.correo_admin,
            handle: 'admin',
            telefono: te.telefono_admin,
            password: hashed
        });

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

export const getCompaniesPendingService = async () => {
    const companies = await findEmpresasPendientes();

    return {
        companies: companies.rows
    };
};

export const getCertificateByCompanyService = async (companyName) => {
    const pool = await getPool(companyName);

    const empresaResult = await findEmpresaByNombre(companyName);
    const empresa = empresaResult.rows[0];

    const adminResult = await findUsuarioByHandle(pool, 'admin');
    const admin = adminResult.rows[0];


    const { html } = generateSelfieLetterHTML({
        empresa: {
            nombre: empresa.nombre,
            nit: empresa.nit,
            direccion: empresa.direccion
        },
        admin: {
            nombre: admin.nombre,
            telefono: admin.telefono,
            correo: admin.correo
        }
    });

    return {
        html
    };
};

export const validateCertificateService = async ({ companyName, action, motivo }) => {
    const pool = await getPool(companyName);
    const adminResult = await findUsuarioByHandle(pool, 'admin');
    const admin = adminResult.rows[0];
    if (action === 'aceptar') {
        const firma_digital = getFirmaDigital();
        await updateCertificadoEmpresa(companyName, firma_digital, new Date());
        await sendCertificateAcceptedEmail(admin.correo, companyName);

        return {
            message: `El certificado de "${companyName}" ha sido aprobado exitosamente. Se ha enviado una notificación por correo electrónico al representante.`
        };
    } else {

        await updateCertificadoEmpresa(companyName, null, null);
        await sendCertificateRejectedEmail(admin.correo, companyName, motivo);

        return {
            message: `El certificado de "${companyName}" ha sido rechazado. Se ha enviado una notificación con el motivo al representante.`
        };
    }


}
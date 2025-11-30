import { generateToken } from '../utils/tokenUtils.js';
import { sendVerificationEmail } from '../utils/mailUtils.js';
import { sendMessageDIAN, sendMessageDIANCertificate } from '../utils/sendMessageDIAN.js';
import { hashPassword, checkPassword } from '../utils/hashUtils.js';
import {
    createTempUsuario, findTempUsuarioByCorreo, deleteTempUsuario,
    createUsuario, findUsuarioByCorreo, updateUsuarioCodigo,
    findUsuarioByCorreoOHandle, updateTempUsuarioCodigo, findUsuarioByNombre, findTempUsuarioByNombre, findUsuarioByHandle, findTempUsuarioByHandle
} from '../repositories/user/userRepository.js';
import {
    createTempEmpresa, findTempEmpresaByCorreo, findEmpresaByCorreo, findEmpresaByNombre, updateTempEmpresaCodigo, findTempEmpresaByNombre, updateVerifiedTempEmpresa, updateCertificadoEmpresa
} from '../repositories/enterprise/companyRepository.js';
import { getPool } from '../config/secretManagment.js'
import { generateSelfieLetterHTML } from "../utils/generateSelfieLetterHTML.js";

const generateCode = () => Math.floor(100000 + Math.random() * 900000);
const CODE_EXPIRATION_MINUTES = 15;

const resendVerification = async (correo, tipo, updateFn, pool) => {
    const newCode = generateCode();
    const now = new Date();

    await updateFn(pool, correo, newCode, now);
    await sendVerificationEmail(correo, newCode);

    const token = generateToken({ correo, tipo }, '15m');
    return { message: 'Código expirado. Se ha enviado uno nuevo al correo.', token };
};

const isExpired = (created_at) => {
    const minutesPassed = (new Date() - new Date(created_at)) / (1000 * 60);
    return minutesPassed > CODE_EXPIRATION_MINUTES;
};

export const registerEmpresa = async ({ nombre, nit, correo, password, telefono, direccion, regimen, nombre_admin, correo_admin, telefono_admin }) => {

    if ((await findEmpresaByCorreo(correo)).rowCount) throw new Error('EMPRESA_ALREADY_EXISTS');
    if ((await findEmpresaByNombre(nombre)).rowCount) throw new Error('EMPRESA_ALREADY_EXISTS');
    if ((await findTempEmpresaByCorreo(correo)).rowCount) throw new Error('PENDING_VERIFICATION');
    if ((await findTempEmpresaByNombre(nombre)).rowCount) throw new Error('PENDING_VERIFICATION');

    const hashed = await hashPassword(password);
    const code = generateCode();

    await createTempEmpresa({ nombre, nit, correo, password: hashed, telefono, direccion, regimen, nombre_admin, correo_admin, telefono_admin, code, created_at: new Date() });
    await sendVerificationEmail(correo_admin, code);

    const token = generateToken({ correo, tipo: 'empresa', empresaNombre: nombre, created: false }, '15m');
    return { message: 'Código de verificación enviado al correo.', token };
};

export const registerUsuario = async ({ pool, userId, empresaNombre, nombre, correo, handle, password, telefono }) => {

    if ((await findUsuarioByCorreo(pool, correo)).rowCount)
        throw new Error('USUARIO_ALREADY_EXISTS');

    if ((await findUsuarioByNombre(pool, nombre)).rowCount)
        throw new Error('USUARIO_ALREADY_EXISTS');

    if ((await findUsuarioByHandle(pool, handle)).rowCount)
        throw new Error('USUARIO_ALREADY_EXISTS');

    if (userId === 1) {

        const hashed = await hashPassword(password);

        const result = await createUsuario(pool, {
            nombre,
            correo,
            handle,
            telefono,
            password: hashed
        });

        return {
            message: 'Usuario creado correctamente por el administrador.',
            user: result.rows[0]
        };
    }

    if ((await findTempUsuarioByCorreo(pool, correo)).rowCount)
        throw new Error('PENDING_VERIFICATION');
    if ((await findTempUsuarioByNombre(pool, nombre)).rowCount)
        throw new Error('PENDING_VERIFICATION');
    if ((await findTempUsuarioByHandle(pool, handle)).rowCount)
        throw new Error('PENDING_VERIFICATION');

    const hashed = await hashPassword(password);
    const code = generateCode();

    await createTempUsuario(pool, {
        nombre,
        correo,
        handle,
        password: hashed,
        code,
        created_at: new Date()
    });

    await sendVerificationEmail(correo, code);

    const token = generateToken({ correo, tipo: 'usuario', empresaNombre, created: true }, '15m');

    return {
        message: 'Código de verificación enviado al correo.',
        token
    };
};


export const verifyAccount = async ({ pool, empresaNombre, correo, tipo, codigo }) => {
    const isEmpresa = tipo === 'empresa';

    const tempResult = isEmpresa
        ? await findTempEmpresaByCorreo(correo)
        : await findTempUsuarioByCorreo(pool, correo);

    if (tempResult.rowCount === 0) throw new Error('NO_TEMP_REGISTRATION_FOUND');
    const temp = tempResult.rows[0];

    if (isExpired(temp.created_at))
        return isEmpresa
            ? resendVerification(correo, tipo, updateTempEmpresaCodigo)
            : resendVerification(correo, tipo, updateTempUsuarioCodigo, pool);

    if (temp.codigo_verificacion !== parseInt(codigo)) throw new Error('INVALID_CODE');

    if (isEmpresa) {
        await updateVerifiedTempEmpresa(correo);
        await sendMessageDIAN(empresaNombre, process.env.EMAIL_USER);
        return {
            message: 'La información de la empresa ha sido enviada a la DAIN para su verificación. Por favor, revise periódicamente el correo electrónico del representante, donde recibirá la notificación del resultado del proceso. El tiempo estimado de respuesta es de 24 a 72 horas. Una vez reciba el correo, siga las instrucciones proporcionadas para completar su registro.'
        };

    } else {
        const result = await createUsuario(pool, {
            nombre: temp.nombre,
            correo,
            handle: temp.handle,
            password: temp.password
        });

        await deleteTempUsuario(pool, correo);

        const userId = result.rows[0].id;
        const isAdmin = userId === 1;

        const finalToken = generateToken({ correo, userId, isAdmin, created: true, empresaNombre }, '1d');
        return { message: 'Registro exitoso', token: finalToken };
    }
};

export const loginUsuario = async ({ empresa, empresaPassword, usuario, password }) => {
    const empresaResult = await findEmpresaByNombre(empresa);
    if (!empresaResult.rowCount) throw new Error('COMPANY_NOT_FOUND');
    const empresaData = empresaResult.rows[0];

    const pool = await getPool(empresa);

    const empresaValid = await checkPassword(empresaPassword, empresaData.password);
    if (!empresaValid) throw new Error('INVALID_COMPANY_CREDENTIALS');

    const userResult = await findUsuarioByCorreoOHandle(pool, usuario);
    if (!userResult.rowCount) throw new Error('USER_NOT_FOUND');
    const usuarioData = userResult.rows[0];

    const validUser = await checkPassword(password, usuarioData.password);
    if (!validUser) throw new Error('INVALID_USER_CREDENTIALS');

    const code = generateCode();
    await updateUsuarioCodigo(pool, usuarioData.correo, code, new Date());
    await sendVerificationEmail(usuarioData.correo, code);

    const token = generateToken({ correo: usuarioData.correo, empresaNombre: empresa, created: true }, '15m');
    return { message: 'Código de inicio de sesión enviado al correo.', token };
};

export const verifyLoginUsuario = async ({ pool, empresaNombre, correo, codigo }) => {
    const userResult = await findUsuarioByCorreo(pool, correo);
    if (!userResult.rowCount) throw new Error('USER_NOT_FOUND');

    const usuarioData = userResult.rows[0];

    if (isExpired(usuarioData.codigo_fecha))
        return resendVerification(correo, 'usuario', updateUsuarioCodigo, pool);

    if (usuarioData.codigo_verificacion !== parseInt(codigo))
        throw new Error('INVALID_CODE');

    const isAdmin = usuarioData.id === 1;

    const empresaResult = await findEmpresaByNombre(empresaNombre);
    const certificado = empresaResult.rows[0]?.certificado;

    if (certificado === 'PENDIENTE') {
        return {
            certificatePending: true
        };
    }

    if (!certificado && isAdmin) {
        const finalToken = generateToken({ correo, userId: usuarioData.id, isAdmin, created: true, empresaNombre }, '1d');
        return {
            requiresCertificate: true,
            isAdmin,
            token: finalToken
        };
    }

    if (!certificado && !isAdmin) {
        return {
            noCertificate: true,
            isAdmin: false
        };
    }

    const finalToken = generateToken({ correo, userId: usuarioData.id, isAdmin, created: true, empresaNombre }, '1d');
    return { message: 'Login exitoso', token: finalToken };
};


export const getCertificateService = async ({ pool, empresaNombre, correo }) => {
    const empresaResult = await findEmpresaByNombre(empresaNombre);
    const empresa = empresaResult.rows[0];

    const adminResult = await findUsuarioByCorreo(pool, correo);
    const admin = adminResult.rows[0];

    const empresaData = {
        nombre: empresa.nombre,
        nit: empresa.nit,
        direccion: empresa.direccion
    };

    const adminData = {
        nombre: admin.nombre,
        telefono: admin.telefono,
        correo: admin.correo
    };

    const { html } = generateSelfieLetterHTML({
        empresa: empresaData,
        admin: adminData
    });

    return {
        status: 200,
        html
    };
};

export const sendCertificateService = async (empresaNombre) => {

    await updateCertificadoEmpresa(empresaNombre, 'PENDIENTE');

    await sendMessageDIANCertificate(empresaNombre, process.env.EMAIL_USER);

    return {
        status: 200,
        message: 'Su certificado digital ha sido enviado exitosamente y se encuentra en revisión por parte de la DAIN. Recibirá una notificación por correo electrónico una vez sea aprobado o si requiere correcciones. Este proceso puede tardar entre 24 a 48 horas hábiles.'
    };

}
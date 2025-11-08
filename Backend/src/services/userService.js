import { generateToken, verifyToken } from '../utils/tokenUtils.js';
import { sendVerificationEmail } from '../utils/mailUtils.js';
import { hashPassword, checkPassword } from '../utils/hashUtils.js';
import {
    createTempUsuario, findTempUsuarioByCorreo, deleteTempUsuario,
    createUsuario, findUsuarioByCorreo, updateUsuarioCodigo,
    findUsuarioByCorreoOHandle, updateTempUsuarioCodigo,createPool
} from '../repositories/usuario/userRepository.js';
import {
    createTempEmpresa, findTempEmpresaByCorreo, deleteTempEmpresa,
    createEmpresa, findEmpresaByCorreo, findEmpresaByNombre, updateTempEmpresaCodigo
} from '../repositories/empresa/companyRepository.js';
import {createDataBase} from '../config/createDataBase.js';

const generateCode = () => Math.floor(100000 + Math.random() * 900000);
const CODE_EXPIRATION_MINUTES = 15;

const resendVerification = async (correo, tipo, updateFn) => {
    const newCode = generateCode();
    const now = new Date();
    await updateFn(correo, newCode, now);
    await sendVerificationEmail(correo, newCode);
    const token = generateToken({ correo, tipo }, '15m');
    return { message: 'Código expirado. Se ha enviado uno nuevo al correo.', token };
};

const isExpired = (created_at) => {
    const minutesPassed = (new Date() - new Date(created_at)) / (1000 * 60);
    return minutesPassed > CODE_EXPIRATION_MINUTES;
};

export const registerEmpresa = async ({ nombre, nit, correo, password }) => {
    if ((await findEmpresaByCorreo(correo)).rowCount) throw new Error('EMPRESA_ALREADY_EXISTS');
    if ((await findTempEmpresaByCorreo(correo)).rowCount) throw new Error('PENDING_VERIFICATION');
   
    const hashed = await hashPassword(password);
    const code = generateCode();

    await createTempEmpresa({ nombre, nit, correo, password: hashed, code, created_at: new Date() });
    await sendVerificationEmail(correo, code);

    const token = generateToken({ correo, tipo: 'empresa' }, '15m');
    return { message: 'Código de verificación enviado al correo.', token };
};

export const registerUsuario = async ({ nombre, correo, handle, password, empresaId }) => {
    await createPool('On3 for ALL'); //CONEXION PARA EL POOL
    if ((await findUsuarioByCorreo(correo)).rowCount) throw new Error('USUARIO_ALREADY_EXISTS');
    if ((await findTempUsuarioByCorreo(correo)).rowCount) throw new Error('PENDING_VERIFICATION');
        
    const hashed = await hashPassword(password);
    const code = generateCode();

    await createTempUsuario({ nombre, correo, handle, password: hashed, empresaId, code, created_at: new Date() });
    await sendVerificationEmail(correo, code);

    const token = generateToken({ correo, tipo: 'usuario' }, '15m');
    return { message: 'Código de verificación enviado al correo.', token };
};

export const verifyAccount = async ({ correo, tipo, codigo }) => {
    const isEmpresa = tipo === 'empresa';
    const tempResult = isEmpresa
        ? await findTempEmpresaByCorreo(correo)
        : await findTempUsuarioByCorreo(correo);

    if (tempResult.rowCount === 0) throw new Error('NO_TEMP_REGISTRATION_FOUND');
    const temp = tempResult.rows[0];

    if (isExpired(temp.created_at))
        return isEmpresa
            ? resendVerification(correo, tipo, updateTempEmpresaCodigo)
            : resendVerification(correo, tipo, updateTempUsuarioCodigo);

    if (temp.codigo_verificacion !== parseInt(codigo)) throw new Error('INVALID_CODE');

    if (isEmpresa) {
        const result = await createEmpresa({ nombre: temp.nombre, nit: temp.nit, correo, password: temp.password });
        await deleteTempEmpresa(correo);        
        const empresaId = result.rows[0].id;
        const finalToken = generateToken({ correo, tipo, id: empresaId, isAdmin: true, verified: true }, '1h');
        await createDataBase(temp.nombre);//Creacion empresa
        return { message: 'Registro exitoso', token: finalToken };        
    } else {
        const result = await createUsuario({
            nombre: temp.nombre,
            correo,
            handle: temp.handle,
            password: temp.password,
            empresaId: temp.empresa_id
        });
        await deleteTempUsuario(correo);
        const userId = result.rows[0].id;
        const isAdmin = userId === 1;
        const finalToken = generateToken({ correo, tipo, id: userId, isAdmin, verified: true }, '1h');
        return { message: 'Registro exitoso', token: finalToken };
    }
};

export const loginUsuario = async ({ empresa, empresaPassword, usuario, password }) => {
    const empresaResult = await findEmpresaByNombre(empresa);
    if (!empresaResult.rowCount) throw new Error('COMPANY_NOT_FOUND');
    const empresaData = empresaResult.rows[0];

    const empresaValid = await checkPassword(empresaPassword, empresaData.password);
    if (!empresaValid) throw new Error('INVALID_COMPANY_CREDENTIALS');

    const userResult = await findUsuarioByCorreoOHandle(usuario);
    if (!userResult.rowCount) throw new Error('USER_NOT_FOUND');
    const usuarioData = userResult.rows[0];

    const validUser = await checkPassword(password, usuarioData.password);
    if (!validUser) throw new Error('INVALID_USER_CREDENTIALS');

    const code = generateCode();
    await updateUsuarioCodigo(usuarioData.correo, code, new Date());
    await sendVerificationEmail(usuarioData.correo, code);

    const token = generateToken({ correo: usuarioData.correo }, '15m');
    return { message: 'Código de inicio de sesión enviado al correo.', token };
};

export const verifyLoginUsuario = async ({ correo, codigo }) => {
    const userResult = await findUsuarioByCorreo(correo);
    if (!userResult.rowCount) throw new Error('USER_NOT_FOUND');

    const usuarioData = userResult.rows[0];

    if (isExpired(usuarioData.codigo_fecha))
        return resendVerification(correo, 'usuario', updateUsuarioCodigo);

    if (usuarioData.codigo_verificacion !== parseInt(codigo))
        throw new Error('INVALID_CODE');

    const isAdmin = usuarioData.id === 1;
    const finalToken = generateToken({ correo, id: usuarioData.id, isAdmin }, '1h');
    return { message: 'Login exitoso', token: finalToken };
};

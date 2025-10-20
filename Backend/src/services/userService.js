import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../utils/tokenUtils.js';
import { sendVerificationEmail } from '../utils/mailUtils.js';
import {
    createTempUsuario, findTempUsuarioByCorreo, deleteTempUsuario,
    createUsuario, findUsuarioByCorreo, updateUsuarioCodigo, findUsuarioByCorreoOHandle
} from '../repositories/usuario/userRepository.js';
import {
    createTempEmpresa, findTempEmpresaByCorreo, deleteTempEmpresa,
    createEmpresa, findEmpresaByCorreo, findEmpresaByNombre
} from '../repositories/empresa/companyRepository.js';

const generateCode = () => Math.floor(100000 + Math.random() * 900000);
const CODE_EXPIRATION_MINUTES = 10;

export const registerEmpresa = async ({ nombre, nit, correo, password }) => {
    if ((await findEmpresaByCorreo(correo)).rowCount) throw new Error('EMPRESA_ALREADY_EXISTS');
    if ((await findTempEmpresaByCorreo(correo)).rowCount) throw new Error('PENDING_VERIFICATION');

    const hashed = await bcrypt.hash(password, 10);
    const code = generateCode();

    await createTempEmpresa({ nombre, nit, correo, password: hashed, code, created_at: new Date() });
    await sendVerificationEmail(correo, code);

    const token = generateToken({ correo, tipo: 'empresa' }, '15m');
    return { message: 'Código de verificación enviado al correo.', token };
};


export const registerUsuario = async ({ nombre, correo, handle, password, empresaId }) => {
    if ((await findUsuarioByCorreo(correo)).rowCount) throw new Error('USUARIO_ALREADY_EXISTS');
    if ((await findTempUsuarioByCorreo(correo)).rowCount) throw new Error('PENDING_VERIFICATION');

    const hashed = await bcrypt.hash(password, 10);
    const code = generateCode();

    await createTempUsuario({ nombre, correo, handle, password: hashed, empresaId, code, created_at: new Date() });
    await sendVerificationEmail(correo, code);

    const token = generateToken({ correo, tipo: 'usuario' }, '15m');
    return { message: 'Código de verificación enviado al correo.', token };
};


export const verifyAccount = async ({ token, codigo }) => {
    const payload = verifyToken(token);
    if (!payload?.correo || !payload?.tipo) throw new Error('INVALID_TOKEN_PAYLOAD');

    const { correo, tipo } = payload;
    const now = new Date();

    if (tipo === 'empresa') {
        const tempResult = await findTempEmpresaByCorreo(correo);
        if (tempResult.rowCount === 0) throw new Error('NO_TEMP_REGISTRATION_FOUND');

        const temp = tempResult.rows[0];

        const minutesPassed = (now - new Date(temp.created_at)) / (1000 * 60);
        if (minutesPassed > CODE_EXPIRATION_MINUTES) throw new Error('CODE_EXPIRED');

        if (temp.codigo_verificacion !== parseInt(codigo)) throw new Error('INVALID_CODE');

        const result = await createEmpresa({ nombre: temp.nombre, nit: temp.nit, correo, password: temp.password });
        await deleteTempEmpresa(correo);

        const empresaId = result.rows[0].id;
        return generateToken({ correo, tipo: 'empresa', id: empresaId, isAdmin: true, verified: true }, '1h');
    }

    if (tipo === 'usuario') {
        const tempResult = await findTempUsuarioByCorreo(correo);
        if (tempResult.rowCount === 0) throw new Error('NO_TEMP_REGISTRATION_FOUND');

        const temp = tempResult.rows[0];

        const minutesPassed = (now - new Date(temp.created_at)) / (1000 * 60);
        if (minutesPassed > CODE_EXPIRATION_MINUTES) throw new Error('CODE_EXPIRED');

        if (temp.codigo_verificacion !== parseInt(codigo)) throw new Error('INVALID_CODE');

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

        return generateToken({ correo, tipo: 'usuario', id: userId, isAdmin, verified: true }, '1h');
    }
};

export const loginUsuario = async ({ empresa, empresaPassword, usuario, password }) => {
    const empresaResult = await findEmpresaByNombre(empresa);
    if (!empresaResult || empresaResult.rowCount === 0) throw new Error('COMPANY_NOT_FOUND');
    const empresaData = empresaResult.rows[0];
    const empresaValid = await bcrypt.compare(empresaPassword, empresaData.password);
    if (!empresaValid) throw new Error('INVALID_COMPANY_CREDENTIALS');

    const userResult = await findUsuarioByCorreoOHandle(usuario);
    if (!userResult || userResult.rowCount === 0) throw new Error('USER_NOT_FOUND');
    const usuarioData = userResult.rows[0];
    const validUser = await bcrypt.compare(password, usuarioData.password);
    if (!validUser) throw new Error('INVALID_USER_CREDENTIALS');

    const code = generateCode();
    await updateUsuarioCodigo(usuarioData.correo, code, new Date());
    await sendVerificationEmail(usuarioData.correo, code);

    const token = generateToken({ correo: usuarioData.correo }, '15m');
    return { message: 'Código de inicio de sesión enviado al correo.', token };
};


export const verifyLoginUsuario = async ({ token, codigo }) => {
    const payload = verifyToken(token);
    if (!payload?.correo) throw new Error('INVALID_TOKEN_PAYLOAD');

    const userResult = await findUsuarioByCorreo(payload.correo);
    if (!userResult || userResult.rowCount === 0) throw new Error('USER_NOT_FOUND');

    const usuarioData = userResult.rows[0];

    const now = new Date();
    const minutesPassed = (now - new Date(usuarioData.codigo_fecha)) / (1000 * 60);
    if (minutesPassed > CODE_EXPIRATION_MINUTES) throw new Error('CODE_EXPIRED');

    if (usuarioData.codigo_verificacion !== parseInt(codigo)) throw new Error('INVALID_CODE');

    const isAdmin = usuarioData.id === 1;

    const finalToken = generateToken({ correo: usuarioData.correo, id: usuarioData.id, isAdmin }, '1h');
    return { message: 'Login exitoso', token: finalToken };
};

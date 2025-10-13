import slug from 'slug';
import { hashPassword, checkPassword } from '../utils/hashUtils.js';
import { sendVerificationEmail } from '../utils/mailUtils.js';
import { findUserByEmail, findUserByHandle, createUser } from '../repositories/userRepository.js';
import { findTempUserByEmail, createTempUser, deleteTempUser, verifyTempUser } from '../repositories/tempUserRepository.js';

export const registerUser = async ({ email, password, handle, name }) => {
    const existingUser = await findUserByEmail(email);
    if (existingUser.rowCount > 0) throw new Error('EMAIL_EXISTS');

    const safeHandle = slug(handle || '', '');
    const existingHandle = await findUserByHandle(safeHandle);
    if (existingHandle.rowCount > 0) throw new Error('HANDLE_EXISTS');

    const tempUser = await findTempUserByEmail(email);
    if (tempUser.rowCount > 0) throw new Error('PENDING_VERIFICATION');

    const hashed = await hashPassword(password);
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await createTempUser(email, hashed, safeHandle, name, code);
    await sendVerificationEmail(email, code);
};

export const confirmUser = async ({ email, code }) => {
    const result = await verifyTempUser(email, code);
    if (result.rowCount === 0) throw new Error('INVALID_CODE');

    const { handle, name, password } = result.rows[0];
    await createUser(email, password, handle, name);
    await deleteTempUser(email);
};

export const loginUser = async ({ email, password }) => {
    const result = await findUserByEmail(email);
    if (result.rowCount === 0) throw new Error('EMAIL_NOT_FOUND');

    const user = result.rows[0];
    const valid = await checkPassword(password, user.password);
    if (!valid) throw new Error('INVALID_PASSWORD');
};


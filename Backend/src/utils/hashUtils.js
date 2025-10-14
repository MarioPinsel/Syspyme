import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export const checkPassword = async (password, hashed) => {
    return await bcrypt.compare(password, hashed);
};

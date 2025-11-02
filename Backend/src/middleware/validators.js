import { body } from 'express-validator';

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export const registerValidationEmpresa = [
    body('nombre').notEmpty().withMessage('El nombre no puede ir vacío').isLength({ max: 50 }),
    body('nit').matches(/\b[0-9]{10}\b/).withMessage('NIT inválido'),
    body('correo').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password')
        .matches(passwordRegex)
        .withMessage('La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y símbolo')
];

export const registerValidation = [
    body('handle').notEmpty().withMessage('El handle no puede ir vacío').isLength({ min: 3, max: 20 }),
    body('nombre').notEmpty().withMessage('El nombre no puede ir vacío').isLength({ max: 50 }),
    body('correo').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password')
        .matches(passwordRegex)
        .withMessage('La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y símbolo')
];

export const loginValidation = [
    body('empresa').notEmpty().withMessage('Nombre de empresa obligatorio'),
    body('empresaPassword').notEmpty().withMessage('Contraseña de empresa obligatoria'),
    body('usuario').notEmpty().withMessage('Usuario o correo obligatorio'),
    body('password').notEmpty().withMessage('Contraseña de usuario obligatoria')
];

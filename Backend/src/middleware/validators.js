import { body } from 'express-validator';

export const registerValidationEmpresa = [
    body('nombre').notEmpty().withMessage('El nombre no puede ir vacío').isLength({ max: 50 }),
    body('nit').matches(/^\d{5,12}-?\d?$/).withMessage('NIT inválido'),
    body('correo').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres')
];

export const registerValidation = [
    body('handle').notEmpty().withMessage('El handle no puede ir vacío').isLength({ min: 3, max: 20 }),
    body('nombre').notEmpty().withMessage('El nombre no puede ir vacío').isLength({ max: 50 }),
    body('correo').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres')
];

export const loginValidation = [
    body('empresa').notEmpty().withMessage('Nombre de empresa obligatorio'),
    body('empresaPassword').notEmpty().withMessage('Contraseña de empresa obligatoria'),
    body('usuario').notEmpty().withMessage('Usuario o correo obligatorio'),
    body('password').notEmpty().withMessage('Contraseña de usuario obligatoria')
];

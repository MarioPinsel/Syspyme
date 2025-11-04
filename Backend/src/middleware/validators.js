import { body, query } from 'express-validator';

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

export const addProductValidation = [
    body('type')
        .notEmpty().withMessage('El tipo es obligatorio')
        .isString().withMessage('El tipo debe ser un texto'),

    body('description')
        .notEmpty().withMessage('Los atributos son obligatorios')
        .isObject().withMessage('Los atributos deben ser un objeto JSON'),

    body('unitPrice')
        .notEmpty().withMessage('El precio unitario es obligatorio')
        .isFloat({ gt: 0 }).withMessage('El precio unitario debe ser mayor que 0'),

    body('quantity')
        .notEmpty().withMessage('La cantidad es obligatoria')
        .isInt({ gt: 0 }).withMessage('La cantidad debe ser un número entero positivo'),

    body('code')
        .notEmpty().withMessage('El codigo es obligatoria')
        .isAlphanumeric().withMessage('El código debe ser alfanumérico')
];

export const updateProductValidation = [
    body('id')
        .notEmpty().withMessage('El ID del producto es obligatorio')
        .isInt({ gt: 0 }).withMessage('El ID debe ser un número entero positivo'),

    body().custom(body => {
        const { unitPrice, quantity, code } = body;
        if (unitPrice === undefined && quantity === undefined && code === undefined) {
            throw new Error('Debe enviar al menos un campo a actualizar (unitPrice, quantity o code)');
        }
        return true;
    }),

    body('unitPrice')
        .optional()
        .isFloat({ gt: 0 }).withMessage('El precio unitario debe ser mayor que 0'),

    body('quantity')
        .optional()
        .isInt({ gt: 0 }).withMessage('La cantidad debe ser un número entero positivo'),

    body('code')
        .optional()
        .isAlphanumeric().withMessage('El código debe ser alfanumérico')
];

export const getProductValidation = [
    query('id')
        .notEmpty().withMessage('El ID del producto es obligatorio')
        .isInt({ gt: 0 }).withMessage('El ID debe ser un número entero positivo')
];

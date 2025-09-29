import { body } from 'express-validator';

export const registerValidation = [
    body('handle')
        .notEmpty().withMessage('El handle no puede ir vacío')
        .isLength({ min: 3, max: 20 }).withMessage('El handle debe tener entre 3 y 20 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('El handle solo puede contener letras, números y guion bajo'),

    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacío')
        .isLength({ max: 50 }).withMessage('El nombre no puede superar los 50 caracteres')
        .trim(),

    body('email')
        .isEmail().withMessage('E-mail no válido')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres')
        .matches(/[A-Z]/).withMessage('La contraseña debe incluir al menos una mayúscula')
];
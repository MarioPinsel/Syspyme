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

export const createProductValidation = [
    body('type')
        .notEmpty().withMessage('El tipo es obligatorio')
        .isString().withMessage('El tipo debe ser un texto'),

    body('description')
        .notEmpty().withMessage('La descripción son obligatorios')
        .isObject().withMessage('La descripción deben ser un objeto JSON'),

    body('unitPrice')
        .notEmpty().withMessage('El precio unitario es obligatorio')
        .isFloat({ gt: 50 }).withMessage('El precio unitario debe ser mayor que 0'),

    body('quantity')
        .notEmpty().withMessage('La cantidad es obligatoria')
        .isInt({ gt: 0 }).withMessage('La cantidad debe ser un número entero positivo'),

    body('code')
        .notEmpty().withMessage('El codigo es obligatoria')
        .isAlphanumeric().withMessage('El código debe ser alfanumérico')
];

export const addProductValidation = [

    body('code')
        .notEmpty().withMessage('El codigo es obligatoria')
        .isAlphanumeric().withMessage('El código debe ser alfanumérico'),

    body('quantity')
        .notEmpty().withMessage('La cantidad es obligatoria')
        .isInt({ gt: 0 }).withMessage('La cantidad debe ser un número entero positivo')


];

export const updateProductValidation = [
    body('id')
        .notEmpty().withMessage('El ID del inventario es obligatorio')
        .isInt({ gt: 0 }).withMessage('El ID debe ser un número entero positivo'),

    body().custom(body => {
        const { unitPrice, quantity, code, type, description } = body;
        if (
            unitPrice === undefined &&
            quantity === undefined &&
            code === undefined &&
            type === undefined &&
            description === undefined
        ) {
            throw new Error('Debe enviar al menos un campo a actualizar');
        }
        return true;
    }),

    body('unitPrice')
        .optional()
        .isFloat({ gt: 50 }).withMessage('El precio unitario debe ser mayor que 0'),

    body('quantity')
        .optional()
        .isInt({ gt: 0 }).withMessage('La cantidad debe ser un número entero positivo'),

    body('code')
        .optional()
        .isAlphanumeric().withMessage('El código debe ser alfanumérico'),

    body('type')
        .optional()
        .isString().withMessage('El tipo debe ser texto'),

    body('description')
        .optional()
        .isObject().withMessage('La descripción debe ser un JSON válido')
];


export const getProductValidation = [
    body('id')
        .notEmpty().withMessage('El ID del producto es obligatorio')
        .isInt({ gt: 0 }).withMessage('El ID debe ser un número entero positivo')
];

export const createCustomerValidation = [
    body("name")
        .trim()
        .notEmpty().withMessage("El nombre es obligatorio.")
        .isLength({ max: 100 }).withMessage("El nombre no puede tener más de 100 caracteres."),

    body("document")
        .notEmpty().withMessage("El documento es obligatorio.")
        .isLength({ max: 10 }).matches(/^\d+$/).withMessage("El documento debe contener solo números.")
        .withMessage("El documento debe ser un número entero válido de 7 a 10 dígitos (cédula colombiana)."),

    body("phone")
        .notEmpty().withMessage("El teléfono es obligatorio.").isLength({ max: 10 })
        .matches(/^\d+$/).withMessage("El teléfono debe contener solo números.")
        .withMessage("El teléfono debe ser un número válido en Bogotá (fijo 7 dígitos o móvil 10 dígitos, empieza con 3)."),

    body("email")
        .notEmpty().withMessage("El correo es obligatorio.")
        .isEmail().withMessage("El correo no tiene un formato válido.")
        .isLength({ max: 50 }).withMessage("El correo no puede tener más de 50 caracteres.")
];

export const updateCustomerValidation = [
    // ID obligatorio
    body("id")
        .notEmpty().withMessage("El id del cliente es obligatorio.")
        .isInt({ gt: 0 }).withMessage("El id debe ser un número entero positivo."),

    // Al menos un campo opcional debe enviarse
    body().custom(body => {
        const { name, document, phone, email } = body;
        if (name === undefined && document === undefined && phone === undefined && email === undefined) {
            throw new Error("Debe enviar al menos un campo a actualizar (nombre, documento, telefono o correo).");
        }
        return true;
    }),

    // Nombre opcional
    body("name")
        .optional()
        .trim()
        .notEmpty().withMessage("El nombre no puede estar vacío si se envía.")
        .isLength({ max: 100 }).withMessage("El nombre no puede tener más de 100 caracteres."),

    // Documento opcional (cédula colombiana)
    body("document")
        .optional()
        .isLength({ max: 10 }).matches(/^\d+$/).withMessage("El documento debe contener solo números.")
        .withMessage("El documento debe ser un número entero válido de 7 a 10 dígitos (cédula colombiana)."),

    // Teléfono opcional (Bogotá: fijo 7 dígitos o móvil 10 dígitos)
    body("phone")
        .optional()
        .isLength({ max: 10 })
        .matches(/^\d+$/).withMessage("El teléfono debe contener solo números.")
        .withMessage("El teléfono debe ser un número válido en Bogotá (fijo 7 dígitos o móvil 10 dígitos, empieza con 3)."),

    // Correo opcional
    body("email")
        .optional()
        .isEmail().withMessage("El correo no tiene un formato válido.")
        .isLength({ max: 50 }).withMessage("El correo no puede tener más de 50 caracteres.")
];

export const createSaleValidation = [
    body("document")
        .notEmpty().withMessage("El documento es obligatorio.")
        .isInt({ min: 1000000, max: 9999999999 }).withMessage("El documento debe ser un número entero válido de 7 a 10 dígitos (cédula colombiana)."),

    body("items")
        .isArray({ min: 1 }).withMessage("La venta debe incluir al menos un ítem."),

    body("items.*.code")
        .notEmpty().withMessage('El codigo es obligatoria')
        .isAlphanumeric().withMessage('El código debe ser alfanumérico'),

    body("items.*.quantity")
        .notEmpty().withMessage("La cantidad es obligatoria.")
        .isInt({ min: 1 }).withMessage("La cantidad debe ser un entero mayor a 0."),

    body("paymentMethod")
        .notEmpty().withMessage("El método de pago es obligatorio.")
        .isIn(["EFECTIVO", "TARJETA", "TRANSFERENCIA"])
        .withMessage("Método de pago inválido."),

    body("paymentType")
        .notEmpty().withMessage("La forma de pago es obligatoria.")
        .isIn(["CONTADO", "CREDITO"])
        .withMessage("La forma de pago solo puede ser CONTADO o CREDITO."),

    body("creditTerm")
        .if(body("paymentType").equals("CREDITO"))
        .notEmpty().withMessage("El plazoCredito es obligatorio en ventas a crédito.")
        .isInt({ min: 1, max: 365 }).withMessage("El plazoCredito debe ser entre 1 y 365 días.")
];


export const deleteSaleValidation = [
    body('id')
        .notEmpty().withMessage('El ID de la factura es obligatorio')
        .isInt({ gt: 0 }).withMessage('El ID debe ser un número entero positivo')
]
import { findCustomerByDocument, createCustomer, findAllCustomers, findCustomerById, updateCustomer } from "../repositories/customersRepository.js";

export const createCustomerService = async (pool, { name, document, phone, email }) => {

    const exists = await findCustomerByDocument(pool, document);

    if (exists.rowCount > 0) {
        return {
            success: false,
            message: `El documento ${document} ya está registrado.`,
            data: exists.rows[0]
        };
    }

    const result = await createCustomer(pool, { name, document, phone, email });

    return {
        success: true,
        message: "Cliente registrado correctamente.",
        data: result.rows[0]
    };
};


export const getCustomersService = async (pool) => {
    const result = await findAllCustomers(pool);

    if (result.rowCount === 0) {
        return { success: false, message: "No hay clientes actualmente." };
    }

    return {
        success: true,
        data: result.rows
    };
};

export const updateCustomerService = async (pool, { id, name, document, phone, email }) => {

    const exists = await findCustomerById(pool, id);

    if (exists.rowCount === 0) {
        return { success: false, message: "No existe un cliente con ese ID." };
    }

    const fields = {};

    if (name !== undefined) fields.nombre = name;
    if (document !== undefined) fields.documento = document;
    if (phone !== undefined) fields.telefono = phone;
    if (email !== undefined) fields.correo = email;

    if (Object.keys(fields).length === 0) {
        return {
            success: false,
            message: "Debe enviar al menos un campo para actualizar."
        };
    }

    const updated = await updateCustomer(pool, id, fields);

    return {
        success: true,
        message: "Cliente actualizado correctamente.",
        data: updated.rows[0]
    };
};

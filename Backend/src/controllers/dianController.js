import { loginDIANService, getCompaniesDIANServices, registerCompanyServices } from '../services/dianService.js';

export const loginDIANController = async (req, res) => {
    try {

        const result = await loginDIANService(req.body);

        return res.status(result.status).json({
            message: result.message,
            token: result.token || null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getCompaniesDIANController = async (req, res) => {
    try {

        const result = await getCompaniesDIANServices(req.body);

        return res.status(result.status).json({
            message: result.message,
            data: result.data,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const registerCompanyController = async (req, res) => {
    try {

        const result = await registerCompanyServices(req.body);

        return res.status(result.status).json({
            message: result.message
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
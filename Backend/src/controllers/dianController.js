import { loginDIANService, getCompaniesDIANService, registerCompanyService, getCompaniesPendingService, getCertificateByCompanyService, acceptCertificateService } from '../services/dianService.js';

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

        const result = await getCompaniesDIANService();

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

        const result = await registerCompanyService(req.body);

        return res.status(result.status).json({
            message: result.message
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getCompaniesPendingController = async (req, res) => {
    try {

        const result = await getCompaniesPendingService();

        return res.status(200).json({
            success: true,
            data: result.companies
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getCertificateByCompanyController = async (req, res) => {
    try {
        const { companyName } = req.query;
        const result = await getCertificateByCompanyService(companyName);

        res.setHeader("Content-Type", "text/html");
        return res.status(200).send(result.html);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const acceptCertificateController = async (req, res) => {
    try {
        const { companyName, action, motivo } = req.body;
        const result = await acceptCertificateService({ companyName, action, motivo });

        return res.status(200).json({
            message: result.message
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
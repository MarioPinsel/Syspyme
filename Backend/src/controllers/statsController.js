import { statsService } from '../services/statsService.js'

export const statsController = async (req, res) => {
    try {
        const pool = req.pool;
        const result = await statsService(pool);

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


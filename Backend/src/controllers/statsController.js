import { statsService } from '../services/statsService.js'
import { statsSalesService } from '../services/statsService.js'

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

export const statsSalesController = async (req, res) => {
  const pool = req.pool;
  const { companyId } = req.params;

  try {
    const data = await statsSalesService(pool, companyId);
    return res.status(200).json({ ok: true, data });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error obteniendo estadísticas de ventas",
      error: error.message
    });
  }
};



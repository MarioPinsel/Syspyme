import { statsService } from '../services/statsService.js'
import { statsSalesService } from '../services/statsService.js'
import { getPool } from "../config/db.js";
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
  try {
    const pool = await getPool();
    const stats = await statsSalesService(pool);

    res.status(200).json({
      ok: true,
      sales_by_client: stats
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas de ventas:", error);
    res.status(500).json({ 
      ok: false, 
      message: "Error interno del servidor" 
    });
  }
};


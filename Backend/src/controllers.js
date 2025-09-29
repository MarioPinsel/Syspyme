import { pool } from '../config/db/pool.js'
import { hashPassword } from '../config/db/pool.js'
import slug from 'slug'

export const createAccount = async (req, res) => {
    const { name, password, handle } = req.body

    try {
        const emailResult = await pool.query('SELECT id FROM users WHERE email = $1',)

    } catch (error) {

    }
}
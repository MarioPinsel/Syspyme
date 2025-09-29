import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router();

router.get("/users", async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        res.json(rows);
        console.log(rows)
    } catch (error) {
        console.error(error); 
    }
})

router.post("/users", async (req, res) => {
    try {
        const { name, email } = req.body;
        await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);        
    } catch (error) {
        console.error(error);
    }
})

export default router
//AQUI DEBERIA IR EL CRUD BASICO
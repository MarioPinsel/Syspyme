import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

// ✅ Servir archivos estáticos (HTML, CSS, JS compilado)
app.use(express.static(path.join(__dirname, 'dist')));

// ✅ Fallback para React Router - CORRECTO para Express 5.x
app.get(/^(?!.*\.).*$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ✅ Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Frontend corriendo en http://localhost:${PORT}`);
});
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Servir estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// ✅ Fallback SPA - REDIRIGE todas las rutas a index.html
// Excepto archivos con extensión (CSS, JS, etc.)
app.get(/^(?!.*\.).*$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Frontend servido en http://localhost:${PORT}`);
});
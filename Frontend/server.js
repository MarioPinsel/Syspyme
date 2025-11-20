import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const app = express();
const PORT = process.env.PORT || 8000;

// servir estáticos
app.use(express.static(path.join(dirname, 'dist')));

// fallback SPA (expresión regular evita servir index.html para assets)
app.get(/^(?!..).$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Frontend servido en http://localhost:${PORT}`);
});
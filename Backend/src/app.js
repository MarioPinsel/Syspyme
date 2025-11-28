import 'dotenv/config';
import server from './server.js'

const port = process.env.PORT;

server.listen(port, () => {
    console.log("Servidor Funcionando...", port);
})

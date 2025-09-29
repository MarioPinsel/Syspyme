import server from './server.js'
const port = 4000;

server.listen(port, () => {
    console.log("Servidor Funcionando...", port);
})
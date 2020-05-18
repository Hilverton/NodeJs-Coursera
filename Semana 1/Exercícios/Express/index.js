const express = require('express');
const morgan = require('morgan');
const http = require('http');

const host = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<html><body><h1>This is a Express Server</h1></body></html>')
});

const server = http.createServer(app);

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});

//ao fazer a requisição, vai ser direcionado para a index.html dentro da pasta public. Para ir para a segunda configuração, o html no terceira app.use, tem que ser uma rota em que o sercidor não encontra o arquivo html. Não é a maneira ideal de se fazer isso. 
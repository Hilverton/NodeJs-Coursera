const express = require('express');
const http = require('http');

const host = 'localhost';
const port = 3000;

const app = express();

app.use((req, res, next) => {
    console.log(req.headers);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<html><body><h1>This is a Express Server</h1></body></html>')
});

const server = http.createServer(app);

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
})
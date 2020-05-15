const http = require('http');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    console.log(req.headers);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<html><body><h1>Hello, World!</h1><h1>Testando servidor</h1></body></html>');
	res.end();
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
})
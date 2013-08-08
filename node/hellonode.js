//https://docs.c9.io/writing_nodejs_hello_world.html
var http = require('http');
// for node without c9:
if(!process.env){
	process.env={};
}
if(!process.env.PORT){
	process.env.PORT=81;
}

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello Node\n');
}).listen(process.env.PORT, process.env.IP);
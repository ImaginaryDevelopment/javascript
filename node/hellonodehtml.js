//https://docs.c9.io/writing_nodejs_hello_world.html
var http = require('http');
var fs = require('fs');
console.log(process.cwd());
var htmlDir= process.cwd()+'/html/';
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    console.log(process.cwd()+'\n');
    var cwd= process.cwd()+'/';
    fs.readFile(htmlDir+'sample.html',function(err,page){
    res.write(page);    
    res.end('Hello Node fs\n');    
    });
    
    
    
}).listen(process.env.PORT, process.env.IP);
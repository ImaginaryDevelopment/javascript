//https://docs.c9.io/writing_nodejs_hello_world.html
var http = require('http');
var fs = require('fs');
console.log(process.cwd());
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write(process.cwd()+'\n');
    var cwd= process.cwd()+'/';
    fs.readdir(cwd,function(err,list){
        
    res.write(list.toString());
    res.end('Hello Node fs\n');    
    });
    
}).listen(process.env.PORT, process.env.IP);
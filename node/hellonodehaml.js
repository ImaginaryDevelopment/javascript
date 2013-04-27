//https://docs.c9.io/writing_nodejs_hello_world.html
// npm install haml
var http = require('http');
var fs = require('fs');
var Haml = require('haml');
console.log(process.cwd());
var htmlDir= process.cwd()+'/html/';
var hamlDir= htmlDir+'haml/';
var sampleHaml=hamlDir+'sample.haml';
console.log('haml:'+sampleHaml);
var haml = fs.readFileSync(sampleHaml, 'utf8');
var dirList=fs.readdirSync(process.cwd());
console.log('dir:'+dirList.toString());
console.log('haml len:'+haml.length);
var data = {
  title: "Hello Node Haml with variables",
  contents: "<h1>Hello Haml variables</h1>"+"<div>"+dirList.toString() +"</div>"
};



http.createServer(function (req, res) {
    
    res.writeHead(200, {'Content-Type': 'text/html'});
    console.log(process.cwd()+'\n');
    var rendered=Haml.render(haml, {locals: data});
    console.log('rendered len:'+rendered.length);
    console.log(rendered);
    res.write(rendered);    
    res.end();    
   
    
    
    
}).listen(process.env.PORT, process.env.IP);
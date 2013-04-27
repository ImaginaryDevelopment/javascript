//https://docs.c9.io/writing_nodejs_hello_world.html
// npm install haml
var http = require('http');
var fs = require('fs');
var Haml = require('haml');
var url = require('url');
var path=require('path');

console.log(process.cwd());
var htmlDir= process.cwd()+'/html/';
var hamlDir= htmlDir+'haml/';
var sampleHaml=hamlDir+'samplecss.haml';
console.log('haml:'+sampleHaml);

var haml = fs.readFileSync(sampleHaml, 'utf8');
var dirList=fs.readdirSync(process.cwd());
console.log('dir:'+dirList.toString());
console.log('haml len:'+haml.length);

var data = {
  title: "Hello Node Haml with variables",
  contents: "<h1>Hello Haml variables</h1>"+"<div>"+dirList.toString() +"</div>",
  nodecss: "sample.css"
};



    
    
    

http.createServer(function (req, res) {
    //http://www.hongkiat.com/blog/node-js-server-side-javascript/
    var my_url= url.parse(req.url);
    var my_path= my_url.pathname;
    //path.exists()
    res.writeHead(200, {'Content-Type': 'text/html'});
    console.log(process.cwd()+'\n');
    console.log('data:'+data);
    var rendered=Haml.render(haml, {locals: data});
    console.log('rendered len:'+rendered.length);
    console.log(rendered);
    res.write(rendered);    
    res.end();    
   
    
    
    
}).listen(process.env.PORT, process.env.IP);
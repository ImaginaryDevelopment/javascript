//http://www.hongkiat.com/blog/node-js-server-side-javascript/
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
console.log(process.cwd());
var htmlDir= process.cwd()+'/html/';
http.createServer(function (req, res) {
    var my_path = url.parse(req.url).pathname;
    console.log(my_path);
    if(my_path==='/')
        my_path+='html/angular.html';
    var full_path = path.join(process.cwd(),my_path);
    
     fs.exists(full_path,function(exists){  
         if(!exists){  
            console.log('didn\'t exist'); 
            res.writeHeader(404, {"Content-Type": "text/plain"});    
            res.write("404 Not Found\n");    
            res.end();  
            return;
        }    
            fs.readFile(full_path, "binary", function(err, file) {    
                 if(err) {    
                     console.log('error');
                     res.writeHeader(500, {"Content-Type": "text/plain"});    
                     res.write(err + "\n");    
                     res.end();    
                 
                 }    
                 else{  
                     if(my_path.indexOf('.html')===my_path.length-5){
                        res.writeHeader(200, {"Content-Type": "text/html"});
                     } else {
                    res.writeHeader(200);
                     }
                    console.log('writing binary');
                    res.write(file, "binary");    
                    res.end();  
                }  
                       
            });  
         
     });
    
    
}).listen(process.env.PORT, process.env.IP);
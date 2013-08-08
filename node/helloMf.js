//https://docs.c9.io/installing_npm_modules.html
//needs: npm install express
var express = require('express'),
    app = express(),
    fs=require('fs');

app.use(express.logger());

app.get('/', function(req, res){
	var path= "..\\..\\publish.ang.htm";
	fs.readFile(path,function(err,data){
		res.type('html');
		res.send(data);
	})
    

});

if(!process.env){
	process.env={};
}

if(!process.env.PORT){
	process.env.PORT=81;
}

app.listen(process.env.PORT);
console.log('Express server started on port %s', process.env.PORT);
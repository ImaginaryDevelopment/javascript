//https://docs.c9.io/installing_npm_modules.html
//needs: npm install express
var express = require('express'),
    app = express();

app.use(express.logger());

app.get('/', function(req, res){
    res.send('Hello Express');
});

if(!process.env){
	process.env={};
}

if(!process.env.PORT){
	process.env.PORT=81;
}

app.listen(process.env.PORT);
console.log('Express server started on port %s', process.env.PORT);
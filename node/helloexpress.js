//https://docs.c9.io/installing_npm_modules.html
//needs: npm install express
var express = require('express'),
    app = express();

app.use(express.logger());

app.get('/', function(req, res){
    res.send('Hello Express');
});

app.listen(process.env.PORT);
console.log('Express server started on port %s', process.env.PORT);
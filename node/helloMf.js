//https://docs.c9.io/installing_npm_modules.html
//needs: npm install express
var express = require('express'),
    app = express(),
    fs=require('fs'),
   //http = require('http'),
    url = require('url'),
    auth = require('./auth.js'),
    httpstatus = require('./httpstatus.js'),
    xml2js = require('xml2js')
    ;
 var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,HEAD');
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");

    next();
};   

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
//app.use(express.session());
app.use(express.cookieSession({ secret: 'hey' }));
app.use(allowCrossDomain);
app.use(app.router);

app.options('*',function(req,res,next){
	res.send(200);
	res.end();
});
app.get('*.js',function(req,res){
	var reqPath= url.parse(req.path);
	var path = ".."+req.path;
	console.log('getting javascript:'+path);
	fs.readFile(path,function(err,data){
		res.type('html');
		res.send(data);
		res.end();
	});
});
app.get('/', function(req, res){
	var path= "..\\publish.ang.htm";
	fs.readFile(path,function(err,data){
		res.type('html');
		res.send(data);
		res.end();
	});
});
app.get('/parsed.config',function(req,res){
	//take an xml file and return json
	//https://github.com/Leonidas-from-XIV/node-xml2js
	console.log('getting parsed config!');
	var path="\\\\"+req.query.host+"\\"+req.query.base+"\\"+req.query.path;
	
	fs.readFile(path,function(err,data){
		if(err){
			console.log('readFile error:'+err);
			res.send(err);
			res.end();
			return;
		}
		var parser = new xml2js.Parser();
		
			parser.parseString(data,function(err,result){
				res.send(result);
				res.end();
			});
		
		
	});

});
app.get('/web.config',function(req,res){
	if(!req.query.host || !req.query.path){
		console.log('no host or path');
		res.send('no host or path in '+req.query);
		res.end();
	} if(!req.query.base){
		console.log('no server path base');
		res.send('no server path base '+req.query);
		res.end();
	} else {
		console.log('fetching config file');
		// host should be sandbox, base should be path to main directory (C$\77494\ for instance), path should be path from there to config file
		var path="\\\\"+req.query.host+"\\"+req.query.base+"\\"+req.query.path;
		console.log('fetching config from '+path);
			fs.readFile(path,function(err,data){
				res.type('xml');
				res.send(data);
				res.end();
		});
	}
});
httpstatus.routes(app);

auth.authRoutes(app,fs);

if(!process.env){
	process.env={};
}

if(!process.env.PORT){
	process.env.PORT=81;
}

app.listen(process.env.PORT);
console.log('Express server started on port %s', process.env.PORT);
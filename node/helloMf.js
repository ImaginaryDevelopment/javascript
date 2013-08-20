//https://docs.c9.io/installing_npm_modules.html
//needs: npm install express
var express = require('express'),
    app = express(),
    fs=require('fs'),
    http = require('http'),
    url = require('url'),
    auth = require('./auth.js'),
    httpstatus = require('./httpstatus.js')
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

app.get('*.config',function(req,res){
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
app.get('/urlstatus',function(req,res){
	console.log('checking url with get');
	
	if(!req.query.host || !req.query.path){
		console.log('no host or path');
		res.send('no host or path in '+req.query);
		res.end();
	} else {
		httpstatus.processUrlStatus(req.query.host,req.query.path,res);
	}
});

app.post('/urlstatus',function(req,res){
	if(!req.body){
		console.log('no body');
		res.send('no body');
		res.end();
	} else {
		var post= req.body;
		if(post.host && post.path){
			httpstatus.processUrlStatus(post.host,post.path,res);
		} else {
			console.log('no host or path');
			res.send('no host or path');
			res.end();
		}
	}
});

auth.authRoutes(app,fs);

if(!process.env){
	process.env={};
}

if(!process.env.PORT){
	process.env.PORT=81;
}

app.listen(process.env.PORT);
console.log('Express server started on port %s', process.env.PORT);
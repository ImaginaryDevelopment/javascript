//https://docs.c9.io/installing_npm_modules.html
//needs: npm install express
var express = require('express'),
    app = express(),
    fs=require('fs');
    
function checkAuth(req, res, next) { //http://stackoverflow.com/a/8003291/57883
  console.log('checking auth!');
  if (!req.session.user_id) {
    res.send('You are not authorized to view this page');
  } else {
  	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  }
}
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
//app.use(express.session());
app.use(express.cookieSession({ secret: 'hey' }));
app.use(app.router);

app.get('/', function(req, res){
	var path= "..\\..\\publish.ang.htm";
	fs.readFile(path,function(err,data){
		res.type('html');
		res.send(data);
	});
});
app.get('/my_secret_page', checkAuth, function (req, res) {
  res.send('if you are viewing this page it means you are logged in');
});
app.post('/login', function (req, res) {
	if(!req.body){
		res.send('no body');
	} else {
		var post = req.body;
  		if (post.user == 'john' && post.password == 'johnspassword') {
    		req.session.user_id = post.user;
    		res.redirect('/my_secret_page');
  		} else {
    		res.send('Bad user/pass');
  		}		
	}
  
});
app.get('/login',function(req,res){
	var path= "..\\html\\login.htm";
	fs.readFile(path,function(err,data){
		res.type('html');
		res.send(data);
	});
});


if(!process.env){
	process.env={};
}

if(!process.env.PORT){
	process.env.PORT=81;
}

app.listen(process.env.PORT);
console.log('Express server started on port %s', process.env.PORT);
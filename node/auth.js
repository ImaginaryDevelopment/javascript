// auth.js
var checkAuth=function(req, res, next) { //http://stackoverflow.com/a/8003291/57883
	  console.log('checking auth!');
	  if (!req.session.user_id) {
	    res.send('You are not authorized to view this page');
	    res.end();
	  } else {
	  	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	    next();
	  }
	};

module.exports = {
	
	authRoutes: function(app,fs){
		app.get('/my_secret_page', checkAuth, function (req, res) {
  		res.send('if you are viewing this page it means you are logged in');
  		res.end();
		});

		app.post('/login', function (req, res) {
			if(!req.body){
				res.send('no body');
				res.end();
			} else {
				var post = req.body;
		  		if (post.user == 'john' && post.password == 'johnspassword') {
		    		req.session.user_id = post.user;
		    		res.redirect('/my_secret_page');
		    		res.end();
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
				res.end();
			});
		});
	}

};


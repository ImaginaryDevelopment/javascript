//httpStatus.js
var http= require('http');
module.exports = {
		routes: function(app){
			app.get('/urlstatus',function(req,res){
				console.log('checking url with get');
				processUrlStatus(req.query.host,req.query.path,res);
			});

			app.post('/urlstatus',function(req,res){
				if(!req.body){
					console.log('no body');
					res.send('no body');
					res.end();
				} else {
					var post= req.body;
					processUrlStatus(post.host,post.path,res);
				}
			});
	}
};
var processUrlStatus=function(host,path,res){
	if(!host)
	{
		res.send('no host');
		res.end();
		return;
	}
	if(!path){
		res.send('no path');
		res.end();
		return;
	}
	console.log('processing url:'+host+'+'+path);
	
	var options = {
		host: host,
		path: path,
		method:'GET',
		headers: {host:host }
	};

	var req=http.request(options,function(response){
		console.log(response.statusCode + '-'+host+path);
	
		res.send(response.statusCode);
		res.end();
		console.log('res.end success!');
	})
		.on('socket',function(socket){
			socket.setTimeout(1000);
			socket.on('timeout',function(){
				console.log('aborting:timeout hit:'+host+path);
				req.abort();
			})
		})
		.on('error',function(e){
			console.log('http.request error for '+host+path+' : '+JSON.stringify(e));
			switch(e.code){
				case 'ENOTFOUND':
				res.send('Endpoint not found');
				break;
				default:
				res.send(e.code);	
			}
			res.end();

		});
	req.end();
};
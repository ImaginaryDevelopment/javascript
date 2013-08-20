//httpStatus.js
module.exports = {
	processUrlStatus: function(host,path,res){
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
	}).on('error',function(e){
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
}
};
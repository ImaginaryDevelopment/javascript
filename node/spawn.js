//spawn.js
//http://stackoverflow.com/questions/14458508/node-js-shell-command-execution
module.exports = {
	cmd_exec:cmdExec,
	spawnRoutes:function(app){
		//iis
		iisreset(app);
		//appcmd?
		appcmd(app);
		//git?
		//sc?
		sc(app);
	}
}

var cmdExec=function (cmd, args, cb_stdout, cb_stdoutend,cb_stderr,cb_stderrend,cb_close) {
	var spawn = require('child_process').spawn,
	child = spawn(cmd, args),
	me = this;
	me.exit = 0;  // Send a cb to set 1 when cmd exits
	
	if(cb_stdout && typeof cb_stdout==='function'){
		console.log('attaching cb_stdout');
		child.stdout.on('data', function (data) { cb_stdout(me, data,child);});	
	}
  
	if(cb_stdoutend && typeof cb_stdoutend==='function')
	{
		console.log('attaching cb_stdoutend');
		child.stdout.on('end', function () { cb_stdoutend(me); });
	}
  
	if(cb_stderr && typeof cb_stderr==='function')
	{
		console.log('attaching cb_stderr');
		child.stderr.on('data',function(data){cb_stderr(me,data);});
	}
  	
	if(cb_stderrend && typeof cb_stderrend==='function')
	{
		console.log('attaching cb_stderrend');
		child.stderr.on('end',function(){ cb_stderrend(me);});	
	}
  
	if(cb_close)
		child.on('close',function(){cb_close(me);});
	child.on('disconnect',function(){console.log('disconnected');});
	child.on('message',function(message,handle){
		console.log('message!'+message);
	});
	child.stdout.resume();
	return child;
};

var runCmd = function(cmd,args,req,res,debug,overrides){
	overrides = overrides || {};
	//res.type('json');
	//res.send('starting at '+JSON.stringify(new Date()));
	var stdOutData= '';
	var stdErrData = '';
	//var readyToEnd = false;
	console.log('spawning: '+cmd+' with args '+ JSON.stringify(args));
	var cmd=new cmdExec(cmd,args,overrides.cb_stdout ||
				function(ps,data,child){
					var captured=data.toString('utf-8');
					if(debug)
						console.log('{stdout:\''+captured);
					stdOutData+=captured;
					if(debug)
						console.log('\'}');
					console.log(captured.length);
					console.log(stdOutData.length);
				
				}, overrides.cb_stdoutend ||
				function(child){
					if(debug)
						console.log('stdout end');
					
					
					if(readyToEnd)
					{
						res.json({out:stdOutData,err:stdErrData});
						//res.send(stdOutData);
						res.end();
					}
					else
						readyToEnd=true;

				}, overrides.cb_stderr ||

				function(child,errData){
					console.log('stderr:'+errData);
					stdErrData+=errData;
				}, overrides.cb_stderrend ||
				function(child){
					if(debug)
						console.log('stderr end');
				res.send('stderr ending at '+JSON.stringify(new Date()));
					//if(readyToEnd)
					//{
						//res.json({out:stdOutData,err:stdErrData});
						//res.end();
					//}
					//else
						//readyToEnd=true;
				},function(){
					console.log('closed!');
				}
				);
	return cmd;
}

var sc = function(app){
	app.get('/sc',function(req,res){
			
			var computer = req.query.computername || 'localhost';
			var directive = req.query.directive || 'query';
			runCmd("sc",[computer,directive],req,res);
				});
};

var iisreset = function(app){
	app.get('/iisreset',function(req,res){
			
			var computer = req.query.computername || 'localhost';
			var directive = req.query.directive || '/restart';
			runCmd("iisreset",[computer,directive],req,res);
				});
};
var psexec = function(computername,cmd,args,req,res,debug){

	args.unshift(cmd);
	//args.unshift('-NUL');
	

	args.unshift('\\\\'+computername);
	

	//args.unshift('-accepteula');
	//args.unshift('-s');	
	
	//args.unshift('/NUL');
	//args.unshift('-2>NUL');
	//args.unshift('2^>NUL');
	
	
	
	//args.push ('|more');
	console.log('args:'+JSON.stringify(args));
	return runCmd('psexec',args,req,res,debug,{ 
		cb_stdout:function(ps,data,child){child.stdout.pause();console.log('some data!');console.log(data.toString('utf-8'));child.stdout.resume();},
		cb_stderrend:{},
		cb_stderr:{},
	 cb_stdoutend:function(ps){
	 	console.log('psexec std out ending!');

	 	cb.send(ps.stdout.toString('utf-8'));
		

	}});

	//cmdExec('psexec',args,
	//			function(ps,data,child){
	//				var captured=data.toString('utf-8');
	//				if(debug)
	//					console.log('{stdout:\''+captured);
	//				res.send(captured);
	//				
	//				if(debug)
	//					console.log('\'}');
	//				console.log(captured.length);
	//				
	//			});

}
var appcmd = function(app){
	app.get('/appcmd',function(req,res){
		res.type('text');
		var computer = req.query.computername;
		var directive = req.query.directive || 'list';
		var target = req.query.obj || 'apps';
		if(computer){
			
			return psexec(computer,
				process.env.windir+"\\System32\\inetsrv\\appcmd.exe",
				[directive,target,//'/config','/xml'
				],req,res,true);
			//res.send('error appcmd only works locally');
			//res.end();
			
		} else {
			return runCmd(process.env.windir+"\\System32\\inetsrv\\appcmd.exe",[directive,target,'/config'],req,res);	
		}
		

		
	});
}
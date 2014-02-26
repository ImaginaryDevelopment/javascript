//hellonodewebkit.js
var fs = require('fs'),
	path = require('path'),
	child_process = require('child_process');

var cwd = process.cwd();
var winDir = process.env.windir;
var appcmdPath = path.join(winDir, 'System32', 'inetsrv', 'appcmd.exe');
var args;
var child;
fs.exists(appcmdPath, function(exists) {
	if (!exists)
		return;
	child = child_process.exec(appcmdPath,['list','app'], function(error, stdout, stderr) {
		if (error) {
			console.log(error.stack);
			console.log('Error code: ' + error.code);
			console.log('Signal received: ' +
				error.signal);
		}
		console.log('Child Process stdout: ' + stdout);
		console.log('Child Process stderr: ' + stderr);
	});

	child.on('exit', function(code) {
		console.log('Child process exited ' +
			'with exit code ' + code);
	});

});

var HellonodewebkitCtrl=function($scope){
	
};
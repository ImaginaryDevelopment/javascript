//hellonodewebkit.js
var fs = require('fs'),
	path = require('path'),
	child_process = require('child_process');

var cwd = process.cwd();
var winDir = process.env.windir;
var exec = function(cmd, args, callback) {
	var result = child_process.exec(cmd, args, callback);
	result.on('exit', function(code) {
		console.log('Child process exited ' +
			'with exit code ' + code);
	});
	return result;
};

var spawn = function(cmd, args, fnStdOut, fnStdErr) {
	var result = child_process.spawn(cmd, args);
	result.on('exit', function(code) {
		console.log('child process exited with code ' + code);
	});
	result.stdout.on('data', fnStdOut);
	result.stderr.on('data', fnStdErr);
	return result;
};
var logExec = function(error, stdout, stderr) {
	if (error) {
		console.log(error.stack);
		console.log('Error code: ' + error.code);
		console.log('Signal received: ' +
			error.signal);
	}
	if (stdout)
		console.log('stdout:' + stdout);
	if (stderr)
		console.log('stderr:' + stderr);
};
var HellonodewebkitCtrl = function($scope) {
	$scope.stdout = '';
	$scope.stderr = '';
	$scope.helloangular = 'hello angular!';
	window.$scope = $scope;

	//var appcmdPath = path.join(winDir, 'System32', 'inetsrv', 'appcmd.exe');
	var sc = 'sc';
	var args;
	$scope.child = spawn(sc, ['query'], function(data) {
		logExec(null, data, null);
		$scope.$apply(function(){
			$scope.stdout+=data;
		});
	}, function(data) {
		logExec(null, null, data);
		$scope.$apply(function(){
			$scope.stderr+=data;
		});
	});
	$scope.pid = $scope.child.pid;


};
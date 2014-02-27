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

var spawn = function(cmd, args, fnStdOut, fnStdErr, onExit) {
	var result = child_process.spawn(cmd, args);
	result.on('exit', function(code) {
		console.log('child process exited with code ' + code);
		if (onExit)
			onExit(code);
	});
	result.stdout.on('data', fnStdOut);
	result.stderr.on('data',function(data){
		logExec(null,null,data);
		fnStdErr(data);
	});
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
String.prototype.after = function(delimiter) {
	return this.substring(this.indexOf(delimiter) + delimiter.length);
};
String.prototype.before = function(delimiter) {
	return this.substring(0, this.indexOf(delimiter));
};
String.prototype.splitLines = String.prototype.splitLines || function() {
	return this.match(/[^\r\n]+/g);
};
String.prototype.contains = String.prototype.contains || function(searchStr) {
	return this.search(new RegExp(searchStr, "i")) >= 0;
};
Array.prototype.contains = Array.prototype.contains || function(item, predicate) {
	if (!predicate) {
		console.log('no predicate using default strategy for:' + item);
		return this.indexOf(item) >= 0;
	} else
		for (var i = 0; i < this.length; i++) {
			if (predicate.call(this[i], item)) {
				return true;
			}
		};
	return false;
};
var groupLinesBy = function(strings, delimiter) {
	var result = [];
	var current = [];
	for (var i = 0; i < strings.length; i++) {
		if (!current || current.length === 0) {
			current.push(strings[i]);
		} else if (strings[i].indexOf(delimiter) >= 0) {
			if (current.length > 0) {
				result.push(current);
				current = [strings[i]];
			} else {
				current.push(strings[i]);
			}
		} else {
			current.push(strings[i]);
		}
	}
	if (current.length > 0)
		result.push(current);
	return result;
};
var HellonodewebkitCtrl = function($scope) {

	window.$scope = $scope;



	$scope.sc = function() {
		$scope.stdout = '';
		$scope.stderr = '';
		$scope.host = !$scope.server || $scope.server === "localhost" ? null : $scope.server;
		delete $scope.exitCode;

		delete $scope.grouped;
		delete $scope.pid;
		var processScOutput = function(data) {
			//process all data that came out while the program was running

			var grouped = groupLinesBy(Enumerable.From($scope.stdout.splitLines()).ToArray(), "SERVICE_NAME");
			//console.log('grouped:' + grouped);
			var IisServiceNames = ["WMSVC", "WAS", "W3SVC", "MsDepSvc", "WinRm", "msvsmon120"];
			var shaped = Enumerable.From(grouped).Select(function(x) {
				//console.log('in select x is:');
				//console.log(x);
				var unmapped = x.slice(5).join(';');
				var pid = unmapped.contains('PID') ? unmapped.after('PID').after(':').before(";") : null;
				var item = {
					serviceName: x[0].after(':'),
					displayName: x[1].after(':'),
					state: x[3].after(':') + x[4],
					type: x[2].after(':'),
					pid: pid,
					unmapped: unmapped
				};
				if(/\sRUNNING\s/.test(item.state)){
					item.stateCss="running";
				} else if (/\sSTOPPED\s/.test(item.state)){
					item.stateCss="stopped";
				} else if(/\sSTOP_PENDING\s/.test(item.state)){
					item.stateCss="stoppending";
				} else if(/\sSTART_PENDING\s/.test(item.state)){
					item.stateCss="startpending";
				}
					
				

				if (IisServiceNames.contains(item.serviceName.trim(), String.prototype.contains)) {
					item.css = "iis";
				}
				return item;
			});
			$scope.missing=Enumerable.From(IisServiceNames).Where(function(i){
				return shaped.Any(function(s){
					return s.serviceName.contains(i);
				})==false;	
			}).ToArray();
			$scope.grouped = shaped.ToArray();
			//console.log('shaped:' + shaped);
		};
		var args = [];
		if ($scope.host) {
			args.push('\\\\' + $scope.host);
		}
		args.push('queryex');
		//even non-active services
		args.push('state=');
		args.push('all');
		//args.push('');
		$scope.cmd= 'sc '+args.join(' ');

		$scope.child = spawn('sc', args, function(data) {

			$scope.$apply(function() {
				$scope.stdout += data;
				//console.log('data recieved');
			});
		}, function(data) {

			$scope.$apply(function() {
				$scope.stderr += data;
			});
		}, function(code) {
			$scope.$apply(function() {
				$scope.exitCode = code;
				processScOutput();
			});
		});

		$scope.pid = $scope.child.pid;
	};



};
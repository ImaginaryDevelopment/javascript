//https://docs.c9.io/writing_nodejs_hello_world.html
// npm install haml
var http = require('http');
var fs = require('fs');
var Jade = require('jade');
var express= require('express');
console.log(process.cwd());
var htmlDir= process.cwd()+'/html/';
var jadeDir= htmlDir+'jade/';
var sampleJade=jadeDir+'index.jade';
console.log('haml:'+sampleJade);
var jade = fs.readFileSync(sampleJade, 'utf8');
var dirList=fs.readdirSync(process.cwd());
console.log('dir:'+dirList.toString());
console.log('jade len:'+jade.length);
var app = express()
/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')


var app = express()

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

//app.set('views', __dirname + '/views')
app.set('views',jadeDir)
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.render('index',
  { title : 'Home' }
  )
})

app.listen(process.env.C9_PORT)
'use strict';

var http = require('http');
var assert = require('assert');

var obj = {};
for (var i = 0; i < 1000; i++) {
  obj[i] = i * i;
}

var a = function () {
  var ret = 0;
  for (var key in obj) { // for in不优化
    ret += obj[key];
  }
  return ret;
};

var b = function () {
  var ret = 0;
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    ret += obj[keys[i]];
  }
  return ret;
};

assert(a() === b());

http.createServer(function (req, res) {
  res.writeHead(200);
  if (req.url === '/a') {
    res.end('value is: ' + a());
  } else {
    res.end('value is: ' + b());
  }
}).listen(1334);


// var Benchmark = require('benchmark');

// var suite = new Benchmark.Suite();

// // add tests
// suite.add('A', function() {
//   a();
// })
// .add('B', function() {
//   b();
// })
// // add listeners
// .on('cycle', function(event) {
//   console.log(String(event.target));
// })
// .on('complete', function() {
//   console.log('Fastest is ' + this.filter('fastest').pluck('name'));
// })
// // run async
// .run({ 'async': true });

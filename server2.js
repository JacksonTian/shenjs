'use strict';

var http = require('http');

function leaksArguments1() {
  return arguments;
}

function leaksArguments2() {
  return [].slice.call(arguments);
}

function leaksArguments3() {
  var a = arguments;
  return function() {
      return a;
  };
}

// The arguments object must not be passed or leaked anywhere.

// Workaround for proxying is to create array in-line:

function doesntLeakArguments() {
  //.length is just an integer, this doesn't leak
  //the arguments object itself
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    //i is always valid index in the arguments object
    args[i] = arguments[i];
  }
  return args;
}

var add = function (list) {
  var ret = 0;
  for (var i = 0; i < list.length; i++) {
    ret += list[i];
  }
  return ret;
};

http.createServer(function (req, res) {
  res.writeHead(200);
  if (req.url === '/a') {
    res.end('value is: ' + add(leaksArguments1(1, 2, 3, 4)));
  } else if (req.url === '/b') {
    res.end('value is: ' + add(leaksArguments2(1, 2, 3, 4)));
  } else if (req.url === '/c') {
    res.end('value is: ' + add(leaksArguments3(1, 2, 3, 4)()));
  } else {
    res.end('value is: ' + add(doesntLeakArguments(1, 2, 3, 4)));
  }
}).listen(1334);

var Benchmark = require('benchmark');

var suite = new Benchmark.Suite();

// add tests
suite.add('A', function() {
  leaksArguments1(1, 2, 3, 4);
})
.add('B', function() {
  leaksArguments2(1, 2, 3, 4);
})
.add('C', function() {
  leaksArguments3(1, 2, 3, 4);
})
.add('D', function() {
  doesntLeakArguments(1, 2, 3, 4);
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });

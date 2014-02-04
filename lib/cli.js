#!/usr/bin/env node

var argv, data, done, execFunction, fs, functions, optimist, pairs, params, recipePath, skrap, writeData, _i, _len, _ref;

skrap = require('./skrap');

fs = require("fs");

optimist = require("optimist");

argv = optimist.usage('Usage: $0 json_recipe_file param1=value param2=value ... [options]').alias('d', 'destination').describe('d', 'destination json file')["default"]('d', 'skrap.json').alias('t', 'timeout').describe('t', 'number of miliseconds to wait between pages scraped')["default"]('t', '1000').argv;

recipePath = argv._[0];

if (!recipePath) {
  optimist.showHelp();
  process.exit(1);
}

data = {};

functions = [];

done = 0;

params = {};

_ref = argv._.slice(1);
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  pairs = _ref[_i];
  pairs = pairs.split("=");
  params[pairs[0]] = pairs[1];
}

skrap(recipePath, params, function(_data, _functions) {
  var func, i, _j, _len1, _results;
  data = _data;
  if (_functions.length > 0) {
    functions = _functions;
    _results = [];
    for (i = _j = 0, _len1 = functions.length; _j < _len1; i = ++_j) {
      func = functions[i];
      _results.push(execFunction(func, i));
    }
    return _results;
  } else {
    return writeData();
  }
});

writeData = function() {
  data = JSON.stringify(data, null, 4);
  return fs.writeFile(argv.d, data, function(err) {
    if (err) {
      return console.log(err);
    } else {
      return console.log("scraped data saved to " + argv.d);
    }
  });
};

execFunction = function(func, i) {
  return setTimeout(function() {
    return func(function() {
      done++;
      console.log("" + done + " extra pages of " + functions.length + " scraped");
      if (done === functions.length) {
        return writeData();
      }
    });
  }, i * 1000);
};
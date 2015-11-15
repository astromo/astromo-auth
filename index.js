'use strict';

var app = require('./worker');
var cluster = require('cluster');
var debug = require('debug')('auth:master');

process.env.PORT = process.env.PORT || 3000;

if (cluster.isMaster) {
  var numWorkers = process.env.NUM_THREADS || require('os').cpus().length;
  debug('Will listen on http://0.0.0.0:%d', process.env.PORT);

  for (var i = 0; i < numWorkers; i++) {
    debug('Forking process %d ...', i);
    cluster.fork(process.env);
  }
} else {
  app.listen(process.env.PORT, function(err) {
    if (err) throw err;
    debug('Worker %d is listening', process.pid);
  });
}

cluster.on('exit', function(worker, code, signal) {
  debug('worker %d died (%s). restarting...',
    worker.process.pid,
    signal || code);

  cluster.fork(process.env);
});

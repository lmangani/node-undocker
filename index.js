/*
 * DockerBash: Install a Dockerfile to a real system
 *
 */

var fs = require('fs')
var parse = require('dockerfile-parse')
var exeq = require('exeq');

var dockerFile = fs.readFileSync(__dirname + '/Dockerfile', 'utf8')
var docker = parse(dockerFile)
 
console.dir(docker)

var install =
 exeq(docker.run[0])
   .then(function(results) {
     if (debug) console.log(results);
     console.log('Dockerfile Executed!');
     exeq(docker.entrypoint)
	.then(function(results) {
	  console.log('Entrypoint Executed!');
	}).catch(function(err) {
	  console.log(err);
	});
  }).catch(function(err) {
    console.log(err);
  });



/*
 * DockerBash: Install a Dockerfile to a real system
 *
 */

var fs = require('fs');
var parse = require('dockerfile-parse');
var exeq = require('exeq');
var getos = require('getos');
var debug = false;

var doExit = function(msg){
    console.log(msg);
    process.exit(1);
}

var dockerFile = fs.readFileSync(__dirname + '/Dockerfile', 'utf8');
if (!dockerFile||dockerFile == undefined) {
        doExit('Missing Dockerfile');
}
var docker = parse(dockerFile);
if (debug) console.dir(docker);
var from = docker.from.split(':');

var install = function() {
 exeq(docker.run[0])
   .then(function(results) {
     if (debug) console.log(results);
     if (debug) console.log('Dockerfile Executed!');
     if (docker.entrypoint) {
      exeq(docker.entrypoint)
	.then(function(results) {
	  if (debug) console.log('Entrypoint Executed!',results);
	}).catch(function(err) {
	  console.log(err);
      });
     } else if (docker.cmd) {
      exeq(docker.cmd)
	.then(function(results) {
	  if (debug) console.log('CMD Executed!',results);
	}).catch(function(err) {
	  console.log(err);
      });
     }
  }).catch(function(err) {
    console.log(err);
  });
}

getos(function(e,os) {
  if(e) { console.log(e); process.exit(1); }
  console.log("Your OS is:",os.dist, os.release);
  if (from[0].toLowerCase().indexOf( os.dist.toLowerCase() ) == -1) {
	doExit('OS Mismatch! '+os.dist);
  }
  if ( (from[1] && os.release) && from[1].toString() != os.release ) {
	doExit('OS Release Mismatch! '+os.release);
  }
  install()
});

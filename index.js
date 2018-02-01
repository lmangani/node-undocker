/*
 * DockerBash: Install a Dockerfile to a real system
 *
 */

var fs = require('fs');
var parse = require('dockerfile-parse');
var exeq = require('exeq');
var getos = require('getos');
var debug = false;

var dockerFile = fs.readFileSync(__dirname + '/Dockerfile', 'utf8');
if (!dockerFile||dockerFile == undefined) {
        console.log('Missing Dockerfile');
	process.exit(1);
}
var docker = parse(dockerFile);

if (debug) console.dir(docker);

getos(function(e,os) {
  if(e) { console.log(e); process.exit(1); }
  console.log("Your OS is:",os.dist);
  if (docker.from.toLowerCase().indexOf( os.dist.toLowerCase() ) == -1) {
    console.log('OS Mismatch!',docker.from);
    process.exit(1);
  }
})

var install =
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



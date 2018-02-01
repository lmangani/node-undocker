/*
 * DockerBash: Install a Dockerfile to a real system
 *
 */

var fs = require('fs');
var parse = require('dockerfile-parse');
var exeq = require('exeq');
var getos = require('getos');

var dockerFile = fs.readFileSync(__dirname + '/Dockerfile', 'utf8');
if (!dockerFile||dockerFile == undefined) {
        console.log('Missing Dockerfile');
	process.exit(1);
}
var docker = parse(dockerFile);

console.dir(docker);

getos(function(e,os) {
  if(e) { console.log(e); process.exit(1); }
  console.log("Your OS is:",os.dist);
  if (dockerfile.from.toLowerCase().indexOf( osName(os.dist.toLowerCase()) ) == -1) {
    console.log('OS Mismatch!',dockerfile.from);
    process.exit(1);
  }
})

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



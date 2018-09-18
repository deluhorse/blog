/**
 * @author: delu
 * @file: app.js
 * @time: 18/9/1 07:33
 */
const fs = require('fs');

var result = JSON.parse(fs.readFileSync('/apps/conf/blog/blog_web.json'));

console.log(result);

var argv = process.argv;
var argvLen = argv.length;
if (argvLen < 2) {
    console.error('create server failed, params error');
    return false;
}

var port = parseInt(result.port);
var host = 'http://localhost:3000';

for (var i = 0; i < argvLen; i++) {

    switch (argv[i]) {
        case '-p':
            port = argv[i + 1];
            break;
        case '-h':
            var host_key = argv[i + 1];
            host = result[host_key];
            break;
    }
}

console.log(`${host} ${port}`);

fs.writeFile('config.js', 'var host = "${host}/api/v3";'.replace('${host}', host), function (err) {
    if (err){
        return console.error(err);
    }
});
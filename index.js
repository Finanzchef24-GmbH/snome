var program = require('commander'),
    Netmask = require('netmask').Netmask,
    Promise = require('bluebird'),
    netrange = require('netrange'),
    lib = require('./lib');

var block,
    ips = [],
    concurrency = 128;

program
    .option('-b, --block [block]', 'IP Block')
    .parse(process.argv);

if (!program.block) {
    console.log('Specify ip block!');
    return;
}

block = new Netmask(program.block);

block.forEach(function(ip) {
    ips.push(ip);
});

Promise.map(ips, function(ip) {
    return lib.executeCommand('reboot', ip).then(console.log.bind(console))
        .catch(function(err) {
            console.log('Error ' + err + ' for ip ' + ip);
        });
}, {concurrency});
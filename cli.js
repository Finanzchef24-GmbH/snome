#! /usr/bin/env node
'use strict';

var _ = require('lodash'),
    Promise = require('bluebird'),
    program = require('commander'),
    Netmask = require('netmask').Netmask,
    netrange = require('netrange'),
    lib = require('./lib');

var ips = [],
    concurrency = 128,
    ipMappers = {
      ip: function(ip) {
        ips.push(ip);
      },
      block: function(cidrBlock) {
        cidrBlock = new Netmask(cidrBlock);

        cidrBlock.forEach(function(ip) {
          ips.push(ip);
        });
      },
      range: function(range) {
        ips = netrange(range[0], range[1]);
      }
    },
    command;

program
    .version('0.0.1')
    .arguments('<cmd> [parameters...]')
    .option('-b, --block <block>', 'CIDR Block')
    .option('-r, --range <from>..<to>', 'range of IPs', function range(val) {
      return val.split('..');
    })
    .option('-i, --ip <ip>', 'single IP Address');

program.on('--help', function() {
  console.log('Possible commands: ' + Object.keys(lib.urls).join(','))
});

program.parse(process.argv);

if (!program.range && !program.ip && !program.block) {
  console.error('You have to specificy at least one IP address, an IP range or a CIDR block.');
  process.exit(1);
}

_.each(Object.keys(ipMappers), function(type) {
  if (program[type]) {
    ipMappers[type](program[type]);
  }
});

command = program.args[0];
program.args.shift();

return Promise.map(ips, function(ip) {
  return lib.executeCommand(command, ip, program.args).then(console.log.bind(console))
      .catch(function(err) {
        console.error('Error ' + err + ' for ip ' + ip);
      });
}, {concurrency}).return(0);

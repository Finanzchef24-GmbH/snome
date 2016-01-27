'use strict';

var util = require('util'),
    config = require('@fc24/config'),
    request = require('request-promise');

var snomConfig = config('snom'),
    urls = {
        dial: '/command.htm?number=%s&outgoing_uri=%s',
        reboot: '/advanced_update.htm?reboot=Reboot',
        reset: '/advanced_update.htm?reset=Reset',
        upgrade: '/dummy.htm?swload=load&firmware=%s'
    };

function executeCommand(type, ip, args) {
    var url,
        timeout = 5000,
        command = urls[type];

    if (!command) {
        throw new Error('command not supported');
    }

    command = util.format.bind(null, urls[type]).apply(null, args);
    url = util.format('http://%s:%s@%s%s', snomConfig.user, snomConfig.password, ip, command);

    return request({url, timeout})
        .then(function(body) {
            return body;
        });
}

module.exports = {
    executeCommand
};
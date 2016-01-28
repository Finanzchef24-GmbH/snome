'use strict';

var util = require('util'),
    config = require('@fc24/config'),
    request = require('request-promise');

var snomConfig = config('snom'),
    urls = {
        key: '/command.htm?key=%s',
        dial: '/command.htm?number=%s&outgoing_uri=%s',
        reboot: '/advanced_update.htm?reboot=Reboot',
        reset: '/advanced_update.htm?reset=Reset',
        upgrade: '/dummy.htm?swload=load&firmware=%s'
    },
    acceptedKeys = /CANCEL|ENTER|OFFHOOK|ONHOOK|RIGHT|LEFT|UP|DOWN|VOLUME_UP|VOLUME_DOWN|MENU|REDIAL|DND|REC|F[1-4]|SPEAKER|HEADSET|TRANSFER|F_HOLD|[0-9]|P^([1-9]|1[0-5])/;

function validateArgs(command, args) {
    if (command === 'key') {
        return acceptedKeys.test(args[0]);
    }
}

function executeCommand(type, ip, args) {
    var url,
        timeout = 5000,
        command = urls[type];

    if (!command) {
        console.error('Command ' + type + ' not supported');
        process.exit(1);
    }

    if (!validateArgs(type, args)) {
        console.error('Arguments not permitted');
        process.exit(1)
    }

    command = util.format.bind(null, urls[type]).apply(null, args);
    url = util.format('http://%s:%s@%s%s', snomConfig.user, snomConfig.password, ip, command);

    return request({url, timeout})
        .then(function(body) {
            return body;
        });
}

module.exports = {
    executeCommand,
    urls
};

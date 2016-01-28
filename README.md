# snome
Control your SNOM VoIP phones with nodejs.

## Installation
If you want to use snome as a CLI tool, than install it globally with:
```
npm i -g snome
```

If you want to use snome's functionality inside your node package or app, install it via:
```
npm i -S snome
```

## Usage
Call ```executeCommand(command, ip, args)``` with one of the following currently supported commands: key,dial,reboot,reset,upgrade as first argument.

The seconds argument is the ip of the phone. The third parameter is an array of parameters which should be passed on to the snom command, according to the snom documentation:
http://wiki.snom.com/FAQ/Can_I_control_my_snom_phone_remotely.

Example:
```
var snome = require('snome'),
    ip = '192.168.0.30';

//reboot the phone with ip 192.168.0.30
return snome.executeCommand('reboot', ip).then(function(body) {
  console.log('response', body);
  
  //wait 20 seconds for reboot, then simulate pressing 'F1' key
  setTimeout(function() {
    return snome.executeCommand('key', ip, 'F1');
  }, 20000);
});
```

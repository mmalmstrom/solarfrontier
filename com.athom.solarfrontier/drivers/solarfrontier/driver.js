'use strict';

const Homey = require('homey');
const fetch = require('node-fetch');

class SolarFrontier extends Homey.Driver {

    onPair(socket) {
        socket.on('validate', (device, callback) => {
            const validationUrl = `http://${device.settings.ip}`;

            fetch(validationUrl)
                .then(result => {
                    if (result.ok) {
                        callback(null, true);
                    } else {
                        callback(new Error(Homey.__('login_error')));
                    }
                }).catch(error => {
                    callback(new Error(Homey.__('ip_error')));
                });
        });
    }
}

module.exports = SolarFrontier;;
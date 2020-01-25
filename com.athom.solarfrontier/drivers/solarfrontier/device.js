'use strict';

const Inverter = require('../inverter');
const fetch = require('node-fetch');

const pathName = '/gen.measurements.table.js';

class SolarFrontier extends Inverter {
    getCronString() {
         return '*/30    * * * * *';
    }

    checkProduction() {
        this.log('Checking production');

        const settings = this.getSettings();
        var dataUrl = `http://${settings.ip}${pathName}`;

        fetch(dataUrl)
            .then(result => {
                if (result.ok) {
                    if (!this.getAvailable()) {
                        this.setAvailable().then(_ => {
                            this.log('Available');
                        }).catch(error => {
                            this.error('Setting availability failed');
                        })
                    }

                    return result.text();
                } else {
                    throw result.status;
                }
            })
            .then(body => {
                var text = body.replace(/---/g, "0.0");
                var re = /P DC\D*(\d*\.\d*)/g;
                var match = re.exec(text);
                let currentPower;
                currentPower = Number(match[1]);

                this.setCapabilityValue('measure_power', currentPower);
                this.log(`Current power is ${currentPower}W`);
            })
            .catch(error => {
                this.log(`Unavailable (${error})`);
                this.setUnavailable(`Error retrieving data (${error})`);
            });
    }
}

module.exports = SolarFrontier;
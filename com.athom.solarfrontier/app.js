'use strict';

const Homey = require('homey');

class SolarFrontierApp extends Homey.App {
	
	onInit() {
		this.log('Solar Frontier app is running...');
	}
	
}

module.exports = SolarFrontierApp;
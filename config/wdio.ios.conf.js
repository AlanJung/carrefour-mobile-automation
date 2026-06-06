// NOTA: Testes iOS exigem macOS. Este arquivo é fornecido para referência.
// No Windows, use wdio.android.conf.js ou wdio.browserstack.ios.conf.js.

const { config: sharedConfig } = require('./wdio.shared.conf');
const path = require('path');

const ipaPath = path.resolve(__dirname, '../apps/ios/app-release.app');

exports.config = {
    ...sharedConfig,

    port: 4723,
    services: ['appium'],
    appium: {
        command: 'appium',
    },

    capabilities: [
        {
            platformName: 'iOS',
            'appium:automationName': 'XCUITest',
            'appium:deviceName': 'iPhone 15',
            'appium:platformVersion': '17.0',
            'appium:app': ipaPath,
            'appium:bundleId': 'org.wdioNativeDemoApp',
            'appium:noReset': false,
            'appium:newCommandTimeout': 240,
        },
    ],
};

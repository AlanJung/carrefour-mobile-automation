const { config: sharedConfig } = require('./wdio.shared.conf');
const path = require('path');

const BS_USER = process.env.BROWSERSTACK_USER;
const BS_KEY = process.env.BROWSERSTACK_KEY;
const BS_APP_ID = process.env.BROWSERSTACK_APP_ID; // ID do app após upload via API

exports.config = {
    ...sharedConfig,

    user: BS_USER,
    key: BS_KEY,

    hostname: 'hub.browserstack.com',
    port: 443,
    protocol: 'https',
    path: '/wd/hub',

    services: [
        [
            '@browserstack/wdio-browserstack-service',
            {
                testObservability: true,
                testObservabilityOptions: {
                    projectName: 'Carrefour Mobile Automation',
                    buildName: `Android - ${new Date().toISOString().split('T')[0]}`,
                },
            },
        ],
    ],

    capabilities: [
        {
            platformName: 'Android',
            'appium:automationName': 'UIAutomator2',
            'appium:deviceName': 'Google Pixel 6',
            'appium:platformVersion': '12.0',
            'appium:app': BS_APP_ID,
            'bstack:options': {
                projectName: 'Carrefour Mobile Automation',
                buildName: `Android Build - ${new Date().toISOString().split('T')[0]}`,
                sessionName: 'Android Smoke Tests',
                networkLogs: true,
                deviceLogs: true,
                appiumLogs: true,
            },
        },
    ],
};

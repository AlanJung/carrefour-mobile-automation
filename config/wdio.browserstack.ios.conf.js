require('dotenv').config();
const { config: sharedConfig } = require('./wdio.shared.conf');

const BS_USER = process.env.BROWSERSTACK_USER;
const BS_KEY = process.env.BROWSERSTACK_KEY;
const BS_APP_ID = process.env.BROWSERSTACK_IOS_APP_ID;

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
                    buildName: `iOS - ${new Date().toISOString().split('T')[0]}`,
                },
            },
        ],
    ],

    capabilities: [
        {
            platformName: 'iOS',
            'appium:automationName': 'XCUITest',
            'appium:deviceName': 'iPhone 15',
            'appium:platformVersion': '17',
            'appium:app': BS_APP_ID,
            'bstack:options': {
                projectName: 'Carrefour Mobile Automation',
                buildName: `iOS Build - ${new Date().toISOString().split('T')[0]}`,
                sessionName: 'iOS Smoke Tests',
                networkLogs: true,
                deviceLogs: true,
                appiumLogs: true,
            },
        },
    ],
};

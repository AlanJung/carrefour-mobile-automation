const { config: sharedConfig } = require('./wdio.shared.conf');
const path = require('path');
const fs = require('fs');

const apkPath = path.resolve(__dirname, '../apps/android/app-release.apk');
const allureResultsDir = path.resolve(__dirname, '../.allure-results');

exports.config = {
    ...sharedConfig,

    port: 4723,
    services: ['appium'],
    appium: {
        command: 'appium',
    },

    capabilities: [
        {
            platformName: 'Android',
            'appium:automationName': 'UIAutomator2',
            'appium:deviceName': 'Pixel_6_API_34',
            'appium:platformVersion': '14.0',
            'appium:app': apkPath,
            'appium:appPackage': 'com.wdiodemoapp',
            'appium:appActivity': 'com.wdiodemoapp.MainActivity',
            'appium:noReset': false,
            'appium:fullReset': false,
            'appium:newCommandTimeout': 240,
            'appium:autoGrantPermissions': true,
            'appium:chromedriverAutoDownload': true,
        },
    ],

    // Escreve informações do ambiente para o Allure Report
    before: async function () {
        if (!fs.existsSync(allureResultsDir)) {
            fs.mkdirSync(allureResultsDir, { recursive: true });
        }
        const envProps = [
            'Platform=Android 14 (API 34)',
            'Device=Pixel 6 (Emulador)',
            'App=native-demo-app v1.0.8',
            'Automation=UIAutomator2',
            'Framework=WebdriverIO + Appium',
        ].join('\n');
        fs.writeFileSync(path.join(allureResultsDir, 'environment.properties'), envProps);
    },
};

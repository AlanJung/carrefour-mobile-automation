const path = require('path');
const fs = require('fs');
const allureReporter = require('@wdio/allure-reporter').default;

const projectRoot = path.resolve(__dirname, '..');
const screenshotsDir = path.join(projectRoot, 'reports', 'screenshots');

exports.config = {
    runner: 'local',

    specs: [path.join(projectRoot, 'test', 'specs', '**', '*.spec.js')],
    exclude: [],

    maxInstances: 1,

    logLevel: 'info',
    bail: 0,

    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },

    reporters: [
        'spec',
        [
            'allure',
            {
                outputDir: path.join(projectRoot, '.allure-results'),
                disableWebdriverStepsReporting: false,
                disableWebdriverScreenshotsReporting: false,
                useCucumberStepReporter: false,
            },
        ],
    ],

    afterTest: async function (test, context, { error }) {
        if (error) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const testName = test.title.replace(/\s+/g, '_').substring(0, 60);
            const screenshotPath = path.join(screenshotsDir, `${testName}-${timestamp}.png`);

            if (!fs.existsSync(screenshotsDir)) {
                fs.mkdirSync(screenshotsDir, { recursive: true });
            }

            const screenshot = await browser.takeScreenshot();
            fs.writeFileSync(screenshotPath, screenshot, 'base64');

            allureReporter.addAttachment(
                `Screenshot: ${test.title}`,
                Buffer.from(screenshot, 'base64'),
                'image/png'
            );
        }
    },
};

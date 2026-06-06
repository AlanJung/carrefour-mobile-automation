class BasePage {
    async waitForElement(selector, timeout = 15000) {
        const el = await $(selector);
        await el.waitForDisplayed({ timeout });
        return el;
    }

    async click(selector) {
        const el = await this.waitForElement(selector);
        await el.click();
    }

    async setValue(selector, value) {
        const el = await this.waitForElement(selector);
        await el.clearValue();
        await el.setValue(value);
    }

    async getText(selector) {
        const el = await this.waitForElement(selector);
        return el.getText();
    }

    async isDisplayed(selector, timeout = 5000) {
        try {
            const el = await $(selector);
            return el.waitForDisplayed({ timeout });
        } catch {
            return false;
        }
    }

    async hideKeyboard() {
        try {
            await driver.hideKeyboard();
        } catch {
            // teclado já estava escondido
        }
    }

    async swipeUp() {
        const { width, height } = await driver.getWindowSize();
        await driver.action('pointer', { parameters: { pointerType: 'touch' } })
            .move({ x: Math.round(width / 2), y: Math.round(height * 0.8) })
            .down()
            .move({ x: Math.round(width / 2), y: Math.round(height * 0.2), duration: 600 })
            .up()
            .perform();
    }

    async swipeDown() {
        const { width, height } = await driver.getWindowSize();
        await driver.action('pointer', { parameters: { pointerType: 'touch' } })
            .move({ x: Math.round(width / 2), y: Math.round(height * 0.2) })
            .down()
            .move({ x: Math.round(width / 2), y: Math.round(height * 0.8), duration: 600 })
            .up()
            .perform();
    }
}

module.exports = BasePage;

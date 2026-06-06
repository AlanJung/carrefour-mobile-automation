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
        const el = await $(selector);
        // Rola o elemento até a visão (no device real pode estar abaixo da dobra)
        await el.scrollIntoView().catch(() => {});
        await el.waitForDisplayed({ timeout: 15000 });
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
        // 1ª tentativa: comando padrão do Appium
        try {
            await driver.hideKeyboard();
        } catch {
            // ignora — pode não haver teclado ou o comando não ser suportado
        }
        // 2ª tentativa (fallback Android): tecla Back fecha o teclado de forma confiável
        try {
            if (await driver.isKeyboardShown()) {
                await driver.pressKeyCode(4); // KEYCODE_BACK
                await driver.pause(300);
            }
        } catch {
            // isKeyboardShown/pressKeyCode pode não estar disponível — segue o fluxo
        }
    }
}

module.exports = BasePage;

const BasePage = require('./base.page');

class LoginPage extends BasePage {
    get screen()        { return $('~Login-screen'); }
    get emailField()    { return $('~input-email'); }
    get passwordField() { return $('~input-password'); }
    get loginButton()   { return $('~button-LOGIN'); }
    get loginTab()      { return $('~button-login-container'); }
    get signUpTab()     { return $('~button-sign-up-container'); }

    // Seletor XPath para mensagens de erro inline do formulário
    get inlineError()   { return $('//*[contains(@text,"Please enter")]'); }

    async open() {
        await driver.activateApp('com.wdiodemoapp');
        await $('~Login').click();
        await this.waitForElement('~Login-screen');
    }

    async resetApp() {
        await driver.terminateApp('com.wdiodemoapp');
        await driver.activateApp('com.wdiodemoapp');
        await driver.pause(1500);
    }

    async login(email, password) {
        await this.loginTab.click();
        await driver.pause(400);
        if (email) await this.setValue('~input-email', email);
        if (password) await this.setValue('~input-password', password);
        await this.hideKeyboard();
        await this.click('~button-LOGIN');
        await driver.pause(1500);
    }

    // Verifica mensagem de erro inline (validação de formulário)
    async isInlineErrorDisplayed() {
        try {
            const el = await this.inlineError;
            return el.isDisplayed();
        } catch {
            return false;
        }
    }

    async getInlineErrorMessage() {
        const el = await this.inlineError;
        return el.getText();
    }

    // Verifica alerta nativo (ex: "Success" ou erros de servidor)
    async isAlertDisplayed() {
        try {
            await driver.getAlertText();
            return true;
        } catch {
            return false;
        }
    }

    async getAlertMessage() {
        return driver.getAlertText();
    }

    async dismissAlert() {
        try { await driver.acceptAlert(); } catch { /* sem alerta */ }
    }

    async isScreenDisplayed() {
        return this.isDisplayed('~Login-screen', 8000);
    }
}

module.exports = new LoginPage();

const BasePage = require('./base.page');

class LoginPage extends BasePage {
    get screen()           { return $('~Login-screen'); }
    get emailField()       { return $('~input-email'); }
    get passwordField()    { return $('~input-password'); }
    get repeatPwdField()   { return $('~input-repeat-password'); }
    get loginButton()      { return $('~button-LOGIN'); }
    get signUpButton()     { return $('~button-SIGN UP'); }
    get loginTab()         { return $('~button-login-container'); }
    get signUpTab()        { return $('~button-sign-up-container'); }

    // Seletor XPath para mensagens de erro inline do formulário
    get inlineError()   { return $('//*[contains(@text,"Please enter")]'); }

    async resetApp() {
        await driver.terminateApp('com.wdiodemoapp');
        await driver.activateApp('com.wdiodemoapp');
        await driver.pause(1500);
    }

    async login(email, password) {
        await this.loginTab.click();
        await driver.pause(400);
        // Preenche e esconde o teclado entre os campos — no device real o teclado
        // cobre o campo seguinte, deixando-o "não exibido".
        if (email) {
            await this.setValue('~input-email', email);
            await this.hideKeyboard();
        }
        if (password) {
            await this.setValue('~input-password', password);
            await this.hideKeyboard();
        }
        await this.clickLoginButton();
        await driver.pause(1500);
    }

    // Clica no botão LOGIN garantindo que está visível (pode estar abaixo da dobra)
    async clickLoginButton() {
        const loginBtn = await $('~button-LOGIN');
        await loginBtn.scrollIntoView().catch(() => {});
        await this.click('~button-LOGIN');
    }

    // ─── Cadastro (Sign up) ──────────────────────────────────────────────────
    async signUp(email, password, confirmPassword) {
        await this.signUpTab.click();
        await driver.pause(400);
        // Esconde o teclado entre os campos (no device real ele cobre o campo seguinte)
        if (email) {
            await this.setValue('~input-email', email);
            await this.hideKeyboard();
        }
        if (password) {
            await this.setValue('~input-password', password);
            await this.hideKeyboard();
        }
        if (confirmPassword) {
            await this.setValue('~input-repeat-password', confirmPassword);
            await this.hideKeyboard();
        }
        await this.clickSignUpButton();
        await driver.pause(1500);
    }

    // Clica no botão SIGN UP garantindo que está visível
    async clickSignUpButton() {
        const btn = await $('~button-SIGN UP');
        await btn.scrollIntoView().catch(() => {});
        await this.click('~button-SIGN UP');
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

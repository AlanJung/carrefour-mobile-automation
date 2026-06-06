const BasePage = require('./base.page');

class WebviewPage extends BasePage {
    // A tela de WebView não expõe um content-desc próprio no nível nativo;
    // validamos pela aba selecionada e pelos contextos disponíveis.

    async isDisplayed() {
        const el = await $('~Webview');
        const selected = await el.getAttribute('selected');
        return selected === 'true' || selected === true;
    }

    // Retorna a lista de contextos (NATIVE_APP, WEBVIEW_*) como strings
    async getAvailableContexts() {
        const contexts = await driver.getContexts();
        return contexts.map((c) => c.toString());
    }

    async switchToWebContext() {
        await driver.pause(3000); // aguarda a WebView carregar
        const webCtx = (await this.getAvailableContexts()).find((c) => c.includes('WEBVIEW'));
        if (webCtx) {
            await driver.switchContext(webCtx);
        }
        return webCtx || null;
    }

    async switchToNativeContext() {
        await driver.switchContext('NATIVE_APP');
    }
}

module.exports = new WebviewPage();

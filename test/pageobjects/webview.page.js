const BasePage = require('./base.page');

class WebviewPage extends BasePage {
    // A tela de Webview não expõe um content-desc próprio no nível nativo
    // — verificamos pelo contexto e pelo estado das abas de navegação

    async isScreenDisplayed() {
        // Verifica que a aba Webview está selecionada
        const el = await $('~Webview');
        const selected = await el.getAttribute('selected');
        return selected === 'true' || selected === true;
    }

    async switchToWebContext() {
        await driver.pause(3000); // aguarda WebView carregar
        const contexts = await driver.getContexts();
        const webCtx = contexts.find(c => c.toString().includes('WEBVIEW'));
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

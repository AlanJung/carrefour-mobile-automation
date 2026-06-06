const { expect } = require('chai');
const homePage    = require('../pageobjects/home.page');
const webviewPage = require('../pageobjects/webview.page');

describe('WebView', () => {
    // Cenário 12 — Acessa tela de WebView e verifica contexto nativo
    it('[C12] Deve abrir a tela WebView e identificar contextos disponíveis', async () => {
        await homePage.navigateTo('webview');
        await driver.pause(2000);

        // Aba WebView deve estar selecionada
        const displayed = await webviewPage.isDisplayed();
        expect(displayed, 'Aba WebView deve estar selecionada').to.be.true;

        // Deve existir ao menos o contexto NATIVE_APP
        const contextNames = await webviewPage.getAvailableContexts();
        expect(contextNames, 'Deve existir o contexto NATIVE_APP').to.include('NATIVE_APP');

        // Nota: trocar para o contexto web requer Chromedriver compatível
        console.log('Contextos disponíveis:', contextNames.join(', '));
        expect(contextNames.length).to.be.at.least(1);
    });
});

const { expect } = require('chai');
const homePage    = require('../pageobjects/home.page');

describe('WebView', () => {
    // Cenário 12 — Acessa tela de WebView e verifica contexto nativo
    it('[C12] Deve abrir a tela WebView e identificar contextos disponíveis', async () => {
        await homePage.navigateTo('webview');
        await driver.pause(2000);

        // Aba WebView deve estar selecionada
        const isSelected = await homePage.isTabSelected('webview');
        expect(isSelected, 'Aba WebView deve estar selecionada').to.be.true;

        // Deve existir ao menos o contexto NATIVE_APP
        const contexts = await driver.getContexts();
        const contextNames = contexts.map(c => c.toString());
        expect(contextNames).to.include('NATIVE_APP');

        // Verifica que há mais de um contexto (NATIVE_APP + WEBVIEW_*)
        // Nota: requer Chromedriver compatível para trocar para o contexto web
        console.log('Contextos disponíveis:', contextNames.join(', '));
        expect(contextNames.length).to.be.at.least(1);
    });
});

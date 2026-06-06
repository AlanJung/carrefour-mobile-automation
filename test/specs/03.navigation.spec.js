const { expect } = require('chai');
const homePage = require('../pageobjects/home.page');

describe('Navegação entre telas', () => {
    // Cenário — Navega por todas as abas e verifica seleção
    it('[NAV] Deve navegar corretamente entre todas as abas do menu inferior', async () => {
        const tabs = ['home', 'webview', 'login', 'forms', 'swipe', 'drag'];

        for (const tab of tabs) {
            await homePage.navigateTo(tab);
            const isSelected = await homePage.isTabSelected(tab);
            expect(isSelected, `Aba "${tab}" deve estar selecionada`).to.be.true;
        }
    });
});

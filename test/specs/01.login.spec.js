const { expect } = require('chai');
const loginPage = require('../pageobjects/login.page');
const homePage  = require('../pageobjects/home.page');
const users     = require('../../data/users.json');

describe('Login', () => {
    beforeEach(async () => {
        // Reset completo do app para garantir estado limpo a cada cenário
        await loginPage.resetApp();
        await homePage.navigateTo('login');
    });

    // Cenário 1 — Login com credenciais válidas (data-driven)
    users.validUsers.forEach((user) => {
        it(`[C01] Login bem-sucedido com: ${user.email}`, async () => {
            await loginPage.login(user.email, user.password);

            // App exibe alerta nativo "Success\nYou are logged in!" após login válido
            const alertDisplayed = await loginPage.isAlertDisplayed();
            expect(alertDisplayed, 'Deve exibir alerta de sucesso').to.be.true;

            const alertText = await loginPage.getAlertMessage();
            expect(alertText).to.include('Success');
            expect(alertText).to.include('You are logged in!');

            await loginPage.dismissAlert();
        });
    });

    // Cenário 2 — Login com credenciais inválidas → erro inline (data-driven)
    users.invalidUsers.forEach((user) => {
        it(`[C02] Login inválido exibe erro para: ${user.description}`, async () => {
            await loginPage.login(user.email, user.password);

            // App exibe mensagem de erro INLINE (não é alerta nativo)
            const inlineErrorShown = await loginPage.isInlineErrorDisplayed();
            expect(inlineErrorShown, `Deve exibir erro inline para: ${user.description}`).to.be.true;

            const errorText = await loginPage.getInlineErrorMessage();
            expect(errorText).to.include(user.expectedError);
        });
    });

    // Cenário 3 — Login com campos vazios → erro inline
    it('[C03] Login com campos vazios exibe mensagem de validação', async () => {
        await loginPage.loginTab.click();
        await driver.pause(400);
        await loginPage.clickLoginButton();
        await driver.pause(1000);

        const inlineErrorShown = await loginPage.isInlineErrorDisplayed();
        expect(inlineErrorShown, 'Deve exibir erro inline para campos vazios').to.be.true;

        const errorText = await loginPage.getInlineErrorMessage();
        expect(errorText).to.include('Please enter');
    });
});

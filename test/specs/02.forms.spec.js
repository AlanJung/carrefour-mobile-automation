const { expect } = require('chai');
const homePage  = require('../pageobjects/home.page');
const formsPage = require('../pageobjects/forms.page');
const formData  = require('../../data/forms.json');

describe('Formulários', () => {
    before(async () => {
        await homePage.navigateTo('forms');
    });

    // Cenário 4 — Navegação para a tela de Forms
    it('[C04] Deve navegar para a tela de Forms com sucesso', async () => {
        const displayed = await formsPage.isScreenDisplayed();
        expect(displayed, 'Tela de Forms deve estar visível').to.be.true;
    });

    // Cenário 5 — Preenchimento do campo de texto (data-driven)
    formData.inputs.forEach((entry) => {
        it(`[C05] Campo de texto: deve exibir "${entry.text}"`, async () => {
            await formsPage.typeInInputField(entry.text);
            const result = await formsPage.getInputResult();
            expect(result).to.equal(entry.text);
        });
    });

    // Cenário 6 — Switch toggle: verificar mudança de estado
    it('[C06] Switch deve alternar o texto ao ser acionado', async () => {
        const before = await formsPage.getSwitchStatus();
        await formsPage.toggleSwitch();
        const after = await formsPage.getSwitchStatus();
        expect(after, 'Texto do switch deve mudar após o toque').to.not.equal(before);
        expect(after).to.satisfy(
            (t) => t.includes('OFF') || t.includes('ON'),
            'Texto deve indicar ON ou OFF'
        );
    });

    // Cenário 7 — Dropdown: selecionar uma opção e verificar valor na tela
    it('[C07] Dropdown deve exibir a opção selecionada', async () => {
        const option = 'Appium is awesome';
        await formsPage.selectDropdownOption(option);

        const source = await driver.getPageSource();
        expect(source).to.include(option, `Texto "${option}" deve aparecer na tela após seleção`);
    });

    // Cenário 8 — Botões Active/Inactive: verificar que estão visíveis e clicáveis
    it('[C08] Botões Active e Inactive devem estar visíveis e responder ao toque', async () => {
        // Garante visibilidade com scrollIntoView
        await $('~button-Active').scrollIntoView();
        await driver.pause(800);

        // Verifica visibilidade via atributo XML
        const activeDisplayed   = await $('~button-Active').getAttribute('displayed');
        const inactiveDisplayed = await $('~button-Inactive').getAttribute('displayed');
        expect(activeDisplayed,   'Botão Active deve estar visível').to.equal('true');
        expect(inactiveDisplayed, 'Botão Inactive deve estar visível').to.equal('true');

        // Clica em Active — aceita possível alerta ou mudança de estado
        await $('~button-Active').click();
        await driver.pause(600);
        try { await driver.acceptAlert(); } catch {}

        // Clica em Inactive — aceita possível alerta ou mudança de estado
        await $('~button-Inactive').scrollIntoView();
        await driver.pause(400);
        await $('~button-Inactive').click();
        await driver.pause(600);
        try { await driver.acceptAlert(); } catch {}

        // Verifica que a tela de Forms ainda está acessível
        const formsTab = await $('~Forms');
        const isFormsTabVisible = await formsTab.getAttribute('displayed');
        expect(isFormsTabVisible, 'Menu de navegação deve estar visível').to.equal('true');
    });
});

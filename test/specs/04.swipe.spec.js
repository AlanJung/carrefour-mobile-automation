const { expect } = require('chai');
const homePage  = require('../pageobjects/home.page');
const swipePage = require('../pageobjects/swipe.page');
const dragPage  = require('../pageobjects/drag.page');

describe('Gestos — Swipe Carousel e Drag & Drop', () => {

    // Cenário 9 — Swipe horizontal: validar todos os cards do carousel
    it('[C09] Deve navegar por todos os cards do carousel via swipe horizontal', async () => {
        await homePage.navigateTo('swipe');
        await driver.pause(1500);

        const titles = swipePage.cardTitles;

        // Primeiro card já visível
        expect(await swipePage.isCardVisible(titles[0]),
            `Card inicial "${titles[0]}" deve estar visível`).to.be.true;

        // Swipe à esquerda validando cada card seguinte
        for (let i = 1; i < titles.length; i++) {
            await swipePage.swipeCarousel('left');
            expect(await swipePage.isCardVisible(titles[i]),
                `Card "${titles[i]}" deve aparecer após swipe à esquerda`).to.be.true;
        }

        // Swipe à direita validando a navegação reversa até o primeiro
        for (let i = titles.length - 2; i >= 0; i--) {
            await swipePage.swipeCarousel('right');
            expect(await swipePage.isCardVisible(titles[i]),
                `Card "${titles[i]}" deve reaparecer após swipe à direita`).to.be.true;
        }
    });

    // Cenário 10 — Swipe vertical: encontrar o robô escondido
    it('[C10] Deve rolar para baixo e encontrar o robô escondido', async () => {
        await homePage.navigateTo('swipe');
        await driver.pause(1500);

        const found = await swipePage.scrollDownToFindRobot();
        expect(found, 'O robô com "You found me!!!" deve ser revelado ao rolar para baixo').to.be.true;

        const foundText = await swipePage.foundText.getText();
        expect(foundText).to.include('You found me');
    });

    // Cenário 11 — Drag & Drop completo
    it('[C11] Deve arrastar todos os itens para os alvos corretos', async () => {
        await homePage.navigateTo('drag');
        await driver.pause(1000);

        const displayed = await dragPage.isScreenDisplayed();
        expect(displayed, 'Tela Drag & Drop deve estar visível').to.be.true;

        await dragPage.completeAllDrags();

        const result = await dragPage.isSuccessDisplayed();
        expect(result, 'Resultado do Drag & Drop deve ser exibido').to.be.true;
    });
});

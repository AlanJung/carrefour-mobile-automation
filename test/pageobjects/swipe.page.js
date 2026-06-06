const BasePage = require('./base.page');

class SwipePage extends BasePage {
    get carousel()    { return $('~Carousel'); }
    get foundText()   { return $('//*[contains(@text,"You found me")]'); }

    // Títulos esperados dos cards do carousel, na ordem
    get cardTitles() {
        return [
            'FULLY OPEN SOURCE',
            'GREAT COMMUNITY',
            'JS.FOUNDATION',
            'SUPPORT VIDEOS',
            'EXTENDABLE',
        ];
    }

    async isScreenDisplayed() {
        return this.isDisplayed('~Carousel', 8000);
    }

    async _carouselArea() {
        const carousel = await $('~Carousel');
        await carousel.waitForDisplayed({ timeout: 8000 });
        const loc = await carousel.getLocation();
        const sz  = await carousel.getSize();
        return {
            left:   loc.x + Math.round(sz.width  * 0.1),
            top:    loc.y + Math.round(sz.height * 0.2),
            width:  Math.round(sz.width  * 0.8),
            height: Math.round(sz.height * 0.6),
        };
    }

    // Swipe horizontal no carousel: 'left' (próximo) ou 'right' (anterior)
    async swipeCarousel(direction) {
        const area = await this._carouselArea();
        await driver.execute('mobile: swipeGesture', {
            ...area, direction, percent: 0.9,
        });
        await driver.pause(1000);
    }

    // Verifica se um título de card está visível na tela
    async isCardVisible(title) {
        const src = await driver.getPageSource();
        return src.includes(title);
    }

    // Scroll vertical para baixo (dedo sobe) para revelar o robô escondido.
    // O reveal é sensível ao gesto e varia conforme a resolução do device, por isso
    // tentamos múltiplos perfis de swipe: faixa estreita central (funciona no
    // emulador) e swipes mais longos/largos (para dispositivos reais).
    async scrollDownToFindRobot(maxTries = 6) {
        const { width, height } = await driver.getWindowSize();
        const cx = Math.round(width * 0.5);

        // Perfis de gesto, do mais específico (emulador) ao mais amplo (device real)
        const profiles = [
            { left: cx - 80,  top: 0.55, width: 160,                       height: 0.35, percent: 0.95 },
            { left: cx - 150, top: 0.45, width: 300,                       height: 0.45, percent: 1.0  },
            { left: Math.round(width * 0.15), top: 0.35, width: Math.round(width * 0.7), height: 0.50, percent: 1.0 },
        ];

        for (let round = 0; round < maxTries; round++) {
            for (const p of profiles) {
                await driver.execute('mobile: swipeGesture', {
                    left:   p.left,
                    top:    Math.round(height * p.top),
                    width:  p.width,
                    height: Math.round(height * p.height),
                    direction: 'up', // dedo sobe = scroll down = revela conteúdo abaixo
                    percent: p.percent,
                });
                await driver.pause(600);

                const src = await driver.getPageSource();
                if (src.includes('You found me')) {
                    return true;
                }
            }
        }
        return false;
    }
}

module.exports = new SwipePage();

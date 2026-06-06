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

    // Scroll vertical para baixo (dedo sobe) para revelar o robô escondido
    async scrollDownToFindRobot(maxTries = 8) {
        const { width, height } = await driver.getWindowSize();
        const cx = Math.round(width * 0.5);

        for (let i = 0; i < maxTries; i++) {
            await driver.execute('mobile: swipeGesture', {
                left:   cx - 80,
                top:    Math.round(height * 0.55),
                width:  160,
                height: Math.round(height * 0.35),
                direction: 'up', // dedo sobe = scroll down = revela conteúdo abaixo
                percent: 0.95,
            });
            await driver.pause(400);

            const src = await driver.getPageSource();
            if (src.includes('You found me')) {
                return true;
            }
        }
        return false;
    }
}

module.exports = new SwipePage();

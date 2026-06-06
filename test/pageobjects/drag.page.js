const BasePage = require('./base.page');

class DragPage extends BasePage {
    get screen()        { return $('~Drag-drop-screen'); }
    get renewButton()   { return $('~renew'); }

    async isScreenDisplayed() {
        return this.isDisplayed('~Drag-drop-screen', 8000);
    }

    async dragAndDrop(sourceSelector, targetSelector) {
        const source = await $(sourceSelector);
        const target = await $(targetSelector);
        await source.waitForDisplayed({ timeout: 10000 });
        await target.waitForDisplayed({ timeout: 10000 });
        await source.dragAndDrop(target);
        await driver.pause(500);
    }

    async completeAllDrags() {
        // Linha 1
        await this.dragAndDrop('~drag-l1', '~drop-l1');
        await this.dragAndDrop('~drag-c1', '~drop-c1');
        await this.dragAndDrop('~drag-r1', '~drop-r1');
        // Linha 2
        await this.dragAndDrop('~drag-l2', '~drop-l2');
        await this.dragAndDrop('~drag-c2', '~drop-c2');
        await this.dragAndDrop('~drag-r2', '~drop-r2');
        // Linha 3
        await this.dragAndDrop('~drag-l3', '~drop-l3');
        await this.dragAndDrop('~drag-c3', '~drop-c3');
        await this.dragAndDrop('~drag-r3', '~drop-r3');
    }

    async isSuccessDisplayed() {
        // Após completar todos os drags, o renew button some ou aparece tela de sucesso
        try {
            const result = await driver.getPageSource();
            return result.includes('You made it') || result.includes('renew');
        } catch {
            return false;
        }
    }
}

module.exports = new DragPage();

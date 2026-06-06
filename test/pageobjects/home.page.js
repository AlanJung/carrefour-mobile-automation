const BasePage = require('./base.page');

class HomePage extends BasePage {
    // Abas do menu de navegação inferior — content-desc confirmados
    get homeTab()    { return $('~Home'); }
    get webviewTab() { return $('~Webview'); }
    get loginTab()   { return $('~Login'); }
    get formsTab()   { return $('~Forms'); }
    get swipeTab()   { return $('~Swipe'); }
    get dragTab()    { return $('~Drag'); }

    async navigateTo(tab) {
        const tabs = {
            home:    '~Home',
            webview: '~Webview',
            login:   '~Login',
            forms:   '~Forms',
            swipe:   '~Swipe',
            drag:    '~Drag',
        };
        const selector = tabs[tab.toLowerCase()];
        if (!selector) throw new Error(`Tab desconhecida: ${tab}`);
        await this.click(selector);
        await driver.pause(800);
    }

    async isTabSelected(tab) {
        const selector = `~${tab.charAt(0).toUpperCase() + tab.slice(1)}`;
        const el = await $(selector);
        const selected = await el.getAttribute('selected');
        return selected === 'true' || selected === true;
    }
}

module.exports = new HomePage();

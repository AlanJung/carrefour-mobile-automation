const BasePage = require('./base.page');

class FormsPage extends BasePage {
    get screen()        { return $('~Forms-screen'); }
    get inputField()    { return $('~text-input'); }
    get inputResult()   { return $('~input-text-result'); }
    get switchToggle()  { return $('~switch'); }
    get switchStatus()  { return $('~switch-text'); }
    get dropdownBtn()   { return $('~Dropdown'); }
    get activeBtn()     { return $('~button-Active'); }
    get inactiveBtn()   { return $('~button-Inactive'); }

    async isScreenDisplayed() {
        return this.isDisplayed('~Forms-screen', 8000);
    }

    async typeInInputField(text) {
        const field = await $('~text-input');
        await field.waitForDisplayed({ timeout: 8000 });
        await field.clearValue();
        await field.setValue(text);
        await this.hideKeyboard();
        await driver.pause(500);
    }

    async getInputResult() {
        return this.getText('~input-text-result');
    }

    async getSwitchStatus() {
        return this.getText('~switch-text');
    }

    async toggleSwitch() {
        await this.click('~switch');
        await driver.pause(400);
    }

    async openDropdown() {
        await this.click('~Dropdown');
        await driver.pause(1000);
    }

    async selectDropdownOption(optionText) {
        await this.openDropdown();
        // Seleciona pelo texto visível
        const option = await $(`//*[@text="${optionText}"]`);
        await option.waitForDisplayed({ timeout: 5000 });
        await option.click();
        await driver.pause(500);
    }
}

module.exports = new FormsPage();

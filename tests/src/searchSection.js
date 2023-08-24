const { By, until } = require("selenium-webdriver");

class SearchSection {
  constructor(driver) {
    this.driver = driver;
  }

  async SearchProducts() {
    const expectedProductName = "Tropical Paradise";

    try {
      let searchIcon = await this.driver.findElement(
        By.css(SEARCH_ICON_SELECTOR)
      );
      await searchIcon.click();

      let searchBox = await this.driver.wait(
        until.elementLocated(By.css(SEARCH_BOX_SELECTOR)),
        5000
      );
      await searchBox.sendKeys("paradise");

      let productElement = await this.driver.wait(
        until.elementLocated(By.css(EXPECTED_PRODUCT_SELECTOR)),
        10000
      );

      let productName = await productElement.getText();

      if (productName.includes(expectedProductName)) {
        console.log(
          "Product found successfully and name matches! Product:" + productName
        );
      } else {
        console.log("Product name does not match!");
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = SearchSection;

const SEARCH_ICON_SELECTOR = "a.hdicon.searchIco.hide-sm.hide-md";
const SEARCH_BOX_SELECTOR = "input.input-group__field.search__input";
const SEARCH_BUTTON_SELECTOR = "button.search__submit";
const EXPECTED_PRODUCT_SELECTOR = "p.mb5";

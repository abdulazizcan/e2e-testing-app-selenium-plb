const { By, until } = require("selenium-webdriver");
const { scrollToAndClick } = require("./utils/utils");

class ShoppingCart {
  constructor(driver) {
    this.driver = driver;
  }

  async checkTheBasket() {
    try {
      const productPage = await this.driver.wait(
        until.elementLocated(By.className("gitem is-selected")),
        2000
      );
      await scrollToAndClick(this.driver, productPage);

      const addButton = await this.driver.wait(
        until.elementLocated(
          By.id("AddToCartText-template--19411590414669__product")
        ),
        2000
      );
      await scrollToAndClick(this.driver, addButton);

      await this.driver.sleep(10000);

      let titles = [];
      let prices = [];

      const cartItems2 = await this.driver.findElements(
        By.css("li.fl.f-ais.cart-item")
      );
      for (let item of cartItems2) {
        let titleElements = await item.findElements(By.css(".mb5 .pName"));
        let priceElements = await item.findElements(By.className("price--end"));

        if (titleElements.length > 0 && priceElements.length > 0) {
          const title = await titleElements[0].getText();
          const price = await priceElements[0].getText();
          titles.push(title);
          prices.push(price);
        } else {
          console.log("Title or price not found for an item.");
        }
      }

      await this.driver.executeScript(
        "arguments[0].scrollIntoView();",
        addButton
      );

      console.log("Added.");
      console.log("Titles:", titles);
      console.log("Prices:", prices);
      await this.driver.sleep(2000);

      const checkoutPage = await this.driver.wait(
        until.elementLocated(By.id("inlinecheckout-cart")),
        2000
      );

      await scrollToAndClick(this.driver, checkoutPage);

      const cartItems = await this.driver.findElements(
        By.className("cart__row cart-item border-bottom")
      );

      const expectedTitles = await this.driver.findElements(
        By.css(".grid-view-item__title > .fw-600")
      );
      const expectedPrices = await this.driver.findElements(By.css(".ctPrice"));

      let titleCheckTexts = [];
      let priceCheckTexts = [];

      for (let i = 0; i < expectedTitles.length; i++) {
        titleCheckTexts.push(await expectedTitles[i].getText());
        priceCheckTexts.push(await expectedPrices[i].getText());
      }

      for (let i = 0; i < titleCheckTexts.length; i++) {
        if (titles[i] !== titleCheckTexts[i]) {
          console.error(
            `Unexpected product title: got ${titles[i]}, expected ${titleCheckTexts[i]}`
          );
        }
        if (prices[i] !== priceCheckTexts[i]) {
          console.error(
            `Unexpected product price: got ${prices[i]}, expected ${priceCheckTexts[i]}`
          );
        }
      }

      console.log("Number of items in Cart:", cartItems.length);
      console.log("Card test successfully completed!");
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ShoppingCart;

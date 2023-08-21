const { By } = require("selenium-webdriver");

class MobileCompatibilityTest {
  constructor(driver) {
    this.driver = driver;
    this.sizes = [
      { width: 414, height: 736, name: "iPhone 6/7/8 Plus" },
      { width: 360, height: 640, name: "Samsung Galaxy S5" },
      { width: 412, height: 732, name: "Samsung Galaxy S9" },
      { width: 768, height: 1024, name: "iPad" },
    ];
  }

  async testMobileCompatibility(url) {
    for (const size of this.sizes) {
      console.log(`Testing ${size.name}: ${size.width}x${size.height}`);
      await this.driver
        .manage()
        .window()
        .setRect({ width: size.width, height: size.height });
      await this.driver.get(url);

      //  Whether the menu button is clickable
      const menuButton = await this.driver.findElement(
        By.css("a.hdicon.js-mobile-nav-toggle.open")
      );
      if (!(await menuButton.isEnabled())) {
        console.error(`Menu button is not clickable at ${size.name}`);
      }

      //  Whether the logo is displayed
      const logo = await this.driver.findElement(
        By.css("a.header-logo-link>img")
      );
      if (!(await logo.isDisplayed())) {
        console.error(`Logo is not displayed at ${size.name}`);
      }

      // Whether product images are loaded
      const productImages = await this.driver.findElements(
        By.css(".flickity-viewport.gitem-img")
      );

      for (const img of productImages) {
        const backgroundImage = await img.getCssValue("background-image");

        if (backgroundImage === "none" || !backgroundImage.includes("url")) {
          console.error(`Product image is not loaded at ${size.name}`);
        }
      }

      //  Whether the shopping cart button is displayed
      const cartButton = await this.driver.findElement(
        By.css("i.at.at-sq-bag")
      );
      if (!(await cartButton.isDisplayed())) {
        console.error(`Cart button is not displayed at ${size.name}`);
      }
      // Checking footer visibility
      const footerLinks = await this.driver.findElements(
        By.css(".footer-block__item wd20-md custom-block")
      );
      for (const link of footerLinks) {
        if (!(await link.isDisplayed())) {
          console.error(`A footer link is not displayed at ${size.name}`);
        }
      }

      // Checking product details
      const productDetails = await this.driver.findElements(
        By.id(
          "productSlider-template--19351486169421__03171194-ae4a-4d5c-8557-14ed644198e9-cltabs-1"
        )
      );
      for (const detail of productDetails) {
        if (!(await detail.isDisplayed())) {
          console.error(`A product detail is not displayed at ${size.name}`);
        }
      }
    }
  }
}

module.exports = MobileCompatibilityTest;

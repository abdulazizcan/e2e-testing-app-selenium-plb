const { Builder, By, Key, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
require("dotenv").config();

class WebDriverHandler {
  constructor() {
    const options = new firefox.Options();
    // options.headless(true);

    this.driver = new Builder()
      .forBrowser("firefox")
      .setFirefoxOptions(options)
      .build();
  }

  async startWebDriver() {
    return this.driver;
  }

  async getSiteAndLogin() {
    try {
      await this.driver.get("https://plbbeta.myshopify.com/password");
      await this.driver.sleep(2000);

      const enterPasswordElement = await this.driver.findElement(
        By.className("js-modal-open-login-modal link--action btn btn2")
      );
      await enterPasswordElement.click();

      await this.driver
        .findElement(By.id("Password"))
        .sendKeys("riaska", Key.RETURN);

      const enterPassword = await this.driver.findElement(
        By.className("btn btn--narrow")
      );
      await enterPassword.click();
      await this.driver.sleep(7000);

      const closeThePopup = await this.driver.wait(
        until.elementLocated(By.className("mfp-close"))
      );
      await closeThePopup.click();
      await this.driver.sleep(2000);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = WebDriverHandler;

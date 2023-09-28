const { Builder, By, Key, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
class WebDriverHandler {
  constructor(headless = null) {
    const options = new firefox.Options();
    if (headless === "headless") {
      options.headless(true);
    }
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
      await this.driver.get("https://purelifebiotics.com");
      await this.driver.sleep(2000);

      // const closeThePopup = await this.driver.wait(
      //   until.elementLocated(By.className("mfp-close"))
      // );
      // await closeThePopup.click();
      // await this.driver.sleep(2000);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = WebDriverHandler;

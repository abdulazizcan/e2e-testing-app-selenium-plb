const { By, until } = require("selenium-webdriver");
const { scrollToAndClick } = require("./utils/utils");

class AboutUs {
  constructor(driver) {
    this.driver = driver;
  }

  async aboutUsClick() {
    try {
      const aboutUsLink = await this.driver.findElement(
        By.css('a[href="/pages/about-us"]')
      );
      await scrollToAndClick(this.driver, aboutUsLink);
      if (aboutUsLink) {
      }
      await this.checkAboutUsPage();
    } catch (error) {
      console.log(error);
    }
  }

  async checkAboutUsPage() {
    try {
      let title = await this.driver.wait(
        until.elementLocated(By.css("span.fw-700")),
        10000
      );
      title = await this.driver.findElement(By.css("span.fw-700"));
      title = await title.getText();
      if (title == "About Us") {
        console.log(`The name of the entered web page is correct. ${title}`);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = AboutUs;

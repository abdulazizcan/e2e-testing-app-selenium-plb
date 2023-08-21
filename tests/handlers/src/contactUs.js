const { By, until } = require("selenium-webdriver");
const { scrollToAndClick } = require("./utils/utils");

class ContactUs {
  constructor(driver) {
    this.driver = driver;
  }

  async ContactUsClick() {
    try {
      await this.driver.wait(
        until.elementLocated(By.css('a[href="/pages/contact-us"]')),
        10000
      );

      const contactUsLink = await this.driver.findElement(
        By.css('a[href="/pages/contact-us"]')
      );
      await scrollToAndClick(this.driver, contactUsLink);
      if (contactUsLink) {
      }

      await this.checkTheShowerSteamers();
    } catch (error) {
      console.log(error);
    }
  }

  async checkTheShowerSteamers() {
    try {
      let title = await this.driver.wait(
        until.elementLocated(By.css("span.fw-700")),
        10000
      );
      title = await this.driver.findElement(By.css("span.fw-700"));
      title = await title.getText();
      if (title == "Contact Us") {
        console.log(`The name of the entered web page is correct. ${title}`);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ContactUs;

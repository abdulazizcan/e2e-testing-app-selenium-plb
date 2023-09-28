const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs").promises;

class PerformanceTest {
  constructor(url = "https://plbbeta.myshopify.com/", browser = "chrome") {
    this.url = url;
    this.browser = browser;
    // Maksimum değerlerin tanımlanması
    this.maxFCP = 3000; // First Contentful Paint
    this.maxFMP = 5000; // First Meaningful Paint
    this.maxTTI = 7000; // Time to Interactive
    this.maxPageLoad = 3000; // Page Load Time
  }

  async startWebDriver() {
    return this.driver;
  }
  async getSiteAndLogin() {
    try {
      await this.driver.get("https://plbbeta.myshopify.com/password");
      await this.driver.sleep(2000);

      const enterPasswordElement = await this.driver.wait(
        until.elementLocated(
          By.className("js-modal-open-login-modal link--action btn btn2")
        )
      );
      await enterPasswordElement.click();

      await this.driver
        .wait(until.elementLocated(By.id("Password")))
        .sendKeys("riaska", Key.RETURN);
    } catch (error) {
      console.log(error);
    }
  }

  async initializeDriver() {
    if (this.browser === "chrome") {
      const chrome = require("selenium-webdriver/chrome");
      let chromeOptions = new chrome.Options();
      // chromeOptions.addArguments("--headless");
      chromeOptions.addArguments(
        "--disable-gpu",
        "--disable-software-rasterizer",
        "--no-sandbox"
      );
      chromeOptions.addArguments("--disable-usb-keyboard-detect");
      this.driver = new Builder()
        .forBrowser(this.browser)
        .setChromeOptions(chromeOptions)
        .build();
    } else if (this.browser === "firefox") {
      const firefox = require("selenium-webdriver/firefox");
      let firefoxOptions = new firefox.Options();
      // firefoxOptions.addArguments("-headless");
      this.driver = new Builder()
        .forBrowser(this.browser)
        .setFirefoxOptions(firefoxOptions)
        .build();
    } else {
      this.driver = new Builder().forBrowser(this.browser).build();
    }
  }

  msToSeconds(ms) {
    return (ms / 1000).toFixed(2) + " s";
  }

  async logMessageWithMaxValue(level, message, currentValue, maxValue) {
    const currentValueInSeconds = this.msToSeconds(currentValue);
    const maxValueInSeconds = this.msToSeconds(maxValue);

    // Update this to format the string as you want.
    const formattedLogMessage = `${level} ${currentValue} ms | ${currentValueInSeconds} | Max: ${maxValue} ms | ${maxValueInSeconds}`;

    console.log(formattedLogMessage);
    await fs.appendFile("performance_log.txt", formattedLogMessage + "\n");
  }

  async logError(error) {
    const timestamp = new Date().toISOString();
    const logMessage = {
      timestamp,
      level: "ERROR",
      message: error,
    };
    console.error(logMessage);
    await fs.appendFile(
      "performance_log.txt",
      JSON.stringify(logMessage) + "\n"
    );
  }

  async getPerformanceMetrics() {
    return await this.driver.executeScript(
      "return window.performance.getEntriesByType('paint')"
    );
  }

  async getPerformanceTiming() {
    return await this.driver.executeScript("return window.performance.timing");
  }

  async logPerformanceMetrics() {
    const metrics = await this.getPerformanceMetrics();
    const timing = await this.getPerformanceTiming();

    const fcp = metrics.find((m) => m.name === "first-contentful-paint");
    if (fcp) {
      await this.logMessageWithMaxValue(
        "INFO",
        `First Contentful Paint:`,
        fcp.startTime.toFixed(2),
        this.maxFCP
      );

      if (fcp.startTime > this.maxFCP) {
        await this.logError("WARNING: First Contentful Paint time is high!");
      }
    }

    const fmp = metrics.find((m) => m.name === "first-meaningful-paint");
    if (fmp) {
      await this.logMessageWithMaxValue(
        "INFO",
        `First Meaningful Paint:`,
        fmp.startTime.toFixed(2),
        this.maxFMP
      );
      if (fmp.startTime > this.maxFMP) {
        await this.logError("WARNING: First Meaningful Paint time is high!");
      }
    }

    const tti = timing.domInteractive - timing.domLoading;
    await this.logMessageWithMaxValue(
      "INFO",
      `Time to Interactive:`,
      tti,
      this.maxTTI
    );
    if (tti > this.maxTTI) {
      await this.logError("WARNING: Time to Interactive is high!");
    }
  }

  async testPageLoadPerformance() {
    let totalLoadTime = 0;
    for (let i = 0; i < 10; i++) {
      try {
        await this.driver.manage().deleteAllCookies();
        console.log("Cookies have been cleared.");
      } catch (error) {
        console.error("An error occurred while clearing cookies:", error);
      }
      // Login screen control
      try {
        await this.driver.get(this.url);
        const passwordTitle = await this.driver.findElements(
          By.css("h2.password__title")
        );

        if (passwordTitle.length > 0) {
          console.log("bulundu.");
          // The login screen appears, enter your password.
          await this.getSiteAndLogin();
        }
      } catch (error) {
        console.error("Giriş ekranı kontrolünde hata:", error);
      }
      await this.driver.get(this.url);
      const timing = await this.driver.executeScript(
        "return window.performance.timing"
      );
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      totalLoadTime += loadTime;
      const averageLoadTime = totalLoadTime / 10;
      await this.logMessageWithMaxValue(
        "INFO",
        `Average Page Load Time:`,
        averageLoadTime,
        this.maxPageLoad
      );

      if (averageLoadTime > this.maxPageLoad) {
        await this.logError("CRITICAL: Page load time is way too high!");
      } else if (averageLoadTime > this.maxPageLoad - 1000) {
        await this.logError("WARNING: Page load time is high!");
      }
    }
    await this.logPerformanceMetrics();
  }

  async testElementLoadPerformance(elementLocator) {
    try {
      await this.driver.get(this.url);
      const start = new Date().getTime();
      const element = await this.driver.findElement(elementLocator);
      if (element) {
        const end = new Date().getTime();
        const loadTime = end - start;
        await this.logMessageWithMaxValue(
          "INFO",
          `Element Load Time:`,
          loadTime,
          2000
        );
      } else {
        await this.logError(
          "Element not found: " + JSON.stringify(elementLocator)
        );
      }
    } catch (error) {
      await this.logError(error);
    }
  }

  async closeDriver() {
    await this.driver.quit();
  }

  async runTests() {
    try {
      const testChrome = new PerformanceTest(
        "https://plbbeta.myshopify.com/",
        "chrome"
      );
      await testChrome.initializeDriver();
      await testChrome.testPageLoadPerformance();
      await testChrome.testElementLoadPerformance({
        css: ".wow.fadeIn.fullwidth.npd",
      });
      await testChrome.closeDriver();

      const testFirefox = new PerformanceTest(
        "https://plbbeta.myshopify.com/",
        "firefox"
      );
      await testFirefox.initializeDriver();
      await testFirefox.testPageLoadPerformance();
      await testFirefox.testElementLoadPerformance({
        css: ".input-group__btn",
      });
      await testFirefox.closeDriver();
    } catch (err) {
      console.error("An error occurred during tests:", err);
    }
  }
}

module.exports = PerformanceTest;

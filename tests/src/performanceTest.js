const { Builder } = require("selenium-webdriver");
const fs = require("fs").promises;

class PerformanceTest {
  constructor(url = "https://plbbeta.myshopify.com/", browser = "chrome") {
    this.url = url;
    this.browser = browser;
  }

  async initializeDriver() {
    if (this.browser === "chrome") {
      const chrome = require("selenium-webdriver/chrome");
      let chromeOptions = new chrome.Options();
      //chromeOptions.addArguments("--headless");
      chromeOptions.addArguments(
        "--disable-gpu",
        "--disable-software-rasterizer",
        "--no-sandbox"
      );

      this.driver = new Builder()
        .forBrowser(this.browser)
        .setChromeOptions(chromeOptions)
        .build();
    } else if (this.browser === "firefox") {
      const firefox = require("selenium-webdriver/firefox");
      let firefoxOptions = new firefox.Options();
      //firefoxOptions.addArguments("-headless");
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

  async logMessageWithMaxValue(message, currentValue, maxValue) {
    message += ` ${currentValue} ms | ${this.msToSeconds(
      currentValue
    )} | Max: ${maxValue} ms | ${this.msToSeconds(maxValue)}`;
    console.log(message);
    await fs.appendFile("performance_log.txt", message + "\n");
  }

  async logError(error) {
    console.error(error);
    await fs.appendFile("performance_log.txt", "ERROR: " + error + "\n");
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
        `First Contentful Paint:`,
        fcp.startTime.toFixed(2),
        3000
      );
      if (fcp.startTime > 3000) {
        await this.logError("WARNING: First Contentful Paint time is high!");
      }
    }

    const fmp = metrics.find((m) => m.name === "first-meaningful-paint");
    if (fmp) {
      await this.logMessageWithMaxValue(
        `First Meaningful Paint:`,
        fmp.startTime.toFixed(2),
        5000
      );
      if (fmp.startTime > 5000) {
        await this.logError("WARNING: First Meaningful Paint time is high!");
      }
    }

    const tti = timing.domInteractive - timing.domLoading;
    await this.logMessageWithMaxValue(`Time to Interactive:`, tti, 7000);
    if (tti > 7000) {
      await this.logError("WARNING: Time to Interactive is high!");
    }
  }

  async testPageLoadPerformance() {
    let totalLoadTime = 0;
    for (let i = 0; i < 10; i++) {
      await this.driver.get(this.url);
      const timing = await this.driver.executeScript(
        "return window.performance.timing"
      );
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      totalLoadTime += loadTime;
      await this.logMessageWithMaxValue(
        `Page Load Time for iteration ${i + 1}:`,
        loadTime,
        3000
      );
    }

    const averageLoadTime = totalLoadTime / 10;
    await this.logMessageWithMaxValue(
      `Average Page Load Time:`,
      averageLoadTime,
      3000
    );

    if (averageLoadTime > 3000) {
      await this.logError("CRITICAL: Page load time is way too high!");
    } else if (averageLoadTime > 2000) {
      await this.logError("WARNING: Page load time is high!");
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
        await this.logMessageWithMaxValue(`Element Load Time:`, loadTime, 2000);
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
      await testChrome.testElementLoadPerformance({ css: ".input-group__btn" });
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

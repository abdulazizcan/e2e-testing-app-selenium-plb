const { Builder } = require("selenium-webdriver");
const fs = require("fs");

class SitemapCheck {
  constructor(driver) {
    this.driver = driver;
  }

  async checkFile(filePath) {
    try {
      const data = fs.readFileSync(filePath, "utf8");
      const urls = data
        .match(/<loc>(.*?)<\/loc>/g)
        .map((match) => match.replace(/<\/?loc>/g, ""));

      for (const url of urls) {
        const start = new Date();
        await this.driver.get(url);
        const end = new Date() - start;
        const title = await this.driver.getTitle();
        console.log(`URL: ${url}`);
        console.log(`Title: ${title}`);
        console.log(`Load Time: ${end}ms`);
        if (end > 2000) {
          // 2 seconds
          console.log("Error: Page load time is too long.");
        }
        if (!title) {
          console.log("Error: Page did not load.");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async checkSitemap() {
    const files = [
      "./tests/src/links/blogs.xml",
      "./tests/src/links/collections.xml",
      "./tests/src/links/pages.xml",
      "./tests/src/links/products.xml",
    ];
    for (const file of files) {
      console.log(`Checking file: ${file}`);
      await this.checkFile(file);
    }
  }
}

module.exports = SitemapCheck;

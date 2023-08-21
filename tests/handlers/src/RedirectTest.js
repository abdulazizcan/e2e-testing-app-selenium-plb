class RedirectTest {
  constructor(driver) {
    this.driver = driver;
    this.urlsToTest = [
      {
        url: "https://plbbeta.myshopify.com/blogs/news",
        expected: "https://plbbeta.myshopify.com/blogs/news",
      },
      {
        url: "https://plbbeta.myshopify.com/pages/faqs",
        expected: "https://plbbeta.myshopify.com/pages/faqs",
      },
    ];
  }

  async testRedirects() {
    for (const test of this.urlsToTest) {
      await this.driver.get(test.url);
      const currentUrl = await this.driver.getCurrentUrl();
      if (currentUrl !== test.expected) {
        console.error(
          `Wrong Redirect: ${test.url} -> ${currentUrl}. expected: ${test.expected}`
        );
      } else {
        console.log(`Correct Redirect: ${test.url} -> ${test.expected}`);
      }
    }
  }
}

module.exports = RedirectTest;

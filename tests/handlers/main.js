const WebDriverHandler = require("./src/WebDriverHandler");
const SearchSection = require("./src/searchSection");
const ShoppingCart = require("./src/shoppingCart");

async function testPLB() {
  const webDriver = new WebDriverHandler();
  try {
    await webDriver.startWebDriver();
    await webDriver.getSiteAndLogin();

    const shoppingCart = new ShoppingCart(webDriver.driver);
    await shoppingCart.checkTheBasket();

    const search = new SearchSection(webDriver.driver);
    await search.SearchProducts();
  } catch (error) {
    console.log(error);
  } finally {
    webDriver.driver.quit();
  }
}

testPLB();

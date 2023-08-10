const WebDriverHandler = require("./src/WebDriverHandler");
const SearchSection = require("./src/searchSection");
const ShoppingCart = require("./src/shoppingCart");
const { closeTheSearch, HoverTheShop } = require("./src/utils/utils");
const BathBombs = require("./src/collectionPage/bathBombs");
const ShowerSteamers = require("./src/collectionPage/showerSteamers");

async function testPLB() {
  const webDriver = new WebDriverHandler();
  try {
    //Start Web Driver and Login Site
    await webDriver.startWebDriver();
    await webDriver.getSiteAndLogin();
    await webDriver.driver.sleep(2000);

    // Check that when you added an product the cart, if it is empty or not
    const shoppingCart = new ShoppingCart(webDriver.driver);
    await shoppingCart.checkTheBasket();
    await webDriver.driver.sleep(2000); // 3-second wait

    //check the search
    const search = new SearchSection(webDriver.driver);
    await search.SearchProducts();
    await closeTheSearch(webDriver.driver);
    await webDriver.driver.sleep(2000);

    //check the bath bombs collection page
    await HoverTheShop(webDriver.driver);
    const BathBombsCollection = new BathBombs(webDriver.driver);
    await BathBombsCollection.clickTheBathBombs();
    await webDriver.driver.sleep(2000);

    //check the shower steamers collection page
    await HoverTheShop(webDriver.driver);
    const showerSteamersCollection = new ShowerSteamers(webDriver.driver);
    await showerSteamersCollection.clickTheShowerSteamers();
    await webDriver.driver.sleep(2000);
  } catch (error) {
    console.log(error);
  } finally {
    await webDriver.driver.quit();
  }
}

testPLB();

const WebDriverHandler = require("./src/WebDriverHandler");
const SearchSection = require("./src/searchSection");
const ShoppingCart = require("./src/shoppingCart");
const { closeTheSearch, HoverTheShop } = require("./src/utils/utils");
const BathBombs = require("./src/collectionPage/bathBombs");
const ShowerSteamers = require("./src/collectionPage/showerSteamers");
const AboutUs = require("./src/aboutUs");
const ContactUs = require("./src/contactUs");
const PerformanceTest = require("./src/performanceTest");
const RedirectTest = require("./src/RedirectTest");
const MobileCompatibilityTest = require("./src/MobileCompatibilityTest");
async function performance() {
  try {
    const performanceTester = new PerformanceTest();
    await performanceTester.runTests();
  } catch (error) {
    console.log(error);
  }
}
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

    // Check for redirect
    const redirectTest = new RedirectTest(webDriver.driver);
    await redirectTest.testRedirects();

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

    //AboutUS page checking
    const aboutUs = new AboutUs(webDriver.driver);
    await aboutUs.aboutUsClick();
    await webDriver.driver.sleep(2000);

    //AboutUS page checking
    const contactUs = new ContactUs(webDriver.driver);
    await contactUs.ContactUsClick();
    await webDriver.driver.sleep(2000);

    // Mobile-Friendly Test
    const urlToTest = "https://plbbeta.myshopify.com/";
    const mobileTest = new MobileCompatibilityTest(webDriver.driver);
    await mobileTest.testMobileCompatibility(urlToTest);
  } catch (error) {
    console.log(error);
  } finally {
    await webDriver.driver.quit();
  }
}

async function runTests() {
  await testPLB();
  await performance();
}
runTests();

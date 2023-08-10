const { until, By } = require("selenium-webdriver");

async function scrollToAndClick(driver, element) {
  for (let i = 0; i < 10; i++) {
    await driver.executeScript("window.scrollBy(0,200)");
    await driver.sleep(100);
  }

  await driver.executeScript("arguments[0].scrollIntoView();", element);
  await driver.sleep(2000);
  await driver.wait(until.elementIsVisible(element), 10000);
  await element.click();
}

async function closeTheSearch(driver) {
  const closeIcon = await driver.findElement(By.css(".btn-link.closeSearch"));
  await closeIcon.click();
  console.log("the search bar is closed.");
}

async function HoverTheShop(driver) {
  const shopElement = await driver.findElement(
    By.css("li.lvl1.parent.megamenu")
  );
  const actions = driver.actions({ bridge: true });
  await actions.move({ origin: shopElement }).perform();
  await driver.sleep(2000);
}
module.exports = {
  scrollToAndClick,
  closeTheSearch,
  HoverTheShop,
};

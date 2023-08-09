const { until } = require("selenium-webdriver");

// Belirli bir öğeye kaydırma ve tıklama işlemi gerçekleştirir
async function scrollToAndClick(driver, element) {
  for (let i = 0; i < 10; i++) {
    await driver.executeScript("window.scrollBy(0,200)");
    await driver.sleep(100);
  }

  await driver.executeScript("arguments[0].scrollIntoView();", element);
  await driver.sleep(2000); // Sayfanın kaydırıldığından emin olmak için bir gecikme ekleyin
  await driver.wait(until.elementIsVisible(element), 10000);
  await element.click();
}

module.exports = {
  scrollToAndClick,
};

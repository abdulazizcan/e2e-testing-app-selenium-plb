const { By } = require("selenium-webdriver");

class ShowerSteamers {
  constructor(driver) {
    this.driver = driver;
    this.names = [];
    this.products = [
      "Calm Me",
      "Grapefruit Glory",
      "Lemon Allure",
      "Sleepy Time",
      "Spa Day",
      "Breathe",
      "Breathe Sports Edition",
      "Calm Me Sports Edition",
      "Spa Day Sports Edition",
      "Love For Her",
      "Love For Him",
      "Springtime Sakura",
      "Calm Me",
      "Grapefruit Glory",
      "Lemon Allure",
      "Cleopatra's Desire",
      "Tropical Paradise",
      "Champs de Lavande",
      "Dream Destinations",
      "Calm Me",
      "Grapefruit Glory",
      "Lemon Allure",
    ];
  }

  async clickTheShowerSteamers() {
    const showerSteamersLink = await this.driver.findElement(
      By.css('a[data-link="#nvshower-steamers"]')
    );
    await showerSteamersLink.click();
    await this.checkTheShowerSteamers();
  }

  async checkTheShowerSteamers() {
    await this.updateNames();

    let next_page = await this.driver.findElement(By.css("ul > li.next"));
    while (next_page) {
      console.log("there is another page.");
      await next_page.click();
      await this.updateNames();

      try {
        next_page = await this.driver.findElement(By.css("ul > li.next"));
      } catch (error) {
        console.log("No more next page button found.");
        break;
      }
    }

    this.compareProducts();
  }

  async updateNames() {
    const productNames = await this.driver.findElements(
      By.css(".grid-view-item__title")
    );

    await Promise.all(
      productNames.map(async (product) => {
        const name = await product.getText();
        if (name !== "") this.names.push(name);
      })
    );
  }

  compareProducts() {
    console.log("Product Names: ", this.names);

    const namesInProductsButNotInNames = this.products.filter(
      (product) => !this.names.includes(product)
    );

    const namesInNamesButNotInProducts = this.names.filter(
      (name) => !this.products.includes(name)
    );

    if (
      namesInProductsButNotInNames.length > 0 ||
      namesInNamesButNotInProducts.length > 0
    ) {
      console.error(
        "there is a problem with products on Shower Steamers collection"
      );
      if (namesInProductsButNotInNames.length > 0) {
        console.error(
          "Missing in Product on the Shower Steamers Collection: ",
          namesInProductsButNotInNames
        );
      }
      if (namesInNamesButNotInProducts.length > 0) {
        console.error(
          "Extra in Product on the Shower Steamers Collection Page: ",
          namesInNamesButNotInProducts
        );
      }
    } else {
      console.log(
        "Shower Steamers Collection is checked, and everything looks good."
      );
    }
  }
}

module.exports = ShowerSteamers;

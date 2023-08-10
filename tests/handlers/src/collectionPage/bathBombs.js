const { By } = require("selenium-webdriver");

class BathBombs {
  constructor(driver) {
    this.driver = driver;
    this.names = [];
    this.products = [
      "Luxury Bath Bomb Blue Skies",
      "Luxury Bath Bomb Cotton Candy",
      "Luxury Bath Bomb Galaxy",
      "Luxury Bath Bomb Rose Bliss",
      "Luxury Bath Bomb Satsuma",
      "Luxury Bath Bomb Tropical Oasis",
      "Luxury Bath Bomb Watermelon",
    ];
  }

  async clickTheBathBombs() {
    const bathBombsLink = await this.driver.findElement(
      By.css('a[data-link="#nvbath-bombs"]')
    );
    await bathBombsLink.click();

    await this.checkBathBombCollection();
  }

  async checkBathBombCollection() {
    await this.updateNames();

    let next_page;
    try {
      next_page = await this.driver.findElement(By.css("ul > li.next"));
      await this.driver.sleep(2000); // 3-second wait
    } catch (error) {
      console.log("No next page button found.");
      await this.driver.sleep(2000); // 3-second wait
      this.compareProducts();
      return;
    }

    while (next_page) {
      console.log("there is another page.");
      await next_page.click();
      await this.updateNames();

      try {
        next_page = await this.driver.findElement(By.css("ul > li.next"));
        console.log("there is another page");
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
      console.error("there is a problem with products on bath bomb collection");
      if (namesInProductsButNotInNames.length > 0) {
        console.error(
          "Missing in Product on the Bath Bombs Collection: ",
          namesInProductsButNotInNames
        );
      }
      if (namesInNamesButNotInProducts.length > 0) {
        console.error(
          "Extra in Product on the Bath Bombs Collection Page: ",
          namesInNamesButNotInProducts
        );
      }
    } else {
      console.log(
        "Bath Bombs Collection is checked, and everything looks good."
      );
    }
  }
}

module.exports = BathBombs;

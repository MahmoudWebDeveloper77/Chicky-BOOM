let menuData = null;

// Function to load JSON data
async function loadMenuData() {
  try {
    const response = await fetch("./menu.json");
    menuData = await response.json();
    displayProducts();
  } catch (error) {
    console.error("Error loading menu data:", error);
  }
}

// Function to create product card HTML
function createProductCard(item) {
  let priceHTML = "";

  if (item.prices.length === 1 && !item.prices[0].size) {
    // Single price without size
    priceHTML = `<span>${item.prices[0].price}</span>`;
  } else if (item.prices.length === 1) {
    // Single price with size
    priceHTML = `
            <div class="first-price">
              <span>${item.prices[0].size}</span>
              <span>${item.prices[0].price}</span>
            </div>
          `;
  } else {
    // Multiple prices
    priceHTML = item.prices
      .map(
        (price, index) =>
          `
            <div class="${
              index === 0
                ? "first-price"
                : index === 1
                ? "second-price"
                : "third-price"
            }">
              <span>${price.size}</span>
              <span>${price.price}</span>
            </div>
          `
      )
      .join("");
  }

  return `
          <div class="product-card">
            <div class="product-image-container">
              <img
                src="${item.image}"
                alt="${item.name}"
                class="product-image"
              />
              <div class="shine-effect"></div>
            </div>
            <div class="product-content">
              <p class="product-title">${item.name}</p>
              <p class="product-description">${item.description}</p>
              <div class="product-footer">
                <div class="product-price">
                  ${priceHTML}
                </div>
              </div>
            </div>
          </div>
        `;
}

// Function to display products by category
function displayProducts(categoryId = null) {
  // Check if menu data is loaded
  if (!menuData) {
    console.error("Menu data not loaded yet");
    return;
  }

  const productsContainer = document.getElementById("products-container");
  const categoryTitle = document.getElementById("category-title");

  // Clear existing products
  productsContainer.innerHTML = "";

  if (categoryId) {
    // Show specific category
    const category = menuData.categories.find((cat) => cat.id === categoryId);
    if (category) {
      categoryTitle.textContent = category.name.toUpperCase();
      category.items.forEach((item) => {
        productsContainer.innerHTML += createProductCard(item);
      });
    }
  } else {
    // Show all products (full menu)
    categoryTitle.textContent = "FULL MENU";
    menuData.categories.forEach((category) => {
      category.items.forEach((item) => {
        productsContainer.innerHTML += createProductCard(item);
      });
    });
  }
}

// Function to set up category navigation
function setupCategoryNavigation() {
  const navLinks = document.querySelectorAll("a[data-category]");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const categoryId = this.getAttribute("data-category");
      displayProducts(categoryId);
    });
  });
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  loadMenuData();
  setupCategoryNavigation();
});

document.getElementById("restaurent-name").addEventListener("click", () => {
  const productsContainer = document.getElementById("products-container");
  const categoryTitle = document.getElementById("category-title");

  productsContainer.innerHTML = "";
  categoryTitle.textContent = "FULL MENU";
  menuData.categories.forEach((category) => {
    category.items.forEach((item) => {
      productsContainer.innerHTML += createProductCard(item);
    });
  });
});

document.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  const hero = document.querySelector(".hero");
  const heroBottom = hero.offsetTop + hero.offsetHeight;

  if (window.scrollY > heroBottom - 300) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

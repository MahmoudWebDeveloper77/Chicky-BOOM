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

  return `<div class="menu-card">
            <div class="menu-image-container">
              <img src="${item.image}"  />
            </div>
            <div class="inner-menu-card">
              <h3>${item.name}</h3>
              <p>
                ${item.description}
              </p>
              <div class="menu-price">${priceHTML}</div>
              <div class="shine-effect"></div>
            </div>
          </div>`;
}

// Function to display products by category
function displayProducts(categoryId = null) {
  // Check if menu data is loaded
  if (!menuData) {
    console.error("Menu data not loaded yet");
    return;
  }

  const menuContainer = document.getElementById("menu-container");
  const categoryTitle = document.getElementById("category-title");

  // Clear existing products
  menuContainer.innerHTML = "";

  if (categoryId) {
    // Show specific category
    const category = menuData.categories.find((cat) => cat.id === categoryId);
    if (category) {
      categoryTitle.textContent = category.name.toUpperCase();
      category.items.forEach((item) => {
        menuContainer.innerHTML += createProductCard(item);
      });
    }
  } else {
    // Show all products (full menu)
    categoryTitle.textContent = "FULL MENU";
    menuData.categories.forEach((category) => {
      category.items.forEach((item) => {
        menuContainer.innerHTML += createProductCard(item);
      });
    });
  }
}

// Function to set up category navigation
function setupCategoryNavigation() {
  const navLinks = document.querySelectorAll("a[data-category]");
  const categoryTitle = document.getElementById("category-title");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const categoryId = this.getAttribute("data-category");
      displayProducts(categoryId);
      categoryTitle.scrollIntoView({ behavior: "smooth" });
    });
  });
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  loadMenuData();
  setupCategoryNavigation();
});

document.getElementById("restaurent-name").addEventListener("click", () => {
  const menuContainer = document.getElementById("menu-container");
  const categoryTitle = document.getElementById("category-title");

  menuContainer.innerHTML = "";
  categoryTitle.textContent = "FULL MENU";
  menuData.categories.forEach((category) => {
    category.items.forEach((item) => {
      menuContainer.innerHTML += createProductCard(item);
    });
  });
});

document.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  const hero = document.querySelector(".hero");
  const heroBottom = hero.offsetTop + hero.offsetHeight;
  const restaurantName = document.getElementById("restaurent-name");
  const navButtons = document.querySelectorAll(".nav-button");

  if (window.scrollY > heroBottom - 300) {
    header.classList.add("scrolled");
    restaurantName.classList.add("colored");
    navButtons.forEach((btn) => btn.classList.add("colored-button"));

    // Close the navbar if it is open
    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
      bsCollapse.hide();
    }
  } else {
    header.classList.remove("scrolled");
    restaurantName.classList.remove("colored");
    navButtons.forEach((btn) => btn.classList.remove("colored-button"));
  }
});

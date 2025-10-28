let menuData = null;

// Function to load JSON data
async function loadMenuData() {
  try {
    const response = await fetch("./menu.json");
    menuData = await response.json();
    displayMenu(); // Show full menu initially
  } catch (error) {
    console.error("Error loading menu data:", error);
  }
}

// Function to create menu card HTML
function createMenuCard(item) {
  let priceHTML = "";

  if (item.prices.length === 1 && !item.prices[0].size) {
    priceHTML = `<span>${item.prices[0].price}</span>`;
  } else {
    priceHTML = item.prices
      .map(
        (price, index) => `
        <div class="${
          index === 0
            ? "first-price"
            : index === 1
            ? "second-price"
            : "third-price"
        }">
          <span>${price.size || ""}</span>
          <span>${price.price}</span>
        </div>
      `
      )
      .join("");
  }

  return `
  <div class="menu-card">
    ${
      item.type
        ? `<div class="badge ${item.type === "عائلي" ? "family-badge" : ""}">${
            item.type
          }</div>`
        : ""
    }
    <div class="menu-image-container">
      <img src="${item.image}" />
    </div>
    <div class="inner-menu-card">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <div class="menu-price">${priceHTML}</div>
      <div class="shine-effect"></div>
    </div>
  </div>`;
}

// Function to display menu by category or full
function displayMenu(categoryId = null) {
  const menuContainer = document.getElementById("menu-container");
  const categoryTitle = document.getElementById("category-title");
  const offersContainer = document.getElementById("offers-container");

  // Always hide offers when viewing menu
  offersContainer.style.display = "none";
  menuContainer.style.display = "flex";

  let html = "";

  if (categoryId) {
    const category = menuData.categories.find((cat) => cat.id === categoryId);
    categoryTitle.textContent = category.name.toUpperCase();
    category.items.forEach((item) => {
      html += createMenuCard(item);
    });
  } else {
    categoryTitle.textContent = "FULL MENU";
    menuData.categories.forEach((category) => {
      category.items.forEach((item) => {
        html += createMenuCard(item);
      });
    });
  }

  menuContainer.innerHTML = html;
  categoryTitle.scrollIntoView({ behavior: "smooth" });
}

// Setup category navigation
function setupCategoryNavigation() {
  const navLinks = document.querySelectorAll("a[data-category]");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const categoryId = this.getAttribute("data-category");
      if (categoryId === "offers") {
        showOffers();
      } else {
        displayMenu(categoryId);
      }
    });
  });
}

// Fetch and show offers
async function showOffers() {
  const offersContainer = document.getElementById("offers-container");
  const menuContainer = document.getElementById("menu-container");
  const categoryTitle = document.getElementById("category-title");

  offersContainer.style.display = "flex";
  menuContainer.style.display = "none";
  categoryTitle.textContent = "OFFERS";

  try {
    const offersResponse = await fetch("./offers.json");
    const offersData = await offersResponse.json();
    displayOffers(offersData.offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
  }

  categoryTitle.scrollIntoView({ behavior: "smooth" });
}

function displayOffers(offers) {
  const offersContainer = document.getElementById("offers-container");
  let html = "";

  offers.forEach((offer) => {
    html += `
      <div class="menu-card">
        <div class="menu-image-container">
          <img src="${offer.image}" />
        </div>
        <div class="inner-menu-card">
          <h3>${offer.name}</h3>
          <p>${offer.description}</p>
          <div class="menu-price">${offer.price}</div>
          <div class="shine-effect"></div>
        </div>
      </div>`;
  });

  offersContainer.innerHTML = html;
}

// Reset to full menu when clicking restaurant name
document.getElementById("restaurent-name").addEventListener("click", () => {
  displayMenu();
});

// Scroll behavior styling
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

document.addEventListener("DOMContentLoaded", () => {
  loadMenuData();
  setupCategoryNavigation();
});

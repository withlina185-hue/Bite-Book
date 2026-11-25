"use strict";

const scriptUrl = document.currentScript.src;

async function initializeMealBuilder() {
  const response = await fetch(new URL("../data/recipes.json?v=6", scriptUrl));
  if (!response.ok) throw new Error("Recipes unavailable");
  const catalog = await response.json();
  const recipes = Object.entries(catalog).map(([id, dish]) => [id, dish.title, dish.type, dish.ingredients]);

  const ingredients = [
    // Each row lists the name, category, price in cents, kcal, protein, carbs and fat per 100 g.
    ["Chicken", "Meat & Poultry", 218, 165, 31, 0, 3.6],
    ["Beef", "Meat & Poultry", 306, 250, 26, 0, 15],
    ["Turkey", "Meat & Poultry", 231, 160, 29, 0, 4],
    ["Grilled Lamb", "Meat & Poultry", 333, 250, 25, 0, 16],
    ["Chicken Shawarma", "Meat & Poultry", 245, 190, 25, 2, 9],
    ["Salmon", "Seafood", 354, 208, 20, 0, 13],
    ["Shrimp", "Seafood", 279, 99, 24, 0, 0.3],
    ["Tuna", "Seafood", 258, 132, 29, 0, 1],
    ["Tofu", "Plant Proteins & Legumes", 177, 144, 17, 3, 9],
    ["Chickpeas", "Plant Proteins & Legumes", 95, 164, 9, 27, 3],
    ["Lentils", "Plant Proteins & Legumes", 88, 116, 9, 20, 0.4],
    ["Falafel", "Plant Proteins & Legumes", 122, 333, 13, 32, 18],
    ["Edamame", "Plant Proteins & Legumes", 133, 121, 12, 9, 5],
    ["Brown Rice", "Grains & Pasta", 102, 123, 2.7, 26, 1],
    ["Quinoa", "Grains & Pasta", 150, 120, 4.4, 21, 1.9],
    ["Basmati Rice", "Grains & Pasta", 95, 130, 3, 28, 0],
    ["Couscous", "Grains & Pasta", 109, 112, 4, 23, 0],
    ["Whole Wheat Pasta", "Grains & Pasta", 122, 149, 6, 30, 2],
    ["Bulgur", "Grains & Pasta", 92, 83, 3, 19, 0.2],
    ["Pita Bread", "Bread & Wraps", 85, 275, 9, 56, 2],
    ["Whole Wheat Wrap", "Bread & Wraps", 105, 290, 9, 48, 7],
    ["Sourdough", "Bread & Wraps", 112, 260, 9, 50, 2],
    ["Ciabatta", "Bread & Wraps", 116, 265, 9, 50, 3],
    ["Mixed Greens", "Leafy Greens", 88, 20, 2, 3, 0.2],
    ["Baby Spinach", "Leafy Greens", 99, 23, 3, 4, 0],
    ["Romaine", "Leafy Greens", 82, 17, 1, 3, 0.3],
    ["Arugula", "Leafy Greens", 102, 25, 3, 4, 1],
    ["Broccoli", "Vegetables & Potatoes", 109, 35, 2.4, 7, 0.4],
    ["Roasted Potatoes", "Vegetables & Potatoes", 116, 93, 3, 21, 0],
    ["Cherry Tomatoes", "Vegetables & Potatoes", 95, 18, 1, 4, 0],
    ["Cucumber", "Vegetables & Potatoes", 68, 15, 1, 4, 0],
    ["Roasted Peppers", "Vegetables & Potatoes", 116, 31, 1, 6, 0],
    ["Carrots", "Vegetables & Potatoes", 75, 41, 1, 10, 0],
    ["Mushrooms", "Vegetables & Potatoes", 122, 22, 3, 3, 0],
    ["Grilled Zucchini", "Vegetables & Potatoes", 105, 25, 2, 4, 1],
    ["Sweet Potato", "Vegetables & Potatoes", 119, 90, 2, 21, 0],
    ["Feta", "Cheese & Eggs", 163, 265, 14, 4, 21],
    ["Mozzarella", "Cheese & Eggs", 156, 280, 28, 3, 17],
    ["Halloumi", "Cheese & Eggs", 197, 320, 22, 2, 25],
    ["Parmesan", "Cheese & Eggs", 184, 431, 38, 4, 29],
    ["Boiled Egg", "Cheese & Eggs", 116, 155, 13, 1, 11],
    ["Avocado", "Toppings & Crunch", 197, 160, 2, 9, 15],
    ["Black Olives", "Toppings & Crunch", 92, 116, 1, 6, 11],
    ["Pickled Onions", "Toppings & Crunch", 71, 30, 1, 6, 0],
    ["Toasted Almonds", "Toppings & Crunch", 143, 579, 21, 22, 50],
    ["Pumpkin Seeds", "Toppings & Crunch", 146, 559, 30, 11, 49],
    ["Croutons", "Toppings & Crunch", 75, 407, 12, 74, 7],
    ["Pickled Cucumbers", "Toppings & Crunch", 71, 12, 1, 2, 0],
    ["Tahini", "Sauces & Dressings", 129, 595, 17, 21, 54],
    ["Lemon Dressing", "Sauces & Dressings", 95, 190, 0, 6, 18],
    ["Garlic Yogurt", "Sauces & Dressings", 105, 95, 4, 5, 6],
    ["Basil Pesto", "Sauces & Dressings", 139, 400, 5, 6, 40],
    ["Harissa", "Sauces & Dressings", 95, 120, 3, 10, 8],
    ["Balsamic Vinaigrette", "Sauces & Dressings", 109, 250, 0, 12, 22],
    ["Smoky BBQ", "Sauces & Dressings", 99, 170, 1, 40, 0],
    ["Garlic Sauce", "Sauces & Dressings", 119, 460, 1, 5, 48],
    ["Hummus", "Spreads & Dips", 109, 166, 8, 14, 10],
    ["Baba Ghanoush", "Spreads & Dips", 119, 120, 3, 10, 8],
    ["Labneh", "Spreads & Dips", 119, 150, 8, 5, 11],
    ["Muhammara", "Spreads & Dips", 146, 260, 5, 17, 20],
    ["Vanilla Ice Cream", "Sweet Bases", 150, 207, 4, 24, 11],
    ["Greek Yogurt", "Sweet Bases", 122, 97, 9, 4, 5],
    ["Chocolate Brownie", "Sweet Bases", 163, 405, 5, 50, 21],
    ["Vanilla Cake", "Sweet Bases", 143, 350, 5, 54, 13],
    ["Mini Pancakes", "Sweet Bases", 136, 227, 6, 28, 10],
    ["Strawberries", "Fruit", 116, 32, 1, 8, 0],
    ["Banana", "Fruit", 85, 89, 1, 23, 0],
    ["Blueberries", "Fruit", 153, 57, 1, 14, 0],
    ["Mango", "Fruit", 133, 60, 1, 15, 0],
    ["Granola", "Sweet Toppings", 133, 471, 10, 64, 20],
    ["Dark Chocolate Chips", "Sweet Toppings", 177, 546, 5, 61, 31],
    ["Crushed Pistachios", "Sweet Toppings", 231, 560, 20, 28, 45],
    ["Whipped Cream", "Sweet Toppings", 146, 257, 3, 12, 22],
    ["Chocolate Sauce", "Sweet Sauces", 122, 280, 2, 65, 2],
    ["Caramel Sauce", "Sweet Sauces", 119, 300, 2, 65, 3],
    ["Honey", "Sweet Sauces", 116, 304, 0, 82, 0],
    ["Berry Compote", "Sweet Sauces", 136, 143, 0, 36, 0],
  ].map(([name, category, cents, calories, protein, carbs, fat]) => ({
    name, category, cents, calories, protein, carbs, fat,
  }));

  const savoryGroups = {
    "Proteins": ["Meat & Poultry", "Seafood", "Plant Proteins & Legumes"],
    "Bases": ["Grains & Pasta", "Bread & Wraps"],
    "Veggies": ["Leafy Greens", "Vegetables & Potatoes"],
    "Toppings": ["Cheese & Eggs", "Toppings & Crunch"],
    "Sauces & Dips": ["Sauces & Dressings", "Spreads & Dips"],
  };
  const dessertGroups = {
    "Sweet Bases": ["Sweet Bases"],
    "Fruit": ["Fruit"],
    "Sweet Toppings": ["Sweet Toppings"],
    "Sweet Sauces": ["Sweet Sauces"],
  };

  const mealTypes = {
    Bowl: { description: "Grains, proteins and toppings", first: "Bases" },
    Salad: { description: "Leafy greens, vegetables and dressings", first: "Veggies" },
    Sandwich: { description: "Bread, fillings and spreads", first: "Bases" },
    Wrap: { description: "Flatbread with fillings and sauces", first: "Bases" },
    Pasta: { description: "Pasta, vegetables and sauces", first: "Bases" },
    "Grill Plate": { description: "Grilled mains with vegetables and sides", first: "Proteins" },
    "Mezze Plate": { description: "Small bites, dips and bread", first: "Sauces & Dips" },
    Dessert: { description: "Cake, fruit, ice cream and sweet toppings", first: "Sweet Bases" },
  };

  const drinkOptions = {
    water: { name: "Still Water", ml: 330, cents: 80, calories: 0, carbs: 0, description: "Plain still water" },
    sparkling: { name: "Sparkling Water", ml: 330, cents: 120, calories: 0, carbs: 0, description: "Carbonated water" },
    orange: { name: "Orange Juice", ml: 250, cents: 240, calories: 112, carbs: 26, description: "Orange juice" },
    lemon: { name: "Lemon & Mint", ml: 250, cents: 260, calories: 90, carbs: 23, description: "Lemon drink with mint" },
  };
  const photoCells = [
    "Chicken", "Beef", "Salmon", "Shrimp", "Chickpeas", "Basmati Rice", "Quinoa", "Pita Bread",
    "Broccoli", "Mixed Greens", "Cherry Tomatoes", "Roasted Potatoes", "Feta", "Avocado", "Tahini", "Orange Juice",
  ];
  const ingredientIcons = {
    "Vanilla Ice Cream": "🍨",
    "Greek Yogurt": "🥣",
    "Chocolate Brownie": "🍫",
    "Vanilla Cake": "🍰",
    "Mini Pancakes": "🥞",
    "Strawberries": "🍓",
    "Banana": "🍌",
    "Blueberries": "🫐",
    "Mango": "🥭",
    "Granola": "🌾",
    "Dark Chocolate Chips": "🍫",
    "Crushed Pistachios": "🌰",
    "Whipped Cream": "🍦",
    "Chocolate Sauce": "🍫",
    "Caramel Sauce": "🍮",
    "Honey": "🍯",
    "Berry Compote": "🫐",

    Turkey: "🍗", "Grilled Lamb": "🥩", "Chicken Shawarma": "🍗", Tuna: "🐟",
    Tofu: "🧈", Lentils: "🫘", Falafel: "🧆", Edamame: "🫛",
    "Brown Rice": "🍚", Couscous: "🌾", "Whole Wheat Pasta": "🍝", Bulgur: "🌾",
    "Whole Wheat Wrap": "🌯", Sourdough: "🍞", Ciabatta: "🥖",
    "Baby Spinach": "🍃", Romaine: "🥬", Arugula: "🌿", Cucumber: "🥒", "Roasted Peppers": "🫑",
    Carrots: "🥕", Mushrooms: "🍄", "Grilled Zucchini": "🥒", "Sweet Potato": "🍠",
    Mozzarella: "🧀", Halloumi: "🧀", Parmesan: "🧀", "Boiled Egg": "🥚",
    "Black Olives": "🫒", "Pickled Onions": "🧅", "Toasted Almonds": "🌰",
    "Pumpkin Seeds": "🌱", Croutons: "🥖", "Pickled Cucumbers": "🥒",
    "Lemon Dressing": "🍋", "Garlic Yogurt": "🧄", "Basil Pesto": "🌿",
    Harissa: "🌶️", "Balsamic Vinaigrette": "🍇", "Smoky BBQ": "🍅", "Garlic Sauce": "🧄",
    Hummus: "🫘", "Baba Ghanoush": "🍆", Labneh: "🥛", Muhammara: "🌶️",
  };

  const recipePhotos = window.biteRecipePhotos ?? {};

  const weights = new Map();
  const bagKey = "bite-and-book.bag";
  const get = id => document.getElementById(id);
  const money = cents => (cents / 100).toFixed(3) + " JOD";
  const typePicker = document.querySelector(".meal-types");
  typePicker.innerHTML = Object.entries(mealTypes).map(([name, type]) => `
    <label>
      <input type="radio" name="meal-type" value="${name}" ${name === "Bowl" ? "checked" : ""}>
      <strong>${name}</strong><small>${type.description}</small>
    </label>`).join("");
  const typeInputs = [...typePicker.querySelectorAll('input[type="radio"]')];
  const requestedType = new URLSearchParams(location.search).get("type");
  const requestedInput = typeInputs.find(input => input.value === requestedType);
  if (requestedInput) requestedInput.checked = true;

  let mealType = typeInputs.find(input => input.checked).value;
  function groupsFor(type) {
    if (type === "Dessert") return dessertGroups;
    if (type === "Sandwich" || type === "Wrap") {
      return { ...savoryGroups, Bases: ["Bread & Wraps"] };
    }
    if (type === "Pasta") {
      return { ...savoryGroups, Bases: ["Grains & Pasta"] };
    }
    return savoryGroups;
  }
  function firstCategory() {
    if (mealType === "Mezze Plate") return "Spreads & Dips";
    return groupsFor(mealType)[activeGroup][0];
  }

  let activeGroup = mealTypes[mealType].first;
  let category = firstCategory();

  const sheet = document.createElement("link");
  sheet.rel = "stylesheet";
  sheet.href = new URL("../css/bite-meal-preview.css?v=8", scriptUrl).href;
  document.head.append(sheet);

  let selectedRecipe = null;
  const recipeControls = document.createElement("section");
  recipeControls.className = "panel recipe-picker";
  recipeControls.innerHTML = `<h2>How would you like to build your meal?</h2>
    <div class="recipe-modes" aria-label="Build mode">
      <button type="button" data-mode="recipes" aria-pressed="true">Customize a dish</button>
      <button type="button" data-mode="scratch" aria-pressed="false">Build from scratch</button>
    </div>
    <div class="recipe-browser">
      <div class="recipe-filters">
        <label>Search dishes<input type="search" placeholder="e.g. Shawarma"></label>
        <label>Meal type<select><option value="">All meal types</option>
          ${Object.keys(mealTypes).map(type => `<option>${type}</option>`).join("")}
        </select></label>
      </div>
      <p class="recipe-results" role="status"></p>
      <div class="recipe-gallery"></div>
      <button type="button" class="outline recipe-more">Load more</button>
    </div>`;
  const typePanel = typePicker.closest("section");
  const editor = document.querySelector(".builder-grid");
  editor.before(recipeControls);
  const back = document.createElement("button");
  back.type = "button";
  back.className = "outline recipe-back";
  back.textContent = "← Back to dishes";
  const editorActions = document.createElement("div");
  editorActions.className = "recipe-editor-actions";
  editorActions.hidden = true;
  const editorFavorite = document.createElement("button");
  editorFavorite.type = "button";
  editorFavorite.className = "outline favorite-button";
  editorActions.append(back, editorFavorite);
  editor.before(editorActions);
  editorFavorite.addEventListener("click", () => toggleFavorite(selectedRecipe));

  const steps = [...document.querySelectorAll(".steps li")];
  let currentStep = 1;
  function setStep(step) {
    currentStep = step;
    steps.forEach((item, index) => {
      item.classList.toggle("is-complete", index + 1 < step);
      if (index + 1 === step) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
    });
  }

  function showCatalog(focus = false) {
    setStep(1);
    editorActions.hidden = true;
    editor.hidden = true;
    browser.hidden = false;
    if (focus) search.focus();
  }

  back.addEventListener("click", () => {
    selectedRecipe = null;
    renderGallery();
    showCatalog(true);
  });
  typePanel.hidden = true;
  const gallery = recipeControls.querySelector(".recipe-gallery");
  const hero = document.createElement("div");
  hero.className = "recipe-hero";
  hero.hidden = true;
  get("plate").before(hero);
  const badge = document.createElement("span");
  badge.className = "bag-count";
  const bagLink = document.querySelector(".bite-header .bag");
  bagLink.append(badge);

  function updateBagCount() {
    try {
      const bag = JSON.parse(localStorage.getItem(bagKey) ?? "[]");
      const count = Array.isArray(bag) ? bag.length : 0;
      badge.textContent = count;
      badge.hidden = !count;
      bagLink.setAttribute("aria-label", `My Account, ${count} meals in bag`);
    } catch {
      badge.hidden = true;
    }
  }

  const browser = recipeControls.querySelector(".recipe-browser");
  const search = browser.querySelector('input[type="search"]');
  const filter = browser.querySelector("select");
  const results = browser.querySelector(".recipe-results");
  const more = browser.querySelector(".recipe-more");
  const favoritesKey = "bite-and-book.favorites";
  const pageSize = 12;
  let limit = pageSize;

  function savedFavorites() {
    try {
      const saved = JSON.parse(localStorage.getItem(favoritesKey) ?? "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  function updateFavoriteButtons() {
    const saved = new Set(savedFavorites().map(dish => dish?.id));
    for (const button of [...gallery.querySelectorAll("[data-favorite]"), editorFavorite]) {
      const active = saved.has(button.dataset.favorite);
      button.setAttribute("aria-pressed", String(active));
      button.textContent = active ? "♥ Favorited" : "♡ Favorite";
    }
  }

  function toggleFavorite(recipe) {
    const [id, title, type] = recipe;
    const saved = savedFavorites();
    const next = saved.some(dish => dish?.id === id)
      ? saved.filter(dish => dish?.id !== id) : [...saved, { id, title, type }];
    try {
      localStorage.setItem(favoritesKey, JSON.stringify(next));
      updateFavoriteButtons();
    } catch {
      const message = "Favorites could not be saved on this browser.";
      if (browser.hidden) get("meal-status").textContent = message;
      else results.textContent = message;
    }
  }

  function renderGallery() {
    const query = search.value.trim().toLowerCase();
    const matching = recipes.filter(([, title, type, items]) =>
      (!filter.value || type === filter.value) &&
      `${title} ${Object.keys(items).join(" ")}`.toLowerCase().includes(query)
    );
    const visible = matching.slice(0, limit);
    gallery.innerHTML = visible.map(([id, title, type, items]) => {
      const subtotal = Object.entries(items).reduce((sum, [name, grams]) =>
        sum + ingredients.find(item => item.name === name).cents * grams, 0);
      const photo = recipePhotos[id];
      return `<article class="recipe-with-favorite">
        <button type="button" class="recipe-card" data-recipe="${id}" aria-pressed="${selectedRecipe?.[0] === id}">
          ${photo ? `<img src="${photo}" alt="" width="320" height="220" loading="lazy">`
            : `<span class="recipe-art" aria-hidden="true">${Object.keys(items).slice(0, 3).map(ingredientArt).join("")}</span>`}
          <span><small>${type}</small><strong>${title}</strong><small>${money(Math.round(subtotal / 100))}</small></span>
        </button>
        <button type="button" class="outline favorite-button" data-favorite="${id}" aria-label="Favorite ${title}">♡ Favorite</button>
      </article>`;
    }).join("");
    results.textContent = matching.length ? `Showing ${visible.length} of ${matching.length} dishes` : "No dishes match your search.";
    more.hidden = visible.length >= matching.length;
    updateFavoriteButtons();
  }

  function resetResults() {
    limit = pageSize;
    renderGallery();
  }
  search.addEventListener("input", resetResults);
  filter.addEventListener("change", resetResults);
  more.addEventListener("click", () => {
    const previousCount = gallery.children.length;
    limit += pageSize;
    renderGallery();
    gallery.children[previousCount]?.querySelector(".recipe-card").focus();
  });
  window.addEventListener("storage", event => {
    if (event.key === favoritesKey || event.key === null) updateFavoriteButtons();
  });
  window.addEventListener("pageshow", updateFavoriteButtons);

  function startRecipe(recipe) {
    browser.hidden = true;
    editor.hidden = false;
    editorActions.hidden = false;
    typePanel.hidden = true;
    setStep(2);
    selectedRecipe = recipe;
    editorFavorite.dataset.favorite = recipe[0];
    editorFavorite.setAttribute("aria-label", `Favorite ${recipe[1]}`);
    updateFavoriteButtons();
    mealType = recipe[2];
    typeInputs.find(input => input.value === mealType).checked = true;
    activeGroup = mealTypes[mealType].first;
    category = firstCategory();
    weights.clear();
    for (const [name, grams] of Object.entries(recipe[3])) {
      weights.set(ingredients.findIndex(item => item.name === name), grams);
    }
    drinksPanel.querySelector('input[value=""]').checked = true;
    gallery.querySelectorAll("[data-recipe]").forEach(card => {
      card.setAttribute("aria-pressed", String(card.dataset.recipe === recipe[0]));
    });
    update();
  }

  recipeControls.addEventListener("click", event => {
    const mode = event.target.closest("[data-mode]");
    if (mode) {
      const scratch = mode.dataset.mode === "scratch";
      recipeControls.querySelectorAll("[data-mode]").forEach(button => {
        button.setAttribute("aria-pressed", String(button === mode));
      });
      browser.hidden = scratch;
      editor.hidden = !scratch;
      editorActions.hidden = true;
      typePanel.hidden = !scratch;
      if (scratch) {
        setStep(1);
        selectedRecipe = null;
        weights.clear();
        drinksPanel.querySelector('input[value=""]').checked = true;
        update();
      } else {
        selectedRecipe = null;
        renderGallery();
        showCatalog();
      }
      return;
    }
    const favorite = event.target.closest("[data-favorite]");
    if (favorite) {
      toggleFavorite(recipes.find(recipe => recipe[0] === favorite.dataset.favorite));
      return;
    }
    const card = event.target.closest("[data-recipe]");
    if (card) {
      startRecipe(recipes.find(recipe => recipe[0] === card.dataset.recipe));
      back.focus();
    }
  });

  const subcategories = document.createElement("div");
  subcategories.className = "categories meal-subcategories";
  subcategories.setAttribute("aria-label", "Ingredient subcategories");
  get("categories").after(subcategories);

  const drinksPanel = document.createElement("section");
  drinksPanel.className = "panel meal-drinks";
  drinksPanel.innerHTML = `<fieldset>
    <legend>Add a drink <small>Optional</small></legend>
    <div class="drink-options">
      <label class="drink-card drink-none">
        <input type="radio" name="meal-drink" value="" checked>
        <span><strong>No drink</strong></span>
      </label>
      ${Object.entries(drinkOptions).map(([id, drink]) => `
        <label class="drink-card">
          <input type="radio" name="meal-drink" value="${id}">
          ${drinkArt(id)}
          <span class="drink-copy"><strong>${drink.name}</strong><small>${drink.description}</small>
            <small>${drink.ml} mL · ${money(drink.cents)}</small></span>
        </label>`).join("")}
    </div></fieldset>`;
  get("ingredients").closest("section").after(drinksPanel);

  function selectedDrink() {
    return drinksPanel.querySelector('input:checked').value;
  }

  const review = document.createElement("button");
  review.type = "button";
  review.className = "button review-meal";
  review.textContent = "Review meal →";
  drinksPanel.append(review);
  review.addEventListener("click", () => {
    setStep(3);
    const summary = document.querySelector(".creation");
    summary.scrollIntoView({ block: "nearest" });
    summary.focus({ preventScroll: true });
  });

  const drinkPreview = document.createElement("div");
  drinkPreview.className = "meal-drink-preview";
  get("plate").after(drinkPreview);

  function drinkArt(id) {
    const details = {
      water: '<path d="M9 15h14" stroke="#5499b9"/>',
      sparkling: '<circle cx="13" cy="19" r="1" fill="#477f9b"/><circle cx="19" cy="15" r="1" fill="#477f9b"/><circle cx="16" cy="23" r="1" fill="#477f9b"/>',
      orange: '<path d="M18 12l3-9h4" stroke="#8a551c"/><circle cx="8" cy="10" r="4" fill="#ffab49" stroke="#b65c12"/>',
      lemon: '<path d="M17 13c-1-6 4-10 9-9-1 6-4 8-9 9Z" fill="#719753" stroke="#466d40"/><path d="M7 11a4 4 0 1 1 6 0" fill="#f6cf56" stroke="#ab7924"/>',
    };
    return `<svg class="drink-icon drink-icon--${id}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path class="drink-liquid" d="M8 14h16l-2 13H10Z"/>
      <path d="M7 10h18l-3 17H10Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      ${details[id]}
    </svg>`;
  }

  function ingredientArt(name) {
    const cell = photoCells.indexOf(name);
    if (cell === -1) return `<span class="ingredient-illustration" aria-hidden="true">${ingredientIcons[name] ?? "🍽️"}</span>`;
    return `<span class="ingredient-photo" aria-hidden="true" style="--food-x:${(cell % 4) * 100 / 3}%;--food-y:${Math.floor(cell / 4) * 100 / 3}%"></span>`;
  }

  function renderControls() {
    const groups = groupsFor(mealType);
    const previousAction = document.activeElement.dataset.action;
    const previousIndex = document.activeElement.dataset.index;
    get("categories").innerHTML = Object.entries(groups).map(([name, categories]) => {
      const count = [...weights.keys()].filter(index => categories.includes(ingredients[index].category)).length;
      return `<button type="button" data-group="${name}" aria-pressed="${name === activeGroup}">${name}${count ? ` (${count})` : ""}</button>`;
    }).join("");
    subcategories.innerHTML = groups[activeGroup].map(name =>
      `<button type="button" data-category="${name}" aria-pressed="${name === category}">${name}</button>`
    ).join("");
    get("ingredients").innerHTML = ingredients.map((item, index) => {
      if (item.category !== category) return "";
      const grams = weights.get(index);
      const controls = grams
        ? `<div class="quantity">
            <button data-action="minus" data-index="${index}" aria-label="Decrease ${item.name}">−</button>
            <strong>${grams} g</strong>
            <button data-action="plus" data-index="${index}" aria-label="Increase ${item.name}" ${grams >= 500 ? "disabled" : ""}>+</button>
          </div>`
        : `<button data-action="add" data-index="${index}" aria-label="Add ${item.name}">+ Add</button>`;
      return `<div class="ingredient"><div class="ingredient-info">${ingredientArt(item.name)}<div><strong>${item.name}</strong><small>${money(item.cents)} / 100 g · ${item.calories} kcal</small></div></div>${controls}</div>`;
    }).join("");
    if (previousAction && previousIndex !== undefined) {
      const buttons = [...get("ingredients").querySelectorAll(`button[data-index="${previousIndex}"]:enabled`)];
      const replacement = buttons.find(button => button.dataset.action === previousAction)
        ?? buttons.find(button => button.dataset.action === "plus") ?? buttons[0];
      replacement?.focus();
    }
  }

  function renderSummary() {
    const totals = { grams: 0, cents: 0, calories: 0, protein: 0, carbs: 0, fat: 0 };
    const items = [];
    for (const [index, grams] of weights) {
      const item = ingredients[index];
      totals.grams += grams;
      for (const key of ["cents", "calories", "protein", "carbs", "fat"]) {
        totals[key] += item[key] * grams / 100;
      }
      items.push({ ...item, index, grams });
    }
    const name = selectedRecipe?.[1] ?? "Custom " + mealType;
    hero.hidden = !selectedRecipe;
    hero.innerHTML = !hero.hidden
      ? `<img src="${recipePhotos[selectedRecipe[0]]}" alt="${selectedRecipe[1]}" width="320" height="220">`
      : "";
    get("meal-name").textContent = name;
    get("clear").textContent = selectedRecipe ? "Reset dish" : "Clear all";
    get("weight").textContent = `${totals.grams} g total weight`;
    const dishType = mealType;
    const drinkId = selectedDrink();
    const drink = drinkOptions[drinkId];
    if (drink) {
      totals.cents += drink.cents;
      totals.calories += drink.calories;
      totals.carbs += drink.carbs;
    }

    get("plate").dataset.dish = dishType;
    const visibleItems = items.slice(0, 8);
    get("plate").innerHTML = visibleItems.map(item =>
      `<div class="plate-item">${ingredientArt(item.name)}</div>`
    ).join("");
    if (items.length > visibleItems.length) {
      get("weight").textContent += ` · +${items.length - visibleItems.length} more below`;
    }
    drinkPreview.innerHTML = drink
      ? `${drinkArt(drinkId)} <span>${drink.name} · ${drink.ml} mL</span>`
      : "";
    get("selection").innerHTML = items.map(item =>
      `<li><span>${item.name}</span><span>${item.grams} g</span><button data-index="${item.index}" aria-label="Remove ${item.name}">×</button></li>`
    ).join("");
    for (const key of ["calories", "protein", "carbs", "fat"]) {
      get(key).textContent = `${Math.round(totals[key])} ${key === "calories" ? "kcal" : "g"}`;
    }
    get("total").textContent = money(Math.round(totals.cents));
    get("add-cart").disabled = !items.length;
    review.disabled = !items.length;
    return { name, mealType, recipeId: selectedRecipe?.[0] ?? "", currency: "JOD", drinkId, drinkName: drink?.name, drinkMl: drink?.ml, grams: totals.grams, cents: Math.round(totals.cents), items: items.map(({name, grams}) => ({ name, grams })) };
  }

  function update() {
    if (currentStep === 3) setStep(2);
    get("meal-status").textContent = "";
    get("view-bag").hidden = true;
    renderControls();
    renderSummary();
  }

  get("categories").addEventListener("click", event => {
    const button = event.target.closest("[data-group]");
    if (!button) return;
    activeGroup = button.dataset.group;
    category = groupsFor(mealType)[activeGroup][0];
    renderControls();
    get("categories").querySelector('[aria-pressed="true"]').focus();
  });

  subcategories.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    category = button.dataset.category;
    renderControls();
    subcategories.querySelector('[aria-pressed="true"]').focus();
  });

  drinksPanel.addEventListener("change", update);

  get("ingredients").addEventListener("click", event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const index = Number(button.dataset.index);
    setStep(2);
    const current = weights.get(index) ?? 0;
    const grams = { add: 100, plus: Math.min(500, current + 10), minus: current - 10 }[button.dataset.action];
    if (grams > 0) weights.set(index, grams);
    else weights.delete(index);
    update();
  });

  get("selection").addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    weights.delete(Number(button.dataset.index));
    update();
    (get("selection").querySelector("button") ?? get("clear")).focus();
  });

  get("clear").addEventListener("click", () => {
    if (selectedRecipe) { startRecipe(selectedRecipe); return; }
    weights.clear();
    drinksPanel.querySelector('input[value=""]').checked = true;
    update();
  });

  typePicker.addEventListener("change", event => {
    setStep(2);
    mealType = event.target.value;
    activeGroup = mealTypes[mealType].first;
    category = firstCategory();
    const allowed = Object.values(groupsFor(mealType)).flat();
    for (const index of weights.keys()) {
      if (!allowed.includes(ingredients[index].category)) weights.delete(index);
    }
    update();
  });

  get("add-cart").addEventListener("click", () => {
    setStep(3);
    try {
      const meal = renderSummary();
      const bag = JSON.parse(localStorage.getItem(bagKey) ?? "[]");
      bag.push(meal);
      localStorage.setItem(bagKey, JSON.stringify(bag));
      updateBagCount();
      get("meal-status").textContent = `${meal.name} added to your bag.`;
      get("view-bag").hidden = false;
    } catch {
      get("meal-status").textContent = "Your bag could not be saved.";
    }
  });
  window.addEventListener("storage", event => {
    if (event.key === bagKey || event.key === null) updateBagCount();
  });
  window.addEventListener("pageshow", updateBagCount);
  updateBagCount();
  const recipeId = new URLSearchParams(location.search).get("recipe");
  const initialRecipe = recipes.find(recipe => recipe[0] === recipeId);
  renderGallery();
  if (initialRecipe) startRecipe(initialRecipe);
  else showCatalog();
}

initializeMealBuilder().catch(() => {
  const message = document.createElement("p");
  message.setAttribute("role", "alert");
  message.textContent = "Dishes could not be loaded. Open the project through localhost and reload.";
  document.querySelector(".builder-grid").before(message);
});

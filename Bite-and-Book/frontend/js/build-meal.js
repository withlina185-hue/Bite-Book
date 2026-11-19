"use strict";

const ingredients = [
  // Each row lists the name, category, price in cents, kcal, protein, carbs and fat per 100 g.
  ["Chicken", "Protein", 320, 165, 31, 0, 3.6],
  ["Beef", "Protein", 450, 250, 26, 0, 15],
  ["Tofu", "Protein", 260, 144, 17, 3, 9],
  ["Brown Rice", "Carbohydrates", 150, 123, 2.7, 26, 1],
  ["Quinoa", "Carbohydrates", 220, 120, 4.4, 21, 1.9],
  ["Broccoli", "Vegetables", 160, 35, 2.4, 7, .4],
  ["Mixed Greens", "Vegetables", 130, 20, 2, 3, .2],
  ["Avocado", "Extras", 290, 160, 2, 9, 15],
  ["Feta", "Extras", 240, 265, 14, 4, 21],
  ["Tahini", "Sauces", 190, 595, 17, 21, 54],
  ["Lemon Dressing", "Sauces", 140, 190, 0, 6, 18],
].map(([name, category, cents, calories, protein, carbs, fat]) => ({
  name, category, cents, calories, protein, carbs, fat,
}));

const colors = {
  Protein: "#cda473", Carbohydrates: "#ddc897", Vegetables: "#5a763d",
  Extras: "#9eaa55", Sauces: "#c6b982",
};
const weights = new Map();
const bagKey = "bite-and-book.bag";
const get = id => document.getElementById(id);
const money = cents => "$" + (cents / 100).toFixed(2);
const typeInputs = [...document.querySelectorAll('[name="meal-type"]')];
const requestedType = new URLSearchParams(location.search).get("type");
const requestedInput = typeInputs.find(input => input.value === requestedType);
if (requestedInput) requestedInput.checked = true;
let category = "Protein";

function renderControls() {
  const previousAction = document.activeElement.dataset.action;
  const previousIndex = document.activeElement.dataset.index;
  get("categories").innerHTML = Object.keys(colors).map(name => {
    const count = [...weights.keys()].filter(index => ingredients[index].category === name).length;
    return `<button type="button" data-category="${name}" aria-pressed="${name === category}">${name}${count ? ` (${count})` : ""}</button>`;
  }).join("");
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
    return `<div class="ingredient"><div><strong>${item.name}</strong><small>${money(item.cents)} / 100 g · ${item.calories} kcal</small></div>${controls}</div>`;
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
  const name = "Custom " + typeInputs.find(input => input.checked).value;
  get("meal-name").textContent = name;
  get("weight").textContent = `${totals.grams} g total weight`;
  get("plate").innerHTML = items.slice(0, 4).map(item =>
    `<span style="background:${colors[item.category]}"></span>`
  ).join("");
  get("selection").innerHTML = items.map(item =>
    `<li><span>${item.name}</span><span>${item.grams} g</span><button data-index="${item.index}" aria-label="Remove ${item.name}">×</button></li>`
  ).join("");
  for (const key of ["calories", "protein", "carbs", "fat"]) {
    get(key).textContent = `${Math.round(totals[key])} ${key === "calories" ? "kcal" : "g"}`;
  }
  get("total").textContent = money(Math.round(totals.cents));
  get("add-cart").disabled = !items.length;
  return { name, grams: totals.grams, cents: Math.round(totals.cents), items: items.map(({name, grams}) => ({ name, grams })) };
}

function update() {
  get("meal-status").textContent = "";
  get("view-bag").hidden = true;
  renderControls();
  renderSummary();
}

get("categories").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  category = button.dataset.category;
  renderControls();
  get("categories").querySelector('[aria-pressed="true"]').focus();
});

get("ingredients").addEventListener("click", event => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const index = Number(button.dataset.index);
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
  weights.clear();
  update();
});

typeInputs.forEach(input => input.addEventListener("change", update));

get("add-cart").addEventListener("click", () => {
  try {
    const meal = renderSummary();
    const bag = JSON.parse(localStorage.getItem(bagKey) ?? "[]");
    bag.push(meal);
    localStorage.setItem(bagKey, JSON.stringify(bag));
    get("meal-status").textContent = `${meal.name} added to your bag.`;
    get("view-bag").hidden = false;
  } catch {
    get("meal-status").textContent = "Your bag could not be saved.";
  }
});
update();

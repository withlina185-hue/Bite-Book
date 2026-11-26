"use strict";

const ingredientRows = [
  ["Chicken", "Protein", 320, 165, 31, 0, 3.6],
  ["Beef", "Protein", 450, 250, 26, 0, 15],
  ["Tofu", "Protein", 260, 144, 17, 3, 9],
  ["Brown Rice", "Carbohydrates", 150, 123, 2.7, 26, 1],
  ["Quinoa", "Carbohydrates", 220, 120, 4.4, 21, 1.9],
  ["Broccoli", "Vegetables", 160, 35, 2.4, 7, 0.4],
  ["Mixed Greens", "Vegetables", 130, 20, 2, 3, 0.2],
  ["Avocado", "Extras", 290, 160, 2, 9, 15],
  ["Feta", "Extras", 240, 265, 14, 4, 21],
  ["Tahini", "Sauces", 190, 595, 17, 21, 54],
  ["Lemon Dressing", "Sauces", 140, 190, 0, 6, 18]
];

const ingredients = [];

for (const row of ingredientRows) {
  ingredients.push({
    name: row[0],
    category: row[1],
    cents: row[2],
    calories: row[3],
    protein: row[4],
    carbs: row[5],
    fat: row[6]
  });
}

const colors = {
  Protein: "#cda473",
  Carbohydrates: "#ddc897",
  Vegetables: "#5a763d",
  Extras: "#9eaa55",
  Sauces: "#c6b982"
};

const weights = new Map();
const bagKey = "bite-and-book.bag";
const typeInputs = document.querySelectorAll('[name="meal-type"]');
const requestedType = new URLSearchParams(location.search).get("type");

let category = "Protein";

for (const input of typeInputs) {
  if (input.value === requestedType) {
    input.checked = true;
    break;
  }
}

function get(id) {
  return document.getElementById(id);
}

function money(cents) {
  return "$" + (cents / 100).toFixed(2);
}


function renderControls() {
  const previousAction = document.activeElement.dataset.action;
  const previousIndex = document.activeElement.dataset.index;

  let categoryHtml = "";

  for (const name of Object.keys(colors)) {
    let count = 0;

    for (const index of weights.keys()) {
      if (ingredients[index].category === name) {
        count++;
      }
    }

    let label = name;

    if (count > 0) {
      label += " (" + count + ")";
    }

    categoryHtml += `
      <button type="button" data-category="${name}"
              aria-pressed="${name === category}">${label}</button>
    `;
  }

  get("categories").innerHTML = categoryHtml;

  let ingredientHtml = "";

  for (let index = 0; index < ingredients.length; index++) {
    const item = ingredients[index];

    if (item.category !== category) {
      continue;
    }

    const grams = weights.get(index);
    let controls;

    if (grams > 0) {
      let disabled = "";

      if (grams >= 500) {
        disabled = "disabled";
      }

      controls = `
        <div class="quantity">
          <button data-action="minus" data-index="${index}"
                  aria-label="Decrease ${item.name}">−</button>
          <strong>${grams} g</strong>
          <button data-action="plus" data-index="${index}"
                  aria-label="Increase ${item.name}" ${disabled}>+</button>
        </div>
      `;
    } else {
      controls = `
        <button data-action="add" data-index="${index}"
                aria-label="Add ${item.name}">+ Add</button>
      `;
    }

    ingredientHtml += `
      <div class="ingredient">
        <div>
          <strong>${item.name}</strong>
          <small>${money(item.cents)} / 100 g · ${item.calories} kcal</small>
        </div>
        ${controls}
      </div>
    `;
  }

  get("ingredients").innerHTML = ingredientHtml;

 
  if (previousAction && previousIndex !== undefined) {
    const buttons = get("ingredients").querySelectorAll(
      `button[data-index="${previousIndex}"]:enabled`
    );

    let replacement = buttons[0];

    for (const button of buttons) {
      if (button.dataset.action === "plus") {
        replacement = button;
      }

      if (button.dataset.action === previousAction) {
        replacement = button;
        break;
      }
    }

    if (replacement) {
      replacement.focus();
    }
  }
}


function renderSummary() {
  const totals = {
    grams: 0,
    cents: 0,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };

  const items = [];
  let plateHtml = "";
  let selectionHtml = "";

  for (const entry of weights) {
    const index = entry[0];
    const grams = entry[1];
    const item = ingredients[index];
    const portion = grams / 100;

    totals.grams += grams;
    totals.cents += item.cents * portion;
    totals.calories += item.calories * portion;
    totals.protein += item.protein * portion;
    totals.carbs += item.carbs * portion;
    totals.fat += item.fat * portion;

    if (items.length < 4) {
      plateHtml += `<span style="background:${colors[item.category]}"></span>`;
    }

    selectionHtml += `
      <li>
        <span>${item.name}</span>
        <span>${grams} g</span>
        <button data-index="${index}" aria-label="Remove ${item.name}">×</button>
      </li>
    `;

    items.push({ name: item.name, grams: grams });
  }

  let name = "Custom ";

  for (const input of typeInputs) {
    if (input.checked) {
      name += input.value;
      break;
    }
  }

  const finalCents = Math.round(totals.cents);

  get("meal-name").textContent = name;
  get("weight").textContent = totals.grams + " g total weight";
  get("plate").innerHTML = plateHtml;
  get("selection").innerHTML = selectionHtml;
  get("calories").textContent = Math.round(totals.calories) + " kcal";
  get("protein").textContent = Math.round(totals.protein) + " g";
  get("carbs").textContent = Math.round(totals.carbs) + " g";
  get("fat").textContent = Math.round(totals.fat) + " g";
  get("total").textContent = money(finalCents);
  get("add-cart").disabled = items.length === 0;

  return {
    name: name,
    grams: totals.grams,
    cents: finalCents,
    items: items
  };
}

function update() {
  get("meal-status").textContent = "";
  get("view-bag").hidden = true;
  renderControls();
  renderSummary();
}

get("categories").addEventListener("click", function (event) {
  const button = event.target.closest("[data-category]");

  if (button === null) {
    return;
  }

  category = button.dataset.category;
  renderControls();
  get("categories").querySelector('[aria-pressed="true"]').focus();
});

get("ingredients").addEventListener("click", function (event) {
  const button = event.target.closest("[data-action]");

  if (button === null) {
    return;
  }

  const index = Number(button.dataset.index);
  const action = button.dataset.action;
  let current = 0;

  if (weights.has(index)) {
    current = weights.get(index);
  }

  let grams;

  if (action === "add") {
    grams = 100;
  } else if (action === "plus") {
    grams = Math.min(500, current + 10);
  } else if (action === "minus") {
    grams = current - 10;
  }

  if (grams > 0) {
    weights.set(index, grams);
  } else {
    weights.delete(index);
  }

  update();
});

get("selection").addEventListener("click", function (event) {
  const button = event.target.closest("button");

  if (button === null) {
    return;
  }

  weights.delete(Number(button.dataset.index));
  update();

  let nextButton = get("selection").querySelector("button");

  if (nextButton === null) {
    nextButton = get("clear");
  }

  nextButton.focus();
});

get("clear").addEventListener("click", function () {
  weights.clear();
  update();
});

for (const input of typeInputs) {
  input.addEventListener("change", update);
}

get("add-cart").addEventListener("click", function () {
  try {
    const meal = renderSummary();
    const savedBag = localStorage.getItem(bagKey);
    let bag = [];

    if (savedBag !== null) {
      bag = JSON.parse(savedBag);
    }

    bag.push(meal);
    localStorage.setItem(bagKey, JSON.stringify(bag));

    get("meal-status").textContent = meal.name + " added to your bag.";
    get("view-bag").hidden = false;
  } catch {
    get("meal-status").textContent = "Your bag could not be saved.";
  }
});

update();

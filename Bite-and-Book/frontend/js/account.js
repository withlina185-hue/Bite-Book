/*Leena Nofal*/



"use strict";

const bagKey = "bite-and-book.bag";
const panels = document.querySelectorAll(".account-content > section");
const navigation = document.querySelectorAll(".profile [data-panel]");
const bagList = document.getElementById("bag-meals");
const bagEmpty = document.getElementById("bag-empty");

function showPanel(id) {
  let active = "overview";

  for (const panel of panels) {
    if (panel.id === id) {
      active = id;
      break;
    }
  }

  for (const panel of panels) {
    panel.hidden = panel.id !== active;
  }

  for (const button of navigation) {
    if (button.dataset.panel === active) {
      button.setAttribute("aria-pressed", "true");
    } else {
      button.setAttribute("aria-pressed", "false");
    }
  }
}

function readBag() {
  try {
    const savedBag = localStorage.getItem(bagKey);

    if (savedBag === null) {
      return [];
    }

    const bag = JSON.parse(savedBag);

    if (Array.isArray(bag)) {
      return bag;
    }
  } catch {
    return [];
  }

  return [];
}

function renderBag() {
  const bag = readBag();

  bagEmpty.hidden = bag.length > 0;
  bagList.replaceChildren();

  for (let index = 0; index < bag.length; index++) {
    const meal = bag[index];
    const row = document.createElement("li");
    const remove = document.createElement("button");
    const price = (meal.cents / 100).toFixed(3);

    remove.type = "button";
    remove.dataset.index = index;
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${meal.name} from your bag`);

    row.append(`${meal.name} · ${meal.grams} g · ${price} JOD `, remove);
    bagList.append(row);
  }
}

document.addEventListener("click", function (event) {
  const button = event.target.closest("[data-panel]");

  if (button === null) {
    return;
  }

  const panel = button.dataset.panel;
  location.hash = panel;

  for (const tab of navigation) {
    if (tab.dataset.panel === panel) {
      if (tab !== button) {
        tab.focus();
      }
      break;
    }
  }
});

bagList.addEventListener("click", function (event) {
  const button = event.target.closest("[data-index]");

  if (button === null) {
    return;
  }

  const bag = readBag();
  const index = Number(button.dataset.index);
  bag.splice(index, 1);

  try {
    localStorage.setItem(bagKey, JSON.stringify(bag));
    renderBag();

    let nextElement = bagList.querySelector("button");

    if (nextElement === null) {
      nextElement = document.querySelector("#orders a");
    }

    if (nextElement !== null) {
      nextElement.focus();
    }
  } catch {
    bagEmpty.hidden = false;
    bagEmpty.textContent = "Your bag could not be updated.";
  }
});

window.addEventListener("hashchange", function () {
  showPanel(location.hash.slice(1));
});

window.addEventListener("storage", function (event) {
  if (event.key === bagKey || event.key === null) {
    renderBag();
  }
});

showPanel(location.hash.slice(1));
renderBag();

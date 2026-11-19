"use strict";

const bagKey = "bite-and-book.bag";
const panels = [...document.querySelectorAll(".account-content > section")];
const navigation = [...document.querySelectorAll(".profile [data-panel]")];
const bagList = document.getElementById("bag-meals");
const bagEmpty = document.getElementById("bag-empty");

function showPanel(id) {
  const active = panels.some(panel => panel.id === id) ? id : "overview";
  panels.forEach(panel => { panel.hidden = panel.id !== active; });
  navigation.forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.panel === active));
  });
}

function readBag() {
  try {
    const data = JSON.parse(localStorage.getItem(bagKey) ?? "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function renderBag() {
  const bag = readBag();
  bagEmpty.hidden = bag.length > 0;
  bagList.replaceChildren();
  bag.forEach((meal, index) => {
    const row = document.createElement("li");
    const remove = document.createElement("button");
    remove.type = "button";
    remove.dataset.index = index;
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${meal.name} from your bag`);
    row.append(`${meal.name} · ${meal.grams} g · $${(meal.cents / 100).toFixed(2)} `, remove);
    bagList.append(row);
  });
}

document.addEventListener("click", event => {
  const button = event.target.closest("[data-panel]");
  if (!button) return;
  const panel = button.dataset.panel;
  location.hash = panel;
  if (!navigation.includes(button)) {
    navigation.find(tab => tab.dataset.panel === panel)?.focus();
  }
});

bagList.addEventListener("click", event => {
  const button = event.target.closest("[data-index]");
  if (!button) return;
  const bag = readBag();
  bag.splice(Number(button.dataset.index), 1);
  try {
    localStorage.setItem(bagKey, JSON.stringify(bag));
    renderBag();
    (bagList.querySelector("button") ?? document.querySelector("#orders a")).focus();
  } catch {
    bagEmpty.hidden = false;
    bagEmpty.textContent = "Your bag could not be updated.";
  }
});

window.addEventListener("hashchange", () => showPanel(location.hash.slice(1)));
window.addEventListener("storage", event => {
  if (event.key === bagKey || event.key === null) renderBag();
});
showPanel(location.hash.slice(1));
renderBag();

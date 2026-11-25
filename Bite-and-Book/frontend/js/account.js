"use strict";

const bagKey = "bite-and-book.bag";
const panels = [...document.querySelectorAll(".account-content > section")];
const navigation = [...document.querySelectorAll(".profile [data-panel]")];
const bagList = document.getElementById("bag-meals");
let confirming = false;
const bagLink = document.querySelector(".bite-header .bag");
const badge = document.createElement("span");
badge.className = "bag-count";
bagLink.append(badge);
const badgeStyle = document.createElement("style");
badgeStyle.textContent = ".bite-header .bag {position:relative} .bag-count{position:absolute;top:-5px;right:-7px;border-radius:20px;padding:1px 5px;background:#985b45;color:#fff;font-size:11px;font-weight:700}";
document.head.append(badgeStyle);
const orderMoney = (amount, currency) => currency === "JOD"
  ? (amount / 100).toFixed(3) + " JOD"
  : "$" + (amount / 100).toFixed(2);
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
  badge.textContent = bag.length;
  badge.hidden = !bag.length;
  bagLink.setAttribute("aria-label", `My Account, ${bag.length} meals in bag`);
  bagList.replaceChildren();
  bag.forEach((meal, index) => {
    const row = document.createElement("li");
    const remove = document.createElement("button");
    remove.type = "button";
    remove.dataset.index = index;
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${meal.name} from your bag`);
    remove.disabled = confirming;
    const confirm = document.createElement("button");
    confirm.type = "button";
    confirm.textContent = "Confirm order";
    confirm.disabled = confirming || meal.currency !== "JOD";
    if (meal.currency !== "JOD") confirm.title = "Rebuild this meal to use current JOD pricing.";
    confirm.addEventListener("click", () => confirmOrder(meal, index));
    const drink = meal.drinkName ? ` + ${meal.drinkName} (${meal.drinkMl} mL)` : "";
    row.append(`${meal.name}${drink} · ${meal.grams} g · ${orderMoney(meal.cents, meal.currency)} `, remove, " ", confirm);
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
  if (!button || confirming) return;
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

const ordersPanel = document.getElementById("orders");
const recentCard = [...document.querySelectorAll(".account-cards .panel")].find(card =>
  card.querySelector("h2")?.textContent.trim().toLowerCase() === "recent order");
if (recentCard) {
  for (const child of [...recentCard.children].slice(1)) child.remove();
}
const recentOrder = document.createElement("p");
recentOrder.textContent = "Sign in to see your latest order.";
recentCard?.append(recentOrder);
const exampleOrder = ordersPanel.querySelector(":scope > p");
if (exampleOrder?.textContent.startsWith("Recent order")) exampleOrder.remove();
const historyHeading = document.createElement("h3");
historyHeading.textContent = "Confirmed orders";
const orderHistory = document.createElement("ul");
const orderStatus = document.createElement("p");
orderStatus.setAttribute("role", "status");
ordersPanel.append(historyHeading, orderHistory, orderStatus);

async function requestOrders(endpoint, options) {
  const response = await fetch("../backend/" + endpoint, options);
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) throw new Error(data?.error ?? "The order service is unavailable.");
  return data;
}

async function loadOrders() {
  const { orders } = await requestOrders("get-orders.php");
  orderHistory.replaceChildren(...orders.map(order => {
    const row = document.createElement("li");
    const drink = order.drink_name ? ` + ${order.drink_name} (${order.drink_ml} mL)` : "";
    row.textContent = `#${order.id} · ${order.recipe_name ?? order.meal_type}${drink} · ${orderMoney(order.total_cents, order.currency)}`;
    return row;
  }));
  const latest = orders[0];
  recentOrder.textContent = latest
    ? `${latest.recipe_name ?? latest.meal_type} · ${orderMoney(latest.total_cents, latest.currency)}`
    : "You have no confirmed orders yet.";
  orderStatus.textContent = orders.length ? "" : "You have no confirmed orders yet.";
}

async function confirmOrder(meal, index) {
  if (confirming) return;
  confirming = true;
  renderBag();
  orderStatus.textContent = "Confirming…";
  try {
    const order = await requestOrders("save-order.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meal_type: meal.mealType ?? meal.name.replace(/^Custom /, ""),
        recipe_id: meal.recipeId ?? "",
        items: meal.items,
        drink_id: meal.drinkId ?? "",
      }),
    });
    const bag = readBag();
    let message = `Order #${order.id} confirmed.`;
    if (JSON.stringify(bag[index]) === JSON.stringify(meal)) {
      bag.splice(index, 1);
      try {
        localStorage.setItem(bagKey, JSON.stringify(bag));
      } catch {
        message += " The local bag could not be updated.";
      }
    }
    try {
      await loadOrders();
    } catch {
      message += " Reload to see your order history.";
    }
    orderStatus.textContent = message;
  } catch (error) {
    orderStatus.textContent = error.message;
  } finally {
    confirming = false;
    renderBag();
  }
}

window.addEventListener("hashchange", () => showPanel(location.hash.slice(1)));
window.addEventListener("storage", event => {
  if (event.key === bagKey || event.key === null) renderBag();
});
showPanel(location.hash.slice(1));
renderBag();

loadOrders().catch(error => { orderStatus.textContent = error.message; });

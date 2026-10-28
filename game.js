// ============================================
//  Mystery Game Engine
//  You do not need to edit this file.
//  See the cheat sheet for how to use it.
// ============================================

const Layout = document.getElementById("flex-layout");
const Temp = document.getElementById("temp");
const ItemImages = {
  Keycard: "https://static.vecteezy.com/system/resources/thumbnails/060/066/646/small_2x/energetic-beautiful-sci-fi-keycard-glowing-symbols-metallic-finish-futuristic-design-no-background-with-transparent-background-expertly-shot-free-png.png",
  NPCIA_Badge: "https://images.pixels.com/images/artworkimages/medium/2/drug-enforcement-administration-d-e-a-special-agent-badge-over-white-leather-serge-averbukh-transparent.png"
};
let Inventory = [];

// ---------- ITEMS ----------

function addItem(item) {
  let bag = getBag();
  if (!bag.includes(item)) {
    bag.push(item);
    save("inventory", bag);
  }
  refresh();
}

function removeItem(item) {
  let bag = getBag().filter(function (i) { return i !== item; });
  save("inventory", bag);
  refresh();
}

function removeAllItems() {
  save("inventory", []);
  refresh();
}

function hasItem(item) {
  return getBag().includes(item);
}

// ---------- NUMBERS (hp, score, money, anything) ----------

function changeNumber(name, amount) {
  let now = getNumber(name) + amount;
  save("num_" + name, now);
  refresh();
  checkGameOver();
}

function setNumber(name, amount) {
  save("num_" + name, amount);
  refresh();
  checkGameOver();
}

function getNumber(name) {
  let saved = load("num_" + name);
  return saved === null ? 0 : saved;
}

// ---------- STATtUS ----------

function addStatus(text) {
  let list = getStatuses();
  if (!list.includes(text)) {
    list.push(text);
    save("statuses", list);
  }
  refresh();
}

function removeStatus(text) {
  let list = getStatuses().filter(function (s) { return s !== text; });
  save("statuses", list);
  refresh();
}

function hasStatus(text) {
  return getStatuses().includes(text);
}

// ---------- NAV ----------

function goBack() {
  history.back();
}

function resetGame() {
  localStorage.clear();
  window.location.href = "index.html";
}

function hasVisited(page) {
  return getVisited().includes(page);
}

// ---------- SETTINGS ----------
// Change these two lines if you want automatic game over.
// Leave them alone if your losing ending is just a page the player clicks to.

let gameOverNumber = "Sanity";          // example: "hp"
let gameOverPage = "fail.html";            // example: "game-over.html"

// ============================================
//  Everything below runs on its own
// ============================================

function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function load(key) {
  let v = localStorage.getItem(key);
  return v === null ? null : JSON.parse(v);
}
function getBag() { return load("inventory") || []; }
function getStatuses() { return load("statuses") || []; }
function getVisited() { return load("visited") || []; }

function markVisited() {
  let page = window.location.pathname.split("/").pop();
  let list = getVisited();
  if (!list.includes(page)) {
    list.push(page);
    save("visited", list);
  }
}

function checkGameOver() {
  if (!gameOverNumber || !gameOverPage) return;
  if (load("num_" + gameOverNumber) === null) return;   // not started yet
  if (getNumber(gameOverNumber) <= 0) {
    window.location.href = gameOverPage;
  }
}

function refresh() {
  // fill in inventory and status spans
  let inv = document.getElementById("inventory");
  // console.logs dont show up in the vscode terminal, you have
  // to use the dev tool's console in the browser
  if (inv) {
    let bag = getBag();
    // bag[0]
    for (let itemIndex in bag) {
      let item = bag[itemIndex];
      // if the player alr has the item, don't do anything
      if (Inventory[item]) { continue; }
      Inventory[item] = true;
      let New = Temp.cloneNode(true);
      let NewImage = New.querySelector("img");
      let NewLabel = New.querySelector("label");
      New.id = item;
      NewImage.src = ItemImages[item];
      NewLabel.innerText = item;
      New.hidden = false;
      Layout.appendChild(New);
    }
    // inv.textContent = bag.length ? bag.join(", ") : "nothing yet";
  }

  let sleepvalue = document.getElementById("sleep-value");
  let sanityvalue = document.getElementById("sanity-value");
  if (sleepvalue && sanityvalue) {
    checkGameOver();
    sleepvalue.innerText = getNumber("Sleep").toString() + " / 100";
    sanityvalue.innerText = getNumber("Sanity").toString() + " / 100";
  }

  // fill in any number display: <span data-number="hp"></span>
  document.querySelectorAll("[data-number]").forEach(function (el) {
    el.textContent = getNumber(el.dataset.number);
  });

  // show only if player has item
  document.querySelectorAll("[data-needs]").forEach(function (el) {
    el.style.display = hasItem(el.dataset.needs) ? "" : "none";
  });

  // show only if player does NOT have item
  document.querySelectorAll("[data-missing]").forEach(function (el) {
    el.style.display = hasItem(el.dataset.missing) ? "none" : "";
  });

  // show only if player has status
  document.querySelectorAll("[data-status]").forEach(function (el) {
    el.style.display = hasStatus(el.dataset.status) ? "" : "none";
  });

  // show only if a number is high enough: data-needs-min="hp" data-min="50"
  document.querySelectorAll("[data-needs-min]").forEach(function (el) {
    let n = getNumber(el.dataset.needsMin);
    el.style.display = n >= Number(el.dataset.min) ? "" : "none";
  });

  // show only if player has already been somewhere
  document.querySelectorAll("[data-visited]").forEach(function (el) {
    el.style.display = hasVisited(el.dataset.visited) ? "" : "none";
  });

  // swap an image based on an item: data-swap-img="key" data-swap-src="room-lit.jpg"
  document.querySelectorAll("[data-swap-img]").forEach(function (el) {
    if (hasItem(el.dataset.swapImg)) el.src = el.dataset.swapSrc;
  });
}

window.onload = function () {
  refresh();
  markVisited();
};


// Full list of what students can use:

// Items - pick up, drop, check for
// Numbers - HP, score, money, time, steps, anything that counts up or down
// Status - text states that stack, like “the power is off” and “your hands are shaking”
// Visited pages - content that only appears after they have been somewhere
// Image swaps - a room shows lit instead of dark once they have the flashlight
// Minimum thresholds - content that only shows if a number is high enough
// Back and reset - return to previous page, or wipe everything and restart
// Auto game over - optional, redirect when a number hits zero
// remember reference w3schools if you become stuck on trying to reference more than one thing at once, do not overcomplicate your work
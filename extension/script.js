const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_SHOWN = 3;
const SAVE_URL = "http://localhost:47811/goals";
const REPO_URL = "https://github.com/rsktaker/advertise-to-yourself";

// Served over http(s) means the hosted demo: edits stay in memory.
const DEMO = location.protocol === "http:" || location.protocol === "https:";

function daysUntil(isoDate) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((new Date(y, m - 1, d) - today) / DAY_MS);
}

function todayIso() {
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((n) => String(n).padStart(2, "0")).join("-");
}

function renderGoals() {
  const list = document.getElementById("goals");
  list.replaceChildren();
  GOALS
    .map((g) => ({ ...g, days: daysUntil(g.date) }))
    .filter((g) => g.days >= 0 && daysUntil(g.from) <= 0)
    .sort((a, b) => a.days - b.days)
    .slice(0, MAX_SHOWN)
    .forEach((g, i) => {
      const li = document.createElement("li");
      if (i === 0) li.className = "near";

      const days = document.createElement("span");
      days.className = "days";
      days.textContent = g.days === 0 ? "today" : g.days === 1 ? "1 day" : `${g.days} days`;

      li.append(days, g.title);
      list.append(li);
    });
}

function addRow(goal) {
  const row = document.createElement("div");
  row.className = "row";

  const title = Object.assign(document.createElement("input"), { type: "text", value: goal.title, className: "title" });
  const from = Object.assign(document.createElement("input"), { type: "date", value: goal.from, className: "from" });
  const date = Object.assign(document.createElement("input"), { type: "date", value: goal.date, className: "date" });
  const remove = Object.assign(document.createElement("button"), { textContent: "×", title: "Remove" });
  remove.addEventListener("click", () => row.remove());

  row.append(title, from, date, remove);
  document.getElementById("rows").append(row);
  return title;
}

function openEditor() {
  document.getElementById("rows").replaceChildren();
  GOALS.forEach(addRow);
  document.getElementById("status").textContent = "";
  document.getElementById("goals").hidden = true;
  document.getElementById("edit").hidden = true;
  document.getElementById("editor").hidden = false;
}

function closeEditor() {
  document.getElementById("editor").hidden = true;
  document.getElementById("goals").hidden = false;
  document.getElementById("edit").hidden = false;
}

async function save() {
  const status = document.getElementById("status");
  const goals = [...document.querySelectorAll("#rows .row")]
    .map((row) => ({
      title: row.querySelector(".title").value.trim(),
      from: row.querySelector(".from").value || todayIso(),
      date: row.querySelector(".date").value,
    }))
    .filter((g) => g.title);

  if (goals.some((g) => !g.date)) {
    status.textContent = "every goal needs a due date";
    return;
  }

  if (DEMO) {
    GOALS.splice(0, GOALS.length, ...goals);
    renderGoals();
    closeEditor();
    return;
  }

  try {
    const res = await fetch(SAVE_URL, { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(goals) });
    if (!res.ok) throw new Error(await res.text());
    location.reload();
  } catch (e) {
    status.textContent = "couldn't save (is Hammerspoon running?)";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  if (typeof chrome !== "undefined" && chrome.extension && chrome.extension.inIncognitoContext) {
    document.body.style.background = "#3c3c3c";
  }

  renderGoals();

  if (DEMO) {
    const about = Object.assign(document.createElement("a"), { id: "about", href: REPO_URL, textContent: "advertise to yourself · github" });
    document.body.append(about);
  }

  document.getElementById("edit").addEventListener("click", openEditor);
  document.getElementById("cancel").addEventListener("click", closeEditor);
  document.getElementById("save").addEventListener("click", save);
  document.getElementById("add").addEventListener("click", () => {
    addRow({ title: "", from: todayIso(), date: "" }).focus();
  });
});

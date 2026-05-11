const BALL_COUNT = 6;

let drills = [];
let editingId = null;

const dbKey = "spinshotDrills";

// Utility: create dropdown with markers + numeric range + optional R
function createDropdown(options) {
  const select = document.createElement("select");

  options.forEach(opt => {
    const o = document.createElement("option");
    o.textContent = opt.label;
    o.value = opt.value;
    if (opt.disabled) o.disabled = true;
    select.appendChild(o);
  });

  return select;
}

// Build the 6-ball grid
function buildShotGrid(existing = []) {
  const shotList = document.getElementById("shotList");
  shotList.innerHTML = "";

  for (let i = 0; i < BALL_COUNT; i++) {
    const s = existing[i] || {};

    const row = document.createElement("div");
    row.className = "shot-row";

    const label = document.createElement("div");
    label.className = "shot-ball-label";
    label.textContent = `Ball ${i + 1}`;
    row.appendChild(label);

    // HORZ (1–20)
    const horz = createDropdown(
      Array.from({ length: 20 }, (_, n) => ({
        label: `${n + 1}`,
        value: `${n + 1}`
      }))
    );
    horz.value = s.horz || "";
    horz.className = "shot-horz";
    row.appendChild(horz);

    // SPEED (Slow, 1–20, Fast)
    const speed = createDropdown([
      { label: "Slow", value: "", disabled: true },
      ...Array.from({ length: 20 }, (_, n) => ({
        label: `${n + 1}`,
        value: `${n + 1}`
      })),
      { label: "Fast", value: "", disabled: true }
    ]);
    speed.value = s.speed || "";
    speed.className = "shot-speed";
    row.appendChild(speed);

    // SPIN (Max Backspin, -9..9, Max Topspin)
    const spin = createDropdown([
      { label: "Max Backspin", value: "", disabled: true },
      ...Array.from({ length: 19 }, (_, n) => ({
        label: `${n - 9}`,
        value: `${n - 9}`
      })),
      { label: "Max Topspin", value: "", disabled: true }
    ]);
    spin.value = s.spin || "";
    spin.className = "shot-spin";
    row.appendChild(spin);

    // HEIGHT (Low, 1–50, High, R)
    const height = createDropdown([
      { label: "Low", value: "", disabled: true },
      ...Array.from({ length: 50 }, (_, n) => ({
        label: `${n + 1}`,
        value: `${n + 1}`
      })),
      { label: "High", value: "", disabled: true },
      { label: "R", value: "R" }
    ]);
    height.value = s.height || "";
    height.className = "shot-height";
    row.appendChild(height);

    // FEED (Slow, 1–10, Fast)
    const feed = createDropdown([
      { label: "Slow", value: "", disabled: true },
      ...Array.from({ length: 10 }, (_, n) => ({
        label: `${n + 1}`,
        value: `${n + 1}`
      })),
      { label: "Fast", value: "", disabled: true }
    ]);
    feed.value = s.feed || "";
    feed.className = "shot-feed";
    row.appendChild(feed);

    shotList.appendChild(row);
  }
}

// Load drills
function loadDrills() {
  const saved = localStorage.getItem(dbKey);
  drills = saved ? JSON.parse(saved) : [];
  renderDrills();
}

// Save drills
function saveDrills() {
  localStorage.setItem(dbKey, JSON.stringify(drills));
}

// Render drill cards
function renderDrills() {
  const list = document.getElementById("drillList");
  const search = document.getElementById("searchInput").value.toLowerCase();

  list.innerHTML = "";

  drills
    .filter(d => d.name.toLowerCase().includes(search))
    .forEach(d => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<strong>${d.name}</strong><br>6 balls`;
      card.onclick = () => openEditor(d.id);
      list.appendChild(card);
    });
}

// Open editor
function openEditor(id = null) {
  editingId = id;

  const modal = document.getElementById("editorModal");
  modal.classList.remove("hidden");

  if (id) {
    const drill = drills.find(d => d.id === id);
    document.getElementById("editorTitle").textContent = "Edit Drill";
    document.getElementById("drillName").value = drill.name;
    document.getElementById("drillNotes").value = drill.notes || "";
    buildShotGrid(drill.shots || []);
  } else {
    document.getElementById("editorTitle").textContent = "New Drill";
    document.getElementById("drillName").value = "";
    document.getElementById("drillNotes").value = "";
    buildShotGrid([]);
  }
}

// Save drill
function saveDrill() {
  const name = document.getElementById("drillName").value.trim();
  if (!name) return;

  const notes = document.getElementById("drillNotes").value;

  const rows = [...document.querySelectorAll(".shot-row")];
  const shots = rows.map(r => ({
    horz: r.querySelector(".shot-horz").value,
    speed: r.querySelector(".shot-speed").value,
    spin: r.querySelector(".shot-spin").value,
    height: r.querySelector(".shot-height").value,
    feed: r.querySelector(".shot-feed").value
  }));

  if (editingId) {
    const drill = drills.find(d => d.id === editingId);
    drill.name = name;
    drill.notes = notes;
    drill.shots = shots;
  } else {
    drills.push({
      id: Date.now(),
      name,
      notes,
      shots
    });
  }

  saveDrills();
  closeEditor();
  renderDrills();
}

// Close editor
function closeEditor() {
  document.getElementById("editorModal").classList.add("hidden");
}

// Event listeners
document.getElementById("addDrillBtn").onclick = () => openEditor();
document.getElementById("saveDrillBtn").onclick = () => saveDrill();
document.getElementById("cancelBtn").onclick = () => closeEditor();
document.getElementById("searchInput").oninput = () => renderDrills();

// Init
loadDrills();

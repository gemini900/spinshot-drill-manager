let drills = [];
let editingId = null;

const dbKey = "spinshotDrills";

// Load drills from localStorage
function loadDrills() {
  const saved = localStorage.getItem(dbKey);
  drills = saved ? JSON.parse(saved) : [];
  renderDrills();
}

// Save drills to localStorage
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
      card.innerHTML = `<strong>${d.name}</strong><br>${d.shots.length} shots`;
      card.onclick = () => openEditor(d.id);
      list.appendChild(card);
    });
}

// Open the editor modal
function openEditor(id = null) {
  editingId = id;

  const modal = document.getElementById("editorModal");
  modal.classList.remove("hidden");

  if (id) {
    const drill = drills.find(d => d.id === id);
    document.getElementById("editorTitle").textContent = "Edit Drill";
    document.getElementById("drillName").value = drill.name;
    document.getElementById("drillNotes").value = drill.notes || "";

    const shotList = document.getElementById("shotList");
    shotList.innerHTML = "";

    drill.shots.forEach(s => addShotRow(s));
  } else {
    document.getElementById("editorTitle").textContent = "New Drill";
    document.getElementById("drillName").value = "";
    document.getElementById("drillNotes").value = "";
    document.getElementById("shotList").innerHTML = "";
  }
}

// Add a shot row to the editor
function addShotRow(shot = null) {
  const shotList = document.getElementById("shotList");

  const row = document.createElement("div");
  row.className = "shot-row";

  row.innerHTML = `
    <input class="shot-label" placeholder="Label" value="${shot?.label || ""}">
    <input class="shot-ball" placeholder="Ball" value="${shot?.ball || ""}">
    <input class="shot-horz" placeholder="Horz" value="${shot?.horz || ""}">
    <input class="shot-speed" placeholder="Speed" value="${shot?.speed || ""}">
    <input class="shot-spin" placeholder="Spin" value="${shot?.spin || ""}">
    <input class="shot-height" placeholder="Height" value="${shot?.height || ""}">
    <input class="shot-feed" placeholder="Feed" value="${shot?.feed || ""}">
    <button class="danger remove-shot">X</button>
  `;

  row.querySelector(".remove-shot").onclick = () => row.remove();

  shotList.appendChild(row);
}

// Save drill
function saveDrill() {
  const name = document.getElementById("drillName").value.trim();
  if (!name) return;

  const notes = document.getElementById("drillNotes").value;

  const shotRows = [...document.querySelectorAll(".shot-row")];
  const shots = shotRows.map(r => ({
    label: r.querySelector(".shot-label").value,
    ball: r.querySelector(".shot-ball").value,
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

// Close editor modal
function closeEditor() {
  document.getElementById("editorModal").classList.add("hidden");
}

// Event listeners
document.getElementById("addDrillBtn").onclick = () => openEditor();
document.getElementById("addShotBtn").onclick = () => addShotRow();
document.getElementById("saveDrillBtn").onclick = () => saveDrill();
document.getElementById("cancelBtn").onclick = () => closeEditor();
document.getElementById("searchInput").oninput = () => renderDrills();

// Initialize
loadDrills();

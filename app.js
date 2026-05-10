let drills = [];
let editingId = null;

const dbKey = "spinshotDrills";

function loadDrills() {
  const saved = localStorage.getItem(dbKey);
  drills = saved ? JSON.parse(saved) : [];
  renderDrills();
}

function saveDrills() {
  localStorage.setItem(dbKey, JSON.stringify(drills));
}

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

function openEditor(id = null) {
  editingId = id;

  const modal = document.getElementById("editorModal");
  modal.classList.remove("hidden");

  if (id) {
    const drill = drills.find(d => d.id === id);
    document.getElementById("editorTitle").textContent = "Edit Drill";
    document.getElementById("drillName").value = drill.name;
    document.getElementById("drillNotes").value = drill.notes;
    renderShots(drill.shots);
  } else {
    document.getElementById("editorTitle").textContent = "New Drill";
    document.getElementById("drillName").value = "";
    document.getElementById("drillNotes").value = "";
    renderShots([]);
  }
}

function renderShots(shots) {
  const container = document.getElementById("shotList");
  container.innerHTML = "";

  shots.forEach((s, i) => {
    const div = document.createElement("div");
    div.className = "shot-card";
    div.innerHTML = `
      <strong>${s.label}</strong><br>
      Ball ${s.ball}, Horz ${s.horz}, Speed ${s.speed}
    `;
    container.appendChild(div);
  });
}

document.getElementById("addShotBtn").onclick = () => {
  const label = prompt("Shot label:");
  if (!label) return;

  const ball = Number(prompt("Ball #:"));
  const horz = Number(prompt("Horizontal:"));
  const speed = Number(prompt("Speed:"));
  const spin = Number(prompt("Spin:"));
  const height = Number(prompt("Height:"));
  const feed = Number(prompt("Feed:"));

  const drill = editingId
    ? drills.find(d => d.id === editingId)
    : { shots: [] };

  drill.shots.push({ label, ball, horz, speed, spin, height, feed });
  renderShots(drill.shots);
};

document.getElementById("saveDrillBtn").onclick = () => {
  const name = document.getElementById("drillName").value;
  const notes = document.getElementById("drillNotes").value;

  if (!name.trim()) return alert("Name required");

  if (editingId) {
    const drill = drills.find(d => d.id === editingId);
    drill.name = name;
    drill.notes = notes;
  } else {
    drills.push({
      id: crypto.randomUUID(),
      name,
      notes,
      shots: []
    });
  }

  saveDrills();
  closeEditor();
  renderDrills();
};

function closeEditor() {
  document.getElementById("editorModal").classList.add("hidden");
}

document.getElementById("cancelBtn").onclick = closeEditor;
document.getElementById("searchInput").oninput = renderDrills;

loadDrills();

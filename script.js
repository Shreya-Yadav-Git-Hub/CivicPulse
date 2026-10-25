const STORAGE_KEY = "civicpulse_complaints_v1";

const departmentMap = {
  pothole: "Road Department",
  road: "Road Department",
  water: "Water Department",
  leakage: "Water Department",
  garbage: "Waste Department",
  waste: "Waste Department",
  streetlight: "Electrical Department",
  drainage: "Drainage Department"
};

const issueInfo = {
  pothole: { label: "Pothole / damaged road", icon: "🛣️" },
  water: { label: "Water leakage", icon: "💧" },
  garbage: { label: "Garbage / waste", icon: "♻️" },
  streetlight: { label: "Streetlight issue", icon: "💡" },
  drainage: { label: "Drainage / flooding", icon: "🌧️" },
  other: { label: "Other civic issue", icon: "📍" }
};

const sampleComplaints = [
  { id: 1042, name: "Aarav Mehta", type: "pothole", location: "Link Road, Andheri", severity: 5, peopleAffected: 80, priority: 400, status: "In Progress", createdAt: Date.now() - 1000 * 60 * 45 },
  { id: 1041, name: "Sara Khan", type: "garbage", location: "Station Road, Bandra", severity: 3, peopleAffected: 35, priority: 105, status: "Acknowledged", createdAt: Date.now() - 1000 * 60 * 60 * 4 },
  { id: 1040, name: "Dev Patel", type: "streetlight", location: "Sector 4, Nerul", severity: 2, peopleAffected: 20, priority: 40, status: "Resolved", createdAt: Date.now() - 1000 * 60 * 60 * 20 }
];

let complaints = loadComplaints();

function loadComplaints() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : sampleComplaints;
  } catch (error) {
    return sampleComplaints;
  }
}

function saveComplaints() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

function departmentFor(type) {
  return departmentMap[type] || "Manual Assignment";
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-IN", {
    day: "numeric", month: "short"
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function renderDashboard() {
  document.getElementById("totalCount").textContent = complaints.length;
  document.getElementById("progressCount").textContent =
    complaints.filter(c => c.status === "In Progress").length;
  document.getElementById("resolvedCount").textContent =
    complaints.filter(c => c.status === "Resolved" || c.status === "Verified by Citizen").length;
  document.getElementById("highCount").textContent =
    complaints.filter(c => c.priority >= 100).length;
}

function renderComplaints() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const sortMode = document.getElementById("sortSelect").value;

  let visible = complaints.filter(c => {
    const text = `${c.id} ${c.name} ${c.type} ${c.location} ${departmentFor(c.type)}`.toLowerCase();
    return text.includes(query);
  });

  // Sort the copied array so the saved complaint order is not accidentally changed.
  visible = [...visible];
  if (sortMode === "priority") {
    visible.sort((a, b) => b.priority - a.priority);
  } else {
    visible.sort((a, b) => b.createdAt - a.createdAt);
  }

  const list = document.getElementById("complaintList");
  const empty = document.getElementById("emptyState");

  if (visible.length === 0) {
    list.innerHTML = "";
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  list.innerHTML = visible.map(c => {
    const info = issueInfo[c.type] || issueInfo.other;
    const statusClass = c.status.replaceAll(" ", "-");
    return `
      <article class="complaint-card">
        <div class="complaint-main">
          <div class="issue-icon">${info.icon}</div>
          <div>
            <div class="complaint-title-row">
              <h3>${escapeHtml(info.label)}</h3>
              <span class="complaint-id">#CP-${c.id}</span>
              <span class="pill status-${statusClass}">${escapeHtml(c.status)}</span>
            </div>
            <div class="complaint-meta">
              <span>⌖ ${escapeHtml(c.location)}</span>
              <span>By ${escapeHtml(c.name)}</span><br>
              <span>${escapeHtml(departmentFor(c.type))}</span>
              <span>Severity ${c.severity}/5</span>
              <span>${c.peopleAffected} people affected</span>
              <span>${formatDate(c.createdAt)}</span>
            </div>
          </div>
        </div>
        <div class="priority-score">
          <strong>${c.priority}</strong>
          <small>Priority score</small>
          <select data-status-id="${c.id}" aria-label="Update status for complaint ${c.id}">
            ${["Registered", "Acknowledged", "In Progress", "Resolved", "Verified by Citizen"].map(s =>
              `<option ${c.status === s ? "selected" : ""}>${s}</option>`
            ).join("")}
          </select>
        </div>
      </article>`;
  }).join("");
}

function refresh() {
  renderDashboard();
  renderComplaints();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function updatePriorityPreview() {
  const severity = Number(document.getElementById("severity").value);
  const people = Number(document.getElementById("peopleAffected").value);
  document.getElementById("priorityPreview").textContent =
    severity * Math.max(0, people || 0);
}

document.getElementById("severity").addEventListener("change", updatePriorityPreview);
document.getElementById("peopleAffected").addEventListener("input", updatePriorityPreview);

document.getElementById("complaintForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("citizenName").value.trim();
  const type = document.getElementById("issueType").value;
  const location = document.getElementById("location").value.trim();
  const severity = Number(document.getElementById("severity").value);
  const peopleAffected = Number(document.getElementById("peopleAffected").value);

  if (!name || !type || !location || severity < 1 || severity > 5 || peopleAffected < 1) {
    showToast("Please complete the form with valid details.");
    return;
  }

  const nextId = complaints.reduce((highest, c) => Math.max(highest, Number(c.id)), 1042) + 1;
  const complaint = {
    id: nextId, name, type, location, severity, peopleAffected,
    priority: severity * peopleAffected,
    status: "Registered",
    createdAt: Date.now()
  };

  complaints.push(complaint);
  saveComplaints();
  refresh();
  event.target.reset();
  document.getElementById("severity").value = "3";
  document.getElementById("peopleAffected").value = "10";
  updatePriorityPreview();
  showToast(`Complaint #CP-${nextId} registered successfully.`);
  document.getElementById("complaints").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("searchInput").addEventListener("input", renderComplaints);
document.getElementById("sortSelect").addEventListener("change", renderComplaints);

document.getElementById("complaintList").addEventListener("change", event => {
  const id = Number(event.target.dataset.statusId);
  if (!id) return;

  const complaint = complaints.find(c => Number(c.id) === id);
  if (!complaint) return;

  complaint.status = event.target.value;
  saveComplaints();
  refresh();
  showToast(`Complaint #CP-${id} status updated.`);
});

refresh();

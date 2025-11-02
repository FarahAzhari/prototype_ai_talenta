// --- JAVASCRIPT LOGIC ---

// --- PERUBAHAN 1: Variabel Global untuk menyimpan Role ---
let currentUserRole = "admin"; // Default role saat load

// --- DOM Elements (dengan null checks) ---
const loginPage = document.getElementById("login-page");
const appContainer = document.getElementById("app-container");
const sideMenu = document.getElementById("sideMenu");
const backdrop = document.getElementById("mobileBackdrop");
const hamburgerBtn = document.getElementById("hamburgerBtn");
const sections = document.querySelectorAll(".tab-content");
const menuButtons = document.querySelectorAll(".menu button");
const svgNS = "http://www.w3.org/2000/svg";

// --- Data Chart ---
const ADMIN_CHART_DATA = {
  labels: ["Tech", "Policy", "Mgmt", "Comm", "Leadership"],
  values: [88, 72, 80, 59, 82],
};
const USER_CHART_DATA = {
  labels: ["Tech", "Policy", "Mgmt", "Comm", "Leadership"],
  values: [88, 72, 80, 66, 82],
};

// Dropdown
const userDropdown = document.getElementById("userDropdown");
const avatarBtn = document.getElementById("avatarBtn");
const dropdownRoleDisplay = document.getElementById("dropdown-role-display");

// Message Box
const messageBox = document.getElementById("messageBox");
const messageBoxTitle = document.getElementById("messageBoxTitle");
const messageBoxContent = document.getElementById("messageBoxContent");

// Chatbot
const chatbotWindow = document.getElementById("chatbotWindow");
const chatbotBody = document.getElementById("chatbotBody");
const chatInput = document.getElementById("chatInput");
const sendButton = document.getElementById("sendButton");

/**
 * Menentukan warna batang berdasarkan skor kompetensi (0-100).
 */
function getColor(value) {
  if (value >= 80) return "#10b981"; // Hijau: Sangat Baik
  if (value >= 70) return "#3b82f6"; // Biru: Baik
  if (value >= 60) return "#f59e0b"; // Kuning: Cukup
  return "#ef4444"; // Merah: Perlu Peningkatan
}

/**
 * Menggambar grafik batang (Bar Chart) responsif untuk Rata-rata Skor Kompetensi.
 * @param {string} _svgId - ID dari elemen <svg>
 * @param {object} data - Objek berisi { labels: [], values: [] }
 */
function drawCompetencyChart(svgId, data) {
  const chartSvg = document.getElementById(svgId);
  if (!chartSvg) return;

  chartSvg.innerHTML = "";
  const desktopHeight = 200;
  const mobileMinHeight = 150;
  let svgHeight;

  if (window.innerWidth >= 1024) {
    chartSvg.style.height = `${desktopHeight}px`;
    chartSvg.style.minHeight = "";
    svgHeight = desktopHeight;
  } else {
    chartSvg.style.height = "";
    let currentHeight = chartSvg.clientHeight || mobileMinHeight;

    if (currentHeight < mobileMinHeight) {
      svgHeight = mobileMinHeight;
      chartSvg.style.minHeight = `${mobileMinHeight}px`;
    } else {
      svgHeight = currentHeight;
      chartSvg.style.minHeight = "";
    }
  }
  let svgWidth = chartSvg.clientWidth || 400;

  chartSvg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
  chartSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  if (svgWidth === 0 || svgHeight === 0) return;

  const labels = data.labels;
  const values = data.values;
  const maxScore = 100;
  const padding = 20;
  const marginBottom = 30;
  const marginTop = 20;
  const chartAreaHeight = svgHeight - marginBottom - marginTop;
  const chartAreaWidth = svgWidth - 2 * padding;
  const numBars = labels.length;
  const totalBarWidth = chartAreaWidth * 0.7;
  const gapWidth = chartAreaWidth * 0.3;
  const barWidth = totalBarWidth / numBars;
  const barGap = gapWidth / (numBars - 1);
  const actualBarGap = numBars > 1 ? barGap : 0;
  const effectiveBarWidth = Math.max(20, Math.min(barWidth, 50));
  const totalContentWidth =
    effectiveBarWidth * numBars + actualBarGap * (numBars - 1);
  const dynamicPadding = (svgWidth - totalContentWidth) / 2;

  const xAxisLine = document.createElementNS(svgNS, "line");
  xAxisLine.setAttribute("x1", dynamicPadding);
  xAxisLine.setAttribute("y1", svgHeight - marginBottom);
  xAxisLine.setAttribute("x2", svgWidth - dynamicPadding);
  xAxisLine.setAttribute("y2", svgHeight - marginBottom);
  xAxisLine.setAttribute("stroke", "#ccc");
  chartSvg.appendChild(xAxisLine);

  for (let i = 0; i < numBars; i++) {
    const value = values[i];
    const color = getColor(value);
    const barX = dynamicPadding + i * (effectiveBarWidth + actualBarGap);
    const barCenter = barX + effectiveBarWidth / 2;
    const barHeight = (value / maxScore) * chartAreaHeight;
    const barY = svgHeight - marginBottom - barHeight;

    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", barX);
    rect.setAttribute("y", svgHeight - marginBottom);
    rect.setAttribute("width", effectiveBarWidth);
    rect.setAttribute("height", 0);
    rect.setAttribute("rx", 6);
    rect.setAttribute("ry", 6);
    rect.setAttribute("fill", color);
    rect.style.transition = "height 1s ease-out, y 1s ease-out";
    chartSvg.appendChild(rect);

    setTimeout(() => {
      rect.setAttribute("height", barHeight);
      rect.setAttribute("y", barY);
    }, 50);

    const textLabel = document.createElementNS(svgNS, "text");
    textLabel.setAttribute("x", barCenter);
    textLabel.setAttribute("y", svgHeight - marginBottom + 18);
    textLabel.setAttribute("text-anchor", "middle");
    textLabel.setAttribute("font-size", "12");
    textLabel.setAttribute("fill", "#4b5563");
    textLabel.textContent = labels[i];
    chartSvg.appendChild(textLabel);

    const textValue = document.createElementNS(svgNS, "text");
    textValue.setAttribute("x", barCenter);
    textValue.setAttribute("y", barY - 5);
    textValue.setAttribute("text-anchor", "middle");
    textValue.setAttribute("font-size", "14");
    textValue.setAttribute("font-weight", "bold");
    textValue.setAttribute("fill", color);
    textValue.textContent = value;
    textValue.style.opacity = 0;
    textValue.style.transition = "opacity 0.5s ease-in 0.8s";
    chartSvg.appendChild(textValue);

    setTimeout(() => {
      textValue.style.opacity = 1;
    }, 850);
  }
}

// 1. Sidebar Toggle Logic
function toggleSidebar() {
  if (!sideMenu || !backdrop || !hamburgerBtn) return;
  const isOpen = sideMenu.classList.toggle("open");
  backdrop.classList.toggle("visible", isOpen);
  if (isOpen) {
    hamburgerBtn.setAttribute("aria-expanded", "true");
  } else {
    hamburgerBtn.setAttribute("aria-expanded", "false");
  }
}

if (hamburgerBtn) {
  hamburgerBtn.addEventListener("click", toggleSidebar);
}
if (backdrop) {
  backdrop.addEventListener("click", toggleSidebar);
}

// --- PERUBAHAN 2: Fungsi show() "pintar" (Role + Perbaikan Bug Awal) ---
function show(id, button, closeMenu = true) {
  // Logika untuk Role:
  let targetId = id;
  if (id === "dashboard") {
    targetId =
      currentUserRole === "admin" ? "dashboard-admin" : "dashboard-user";
  }

  // Hide all sections
  sections.forEach((section) => {
    section.classList.add("hidden");
  });

  // Show the target section berdasarkan targetId
  const targetSection = document.getElementById(targetId);
  if (targetSection) {
    targetSection.classList.remove("hidden");
    // Panggil fungsi chart yang sama dengan data & ID yang berbeda
    if (targetId === "dashboard-admin") {
      setTimeout(() => {
        drawCompetencyChart("competencyChart", ADMIN_CHART_DATA);
      }, 50);
    }
    if (targetId === "dashboard-user") {
      setTimeout(() => {
        drawCompetencyChart("userCompetencyChart", USER_CHART_DATA);
      }, 50);
    }
  }

  // Update active menu button state
  menuButtons.forEach((btn) => btn.classList.remove("active"));
  if (button) {
    button.classList.add("active");
  }

  // Perbaikan bug awal: only toggle jika closeMenu = true
  if (window.innerWidth < 1024 && closeMenu) {
    toggleSidebar();
  }
}

// --- Fungsi Logout Baru ---
function logout() {
  if (!loginPage || !appContainer) return;

  // 1. Sembunyikan aplikasi
  appContainer.classList.add("hidden");

  // 2. Tampilkan halaman login
  loginPage.classList.remove("hidden");
  loginPage.style.opacity = 1; // Pastikan terlihat

  // 3. Reset state
  currentUserRole = "admin"; // Reset role ke default
  if (dropdownRoleDisplay)
    dropdownRoleDisplay.textContent = "Admin • Kementerian"; // Reset teks dropdown

  // 4. Kosongkan field NIP dan fokus
  const nipInput = document.getElementById("nip");
  if (nipInput) {
    nipInput.value = "";
    nipInput.focus();
  }

  // 5. Tutup dropdown user
  hideDropdown();
}

// Initialize:
let resizeTimer;
window.onload = function () {
  // Jangan tampilkan dashboard saat load
  // CUKUP FOKUS PADA INPUT NIP
  const nipInput = document.getElementById("nip");
  if (nipInput) {
    nipInput.focus();
  }
};

// 7. Responsiveness Logic
window.onresize = () => {
  clearTimeout(resizeTimer);
  // Tambahkan pengecekan apakah appContainer sudah terlihat
  if (appContainer && !appContainer.classList.contains("hidden")) {
    if (currentUserRole === "admin") {
      resizeTimer = setTimeout(() => {
        drawCompetencyChart("competencyChart", ADMIN_CHART_DATA);
      }, 100);
    } else {
      resizeTimer = setTimeout(() => {
        drawCompetencyChart("userCompetencyChart", USER_CHART_DATA);
      }, 100);
    }
  }
};

// 3. User Dropdown Logic
function toggleDropdown() {
  if (!userDropdown || !avatarBtn) return;
  const isHidden = userDropdown.classList.toggle("hidden");
  avatarBtn.setAttribute("aria-expanded", isHidden ? "false" : "true");
}

function hideDropdown() {
  if (!userDropdown || !avatarBtn) return;
  userDropdown.classList.add("hidden");
  avatarBtn.setAttribute("aria-expanded", "false");
}

document.addEventListener("click", function (event) {
  if (!avatarBtn || !userDropdown) return;
  if (
    !avatarBtn.contains(event.target) &&
    !userDropdown.contains(event.target)
  ) {
    hideDropdown();
  }
});

// 4. Message Box/Modal Logic
function showMessage(title, content) {
  if (!messageBox || !messageBoxTitle || !messageBoxContent) return;
  messageBoxTitle.textContent = title;
  messageBoxContent.innerHTML = content;
  messageBox.classList.remove("hidden");
  document.addEventListener("keydown", closeOnEscape);
}

function closeMessageBox() {
  if (!messageBox) return;
  messageBox.classList.add("hidden");
  document.removeEventListener("keydown", closeOnEscape);
}

function closeOnEscape(e) {
  if (
    e.key === "Escape" &&
    messageBox &&
    !messageBox.classList.contains("hidden")
  ) {
    closeMessageBox();
  }
}

// --- Logika Login diperbarui untuk Role dan Halaman Login ---
function simulateLogin() {
  const nipInput = document.getElementById("nip");
  const loginMsg = document.getElementById("loginMsg");

  // Tambahkan pengecekan untuk elemen baru
  if (!nipInput || !loginMsg || !loginPage || !appContainer) return;

  const nip = nipInput.value.trim();
  let loginSuccess = false;
  let message = "";
  let roleName = "";

  if (nip === "198805012020012001") {
    // --- Role User ---
    currentUserRole = "user";
    loginSuccess = true;
    roleName = "User ASN";
    if (dropdownRoleDisplay)
      dropdownRoleDisplay.textContent = "User • Staf Ahli";
  } else if (nip === "0000000000000001") {
    // NIP Admin Fiktif
    // --- Role Admin ---
    currentUserRole = "admin";
    loginSuccess = true;
    roleName = "Admin ASN";
    if (dropdownRoleDisplay)
      dropdownRoleDisplay.textContent = "Admin • Kementerian";
  } else if (nip === "") {
    loginMsg.textContent = "NIP tidak boleh kosong.";
    loginMsg.classList.remove("text-green-600");
    loginMsg.classList.add("text-red-600");
  } else {
    loginMsg.textContent =
      "NIP tidak dikenal. Coba '0000000000000001' atau '198805012020012001'.";
    loginMsg.classList.remove("text-green-600");
    loginMsg.classList.add("text-red-600");
  }

  if (loginSuccess) {
    // --- INI LOGIKA BARU SAAT SUKSES ---
    loginMsg.textContent = ""; // Kosongkan pesan error

    // 1. Sembunyikan Halaman Login
    loginPage.classList.add("hidden");

    // 2. Tampilkan Wadah Aplikasi
    appContainer.classList.remove("hidden");

    // 3. Panggil 'show' untuk menampilkan dashboard yang benar
    // 'false' agar sidebar tidak toggle aneh saat login di mobile
    show(
      "dashboard",
      document.querySelector(".menu button:nth-child(1)"),
      false
    );
  }
}

// --- Fungsi untuk Explainable AI (XAI) ---
function showXAI(person) {
  let title = "Penjelasan AI";
  let content = "Data tidak ditemukan.";

  const greenCheck =
    "<span style='color: #10b981; margin-right: 4px;'>✔</span>";
  const redX = "<span style='color: #ef4444; margin-right: 4px;'>✖</span>";
  const warn = "<span style='color: #f59e0b; margin-right: 4px;'>!</span>";

  switch (person) {
    case "putri":
      title = "Penjelasan AI: Putri A (Skor 92)";
      content = `
        Skor <strong>Sangat Cocok (92)</strong> dibentuk dari:<br><br>
        <strong>1. KECOCOKAN SKILL (Bobot: 70%)</strong><br>
        ${greenCheck} <strong>Kecocokan Jabatan:</strong> 95% (Sangat Tinggi)<br>
        ${greenCheck} <strong>Kompetensi Kunci:</strong> Memenuhi (Data Science, Mgmt Proyek, Leadership)<br><br>
        <strong>2. PREDIKSI KINERJA (Bobot: 30%)</strong><br>
        ${greenCheck} <strong>Prediksi Kinerja 1 Thn:</strong> Sangat Baik<br>
        ${greenCheck} <strong>Risiko Stagnasi:</strong> Rendah<br>
      `;
      break;

    case "agus":
      title = "Penjelasan AI: Agus S (Skor 90)";
      content = `
        Skor <strong>Cocok (90)</strong> dibentuk dari:<br><br>
        <strong>1. KECOCOKAN SKILL (Bobot: 70%)</strong><br>
        ${greenCheck} <strong>Kecocokan Jabatan:</strong> 90% (Sangat Tinggi)<br>
        ${redX} <strong>Kompetensi Kunci:</strong> Kurang (Leadership: 75)<br><br>
        <strong>2. PREDIKSI KINERJA (Bobot: 30%)</strong><br>
        ${greenCheck} <strong>Prediksi Kinerja 1 Thn:</strong> Sangat Baik<br>
        ${warn} <strong>Catatan Fairness:</strong> Perlu dicek (kategori 'Check').
      `;
      break;

    case "rina":
      title = "Penjelasan AI: Rina T (Skor 89)";
      content = `
        Skor <strong>Cocok (89)</strong> dibentuk dari:<br><br>
        <strong>1. KECOCOKAN SKILL (Bobot: 70%)</strong><br>
        ${greenCheck} <strong>Kecocokan Jabatan:</strong> 88% (Tinggi)<br>
        ${greenCheck} <strong>Kompetensi Kunci:</strong> Memenuhi<br><br>
        <strong>2. PREDIKSI KINERJA (Bobot: 30%)</strong><br>
        ${greenCheck} <strong>Prediksi Kinerja 1 Thn:</strong> Baik<br>
        ${greenCheck} <strong>Risiko Stagnasi:</strong> Rendah<br>
      `;
      break;

    case "dedi":
      title = "Penjelasan AI: Dedi R (Skor 88)";
      content = `
        Skor <strong>Cocok (88)</strong> dibentuk dari:<br><br>
        <strong style='color: #ef4444;'>PERINGATAN FAIRNESS (BIAS DETECTED)</strong><br>
        ${warn} Model AI mendeteksi potensi bias berdasarkan data historis untuk profil serupa (usia/gender) pada jabatan ini. Skor mungkin tidak akurat.<br><br>
        <strong>Rekomendasi:</strong> Lakukan review manual oleh panel HR.
      `;
      break;

    case "sari":
      title = "Penjelasan AI: Sari L (Skor 86)";
      content = `
        Skor <strong>Cukup Cocok (86)</strong> dibentuk dari:<br><br>
        <strong>1. KECOCOKAN SKILL (Bobot: 70%)</strong><br>
        ${greenCheck} <strong>Kecocokan Jabatan:</strong> 85% (Tinggi)<br>
        ${warn} <strong>Kompetensi Kunci:</strong> Perlu Peningkatan (Mgmt Proyek: 72)<br><br>
        <strong>2. PREDIKSI KINERJA (Bobot: 30%)</strong><br>
        ${greenCheck} <strong>Prediksi Kinerja 1 Thn:</strong> Baik<br>
        ${greenCheck} <strong>Risiko Stagnasi:</strong> Rendah<br>
      `;
      break;
  }

  showMessage(title, content);
}

// --- CHATBOT LOGIC ---
const initialConversation = [
  {
    text: "AI-Talenta: Halo, saya TalentaBot. Ada yang bisa saya bantu?",
    type: "ai",
    delay: 500,
  },
  {
    text: "ASN: Saya ingin tahu diklat apa yang cocok untuk jabatan saya.",
    type: "user",
    delay: 2000,
  },
  {
    text: "AI-Talenta: Berdasarkan data kompetensi Anda (Putri A), pelatihan Manajemen Data Publik direkomendasikan karena Anda memiliki gap di Data Engineering.",
    type: "ai",
    delay: 4000,
  },
];

function addMessage(text, type) {
  if (!chatbotBody) return;
  const msgDiv = document.createElement("div");
  msgDiv.classList.add(
    "chat-message",
    type === "ai" ? "message-ai" : "message-user"
  );
  msgDiv.textContent = text;
  chatbotBody.appendChild(msgDiv);
  requestAnimationFrame(() => msgDiv.classList.add("visible"));
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

function loadInitialConversation() {
  if (!chatbotBody || !chatInput || !sendButton) return;
  chatbotBody.innerHTML = "";

  initialConversation.forEach((msg) => {
    setTimeout(() => addMessage(msg.text, msg.type), msg.delay);
  });

  const maxDelay = initialConversation.reduce(
    (max, msg) => Math.max(max, msg.delay),
    0
  );
  setTimeout(() => {
    chatInput.disabled = false;
    sendButton.disabled = false;
    chatInput.focus();
  }, maxDelay + 500);
}

function toggleChatbot() {
  if (!chatbotWindow || !chatInput || !sendButton) return;
  const isOpen = chatbotWindow.classList.toggle("open");

  if (isOpen) {
    chatbotWindow.setAttribute("aria-hidden", "false");
    chatInput.disabled = true;
    sendButton.disabled = true;
    loadInitialConversation();
  } else {
    chatbotWindow.setAttribute("aria-hidden", "true");
    chatInput.disabled = true;
    sendButton.disabled = true;
  }
}

if (sendButton && chatInput) {
  sendButton.addEventListener("click", function () {
    const message = chatInput.value.trim();
    if (message) {
      addMessage(message, "user");
      chatInput.value = "";

      chatInput.disabled = true;
      sendButton.disabled = true;
      setTimeout(() => {
        addMessage(
          "TalentaBot: Mohon maaf, fitur pemrosesan pesan real-time sedang dalam tahap pengembangan.",
          "ai"
        );
        chatInput.disabled = false;
        sendButton.disabled = false;
        chatInput.focus();
      }, 1000);
    }
  });

  chatInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendButton.click();
    }
  });
}

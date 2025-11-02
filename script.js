// --- JAVASCRIPT LOGIC ---

const sideMenu = document.getElementById("sideMenu");
const backdrop = document.getElementById("mobileBackdrop");
const hamburgerBtn = document.getElementById("hamburgerBtn");
const sections = document.querySelectorAll(".tab-content");
const menuButtons = document.querySelectorAll(".menu button");
const svgNS = "http://www.w3.org/2000/svg";

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
 */
function drawCompetencyChart() {
  const chartSvg = document.getElementById("competencyChart");
  if (!chartSvg) return;

  // Hapus konten SVG sebelumnya
  chartSvg.innerHTML = "";

  // Dapatkan dimensi aktual dari SVG (untuk responsif)
  let svgWidth = chartSvg.clientWidth || 400; // Fallback
  let svgHeight = chartSvg.clientHeight || 200; // Fallback. Tinggi dikurangi karena ada legend

  // Pastikan tinggi minimum untuk mencegah bar terlalu pendek
  const minChartHeight = 150;
  if (svgHeight < minChartHeight) {
    svgHeight = minChartHeight;
    chartSvg.style.minHeight = `${minChartHeight}px`; // Adjust container min-height
  } else {
    chartSvg.style.minHeight = ""; // Remove if not needed
  }

  // Atur viewbox untuk responsivitas yang lebih baik
  chartSvg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
  chartSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  if (svgWidth === 0 || svgHeight === 0) return;

  // Data kompetensi yang Anda berikan
  const labels = ["Data", "Policy", "Mgmt", "Comm", "Leadership"];
  const values = [88, 72, 80, 66, 82]; // Skor simulasi (0-100)

  const maxScore = 100;
  const padding = 20; // Padding horizontal
  const marginBottom = 30; // Ruang untuk label X
  const marginTop = 20; // Ruang untuk label nilai

  const chartAreaHeight = svgHeight - marginBottom - marginTop;
  const chartAreaWidth = svgWidth - 2 * padding;

  const numBars = labels.length;
  // Kalkulasi barSpacing yang lebih dinamis
  const totalBarWidth = chartAreaWidth * 0.7; // Total lebar untuk semua bar, 70% dari area
  const gapWidth = chartAreaWidth * 0.3; // Total lebar untuk semua gap, 30% dari area
  const barWidth = totalBarWidth / numBars;
  const barGap = gapWidth / (numBars - 1); // Gap antara bar

  // Jika hanya ada 1 bar, maka barGap tidak relevan
  const actualBarGap = numBars > 1 ? barGap : 0;

  // Sesuaikan barWidth agar minimal 20px atau maksimal 50px
  const effectiveBarWidth = Math.max(20, Math.min(barWidth, 50));

  // Hitung ulang total lebar yang dibutuhkan dan sesuaikan padding agar center
  const totalContentWidth =
    effectiveBarWidth * numBars + actualBarGap * (numBars - 1);
  const dynamicPadding = (svgWidth - totalContentWidth) / 2;

  // 1. Gambar Garis Sumbu X (Garis dasar)
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
    // Posisi X dihitung berdasarkan dynamicPadding dan effectiveBarWidth/actualBarGap
    const barX = dynamicPadding + i * (effectiveBarWidth + actualBarGap);
    const barCenter = barX + effectiveBarWidth / 2;

    // Hitung tinggi batang relatif terhadap area chart
    const barHeight = (value / maxScore) * chartAreaHeight;
    const barY = svgHeight - marginBottom - barHeight;

    // 2. Gambar Batang (Bar)
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", barX);
    // Mulai y dari bawah untuk animasi
    rect.setAttribute("y", svgHeight - marginBottom);
    rect.setAttribute("width", effectiveBarWidth);
    rect.setAttribute("height", 0); // Tinggi awal 0
    rect.setAttribute("rx", 6);
    rect.setAttribute("ry", 6);
    rect.setAttribute("fill", color);
    rect.style.transition = "height 1s ease-out, y 1s ease-out"; // Tambahkan animasi CSS
    chartSvg.appendChild(rect);

    // Terapkan tinggi dan posisi Y setelah elemen ditambahkan untuk memicu transisi
    setTimeout(() => {
      rect.setAttribute("height", barHeight);
      rect.setAttribute("y", barY);
    }, 50);

    // 3. Gambar Label Sumbu X (Nama Kompetensi)
    const textLabel = document.createElementNS(svgNS, "text");
    textLabel.setAttribute("x", barCenter);
    textLabel.setAttribute("y", svgHeight - marginBottom + 18);
    textLabel.setAttribute("text-anchor", "middle");
    textLabel.setAttribute("font-size", "12");
    textLabel.setAttribute("fill", "#4b5563");
    textLabel.textContent = labels[i];
    chartSvg.appendChild(textLabel);

    // 4. Gambar Label Nilai (Skor di atas bar)
    const textValue = document.createElementNS(svgNS, "text");
    textValue.setAttribute("x", barCenter);
    textValue.setAttribute("y", barY - 5);
    textValue.setAttribute("text-anchor", "middle");
    textValue.setAttribute("font-size", "14");
    textValue.setAttribute("font-weight", "bold");
    textValue.setAttribute("fill", color);
    textValue.textContent = value;
    textValue.style.opacity = 0; // Mulai tidak terlihat
    // Fade in setelah animasi bar selesai
    textValue.style.transition = "opacity 0.5s ease-in 0.8s";
    chartSvg.appendChild(textValue);

    setTimeout(() => {
      textValue.style.opacity = 1;
    }, 850);
  }
}

// 1. Sidebar Toggle Logic
function toggleSidebar() {
  const isOpen = sideMenu.classList.toggle("open");
  backdrop.classList.toggle("visible", isOpen);
  if (isOpen) {
    hamburgerBtn.setAttribute("aria-expanded", "true");
  } else {
    hamburgerBtn.setAttribute("aria-expanded", "false");
  }
}

hamburgerBtn.addEventListener("click", toggleSidebar);

// 2. Tab/Section Switching Logic
function show(id, button, closeMenu = true) {
  // Hide all sections
  sections.forEach((section) => {
    section.classList.add("hidden");
  });

  // Show the target section
  const targetSection = document.getElementById(id);
  if (targetSection) {
    targetSection.classList.remove("hidden");
  }

  // Update active menu button state
  menuButtons.forEach((btn) => btn.classList.remove("active"));
  if (button) {
    button.classList.add("active");
  }

  // Close sidebar on mobile after selection
  if (window.innerWidth < 1024 && closeMenu) {
    toggleSidebar();
  }
}

// Initialize: show dashboard on load and draw chart
let resizeTimer;
window.onload = function () {
  show("dashboard", document.querySelector(".menu button.active"), false);
  // Gambar Chart saat halaman dimuat
  drawCompetencyChart();
};

// 7. Responsiveness Logic: Gambar ulang Chart saat jendela diubah ukurannya
window.onresize = () => {
  clearTimeout(resizeTimer);
  // Debounce untuk menghindari redraw yang terlalu sering
  resizeTimer = setTimeout(drawCompetencyChart, 100);
};

// 3. User Dropdown Logic (NEW)
const userDropdown = document.getElementById("userDropdown");
const avatarBtn = document.getElementById("avatarBtn");

function toggleDropdown() {
  const isHidden = userDropdown.classList.toggle("hidden");
  avatarBtn.setAttribute("aria-expanded", isHidden ? "false" : "true");
}

function hideDropdown() {
  userDropdown.classList.add("hidden");
  avatarBtn.setAttribute("aria-expanded", "false");
}

// Close dropdown if user clicks outside
document.addEventListener("click", function (event) {
  if (
    !avatarBtn.contains(event.target) &&
    !userDropdown.contains(event.target)
  ) {
    hideDropdown();
  }
});

// 4. Message Box/Modal Logic (Replacement for alert())
const messageBox = document.getElementById("messageBox");
const messageBoxTitle = document.getElementById("messageBoxTitle");
const messageBoxContent = document.getElementById("messageBoxContent");

function showMessage(title, content) {
  messageBoxTitle.textContent = title;
  messageBoxContent.textContent = content;
  messageBox.classList.remove("hidden");
  // Ensure the message box can be closed by pressing ESC
  document.addEventListener("keydown", closeOnEscape);
}

function closeMessageBox() {
  messageBox.classList.add("hidden");
  document.removeEventListener("keydown", closeOnEscape);
}

function closeOnEscape(e) {
  if (e.key === "Escape" && !messageBox.classList.contains("hidden")) {
    closeMessageBox();
  }
}

// 5. Simulate Login Logic
function simulateLogin() {
  const nipInput = document.getElementById("nip");
  const loginMsg = document.getElementById("loginMsg");
  const nip = nipInput.value.trim();

  if (nip === "198805012020012001") {
    loginMsg.textContent =
      "Login Berhasil! Mengarahkan ke Dashboard (simulasi).";
    loginMsg.classList.remove("text-red-600");
    loginMsg.classList.add("text-green-600");
    // Simulate redirection to a new view/role change
    showMessage(
      "Login Berhasil",
      `Berhasil masuk sebagai pengguna NIP: ${nip}. Role simulasi: Staf Ahli.`
    );
    // Automatically switch to the dashboard view
    show("dashboard", document.querySelector(".menu button:nth-child(1)"));
  } else if (nip === "") {
    loginMsg.textContent = "NIP tidak boleh kosong.";
    loginMsg.classList.remove("text-green-600");
    loginMsg.classList.add("text-red-600");
  } else {
    loginMsg.textContent =
      "NIP tidak dikenal. Coba NIP contoh: 198805012020012001";
    loginMsg.classList.remove("text-green-600");
    loginMsg.classList.add("text-red-600");
  }
}

// --- CHATBOT LOGIC (Updated with Initial Conversation) ---
const chatbotWindow = document.getElementById("chatbotWindow");
const chatbotBody = document.getElementById("chatbotBody");
const chatInput = document.getElementById("chatInput");
const sendButton = document.getElementById("sendButton");

const initialConversation = [
  {
    text: "AI-Talenta: Halo, saya TalentaBot. Ada yang bisa saya bantu?",
    type: "ai",
    delay: 500,
  },
  {
    text: "ASN: Saya ingin tahu diklat apa yang cocok untuk jabatan saya.",
    type: "user",
    delay: 2000, // Increased delay for better pacing
  },
  {
    text: "AI-Talenta: Berdasarkan data kompetensi Anda (Putri A), pelatihan Manajemen Data Publik direkomendasikan karena Anda memiliki gap di Data Engineering.",
    type: "ai",
    delay: 4000, // Increased delay
  },
];

/**
 * Menambahkan pesan ke jendela chat
 * @param {string} text - Isi pesan
 * @param {'ai'|'user'} type - Jenis pesan (ai/user)
 */
function addMessage(text, type) {
  if (!chatbotBody) return;
  const msgDiv = document.createElement("div");
  msgDiv.classList.add(
    "chat-message",
    type === "ai" ? "message-ai" : "message-user"
  );
  msgDiv.textContent = text;
  chatbotBody.appendChild(msgDiv);

  // Animasikan pesan
  requestAnimationFrame(() => msgDiv.classList.add("visible"));

  // Scroll ke bawah
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

/**
 * Memuat dan menampilkan percakapan awal dengan delay.
 */
function loadInitialConversation() {
  if (!chatbotBody) return;
  chatbotBody.innerHTML = ""; // Bersihkan pesan sebelumnya

  initialConversation.forEach((msg) => {
    setTimeout(() => addMessage(msg.text, msg.type), msg.delay);
  });

  // Setelah semua pesan selesai dimuat (atau setelah delay maksimum + sedikit),
  // aktifkan input
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

/**
 * Mengubah status (buka/tutup) jendela chatbot dan memuat percakapan.
 */
function toggleChatbot() {
  const isOpen = chatbotWindow.classList.toggle("open");

  if (isOpen) {
    chatbotWindow.setAttribute("aria-hidden", "false");
    // Nonaktifkan input saat pesan otomatis sedang dimuat
    chatInput.disabled = true;
    sendButton.disabled = true;

    loadInitialConversation();
  } else {
    chatbotWindow.setAttribute("aria-hidden", "true");
    chatInput.disabled = true;
    sendButton.disabled = true;
  }
}

// Placeholder for sending message (using the simple logic now that input is enabled)
sendButton.addEventListener("click", function () {
  const message = chatInput.value.trim();
  if (message) {
    addMessage(message, "user"); // Tampilkan pesan user
    chatInput.value = "";

    // Simulasi balasan AI setelah 1 detik
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
// Mengizinkan kirim pesan dengan Enter
chatInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendButton.click();
  }
});

// Utility functions shared across pages

// Toast system
const toastsEl = document.getElementById("toasts");

function toast(type, title, desc) {
  if (!toastsEl) return;

  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<div style="flex-shrink:0;margin-top:2px">
    ${
      type === "success"
        ? '<svg class="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>'
        : type === "error"
        ? '<svg class="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>'
        : '<svg class="w-5 h-5 text-slate-500" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1"/><circle cx="12" cy="8" r="1" fill="currentColor"/></svg>'
    }
  </div>
  <div style="flex:1">
    <div class="title">${title}</div>
    ${desc ? `<div class="desc">${desc}</div>` : ""}
  </div>
  <button aria-label="Dismiss" style="margin-left:.5rem;background:none;border:none;cursor:pointer" onclick="this.parentElement.remove()">✕</button>`;
  toastsEl.prepend(el);
  setTimeout(() => el.remove(), 6000);
}

// Format price
function formatPrice(n) {
  return `$${Number(n).toLocaleString()}`;
}

// Get URL parameter
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Auth management
let currentUser = null;

function getCurrentUser() {
  if (!currentUser) {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      currentUser = JSON.parse(savedUser);
    }
  }
  return currentUser;
}

function setCurrentUser(user) {
  currentUser = user;
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("currentUser");
  }
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  if (typeof toast !== "undefined") {
    toast("info", "Đã đăng xuất", "Bạn cần đăng nhập để đặt phòng");
  }
  window.location.href = "index.html";
}

// Check if user is logged in (redirect if not)
function requireAuth(redirectTo = "login.html") {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

// Get room by ID
function getRoomById(id) {
  return roomsData.find((r) => r.id === Number(id));
}

// Calculate nights between two dates
function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const ci = new Date(checkIn);
  const co = new Date(checkOut);
  const diff = Math.ceil((co - ci) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

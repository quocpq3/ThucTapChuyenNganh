// sidebar-active.js - Highlight sidebar item hiện tại và xử lý collapse toggle

// Hàm highlight sidebar
function highlightActiveSidebar() {
  const currentPath = window.location.pathname;

  // Remove all active first
  document
    .querySelectorAll("a.sidebar-menu-item.active")
    .forEach((link) => link.classList.remove("active"));

  const sidebarLinks = document.querySelectorAll("a.sidebar-menu-item");

  sidebarLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");
    if (!linkPath) return;

    const currentSeg = currentPath.split("/")[2]; // admin / xxx
    const linkSeg = linkPath.split("/")[2];

    // Dashboard special case
    if (
      (currentPath === "/admin" || currentPath === "/admin/") &&
      (linkPath === "/admin" || linkPath === "/admin/")
    ) {
      link.classList.add("active");
      return;
    }

    // Match theo segment để tránh nhầm rooms vs room-detail
    if (currentSeg === linkSeg) {
      link.classList.add("active");
    }
  });
}

// Xử lý collapse toggle - sử dụng event delegation để hoạt động với menu động
let collapseToggleInitialized = false;

function initCollapseToggle() {
  // Chỉ khởi tạo một lần với event delegation
  if (collapseToggleInitialized) return;
  collapseToggleInitialized = true;

  // Sử dụng event delegation trên document để xử lý tất cả collapse toggle
  // Kể cả những element được tạo động sau này
  document.addEventListener("click", (e) => {
    // Kiểm tra xem click có phải vào collapse-toggle không
    const toggle = e.target.closest(".collapse-toggle");
    if (!toggle) return;

    // Không stopPropagation để các event khác vẫn hoạt động
    const targetId = toggle.getAttribute("data-collapse");
    if (!targetId) {
      console.warn("Collapse toggle has no data-collapse attribute:", toggle);
      return;
    }

    // Loại bỏ dấu # nếu có
    const cleanTargetId = targetId.startsWith("#")
      ? targetId.substring(1)
      : targetId;
    const target =
      document.getElementById(cleanTargetId) ||
      document.querySelector(targetId);

    if (!target) {
      console.warn("Collapse target not found:", targetId);
      return;
    }

    const chevron = toggle.querySelector(".fa-chevron-down");
    const isOpen = target.classList.contains("open");

    // Toggle trạng thái
    if (isOpen) {
      target.classList.remove("open");
      if (chevron) chevron.classList.remove("rotate-180");
    } else {
      target.classList.add("open");
      if (chevron) chevron.classList.add("rotate-180");
    }

    console.log("Collapse toggle clicked:", targetId, "isOpen:", !isOpen);
  });

  console.log("Collapse toggle initialized with event delegation");
}

// Hàm khởi tạo chính
function initSidebarActive() {
  highlightActiveSidebar();
  initCollapseToggle();
}

// Chạy khi DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSidebarActive);
} else {
  // DOM đã sẵn sàng, chạy ngay
  initSidebarActive();
}

// Chạy lại sau khi toàn bộ script load (để đảm bảo menu động đã được render)
window.addEventListener("load", () => {
  setTimeout(() => {
    highlightActiveSidebar();
  }, 500);
});

// Chạy lại sau khi rooms.js render xong menu (nếu có)
// Sử dụng MutationObserver để theo dõi khi menu được thêm vào
let observerInitialized = false;

function initObserver() {
  if (observerInitialized) return;
  observerInitialized = true;

  const observer = new MutationObserver(() => {
    highlightActiveSidebar();
  });

  // Quan sát sidebarNav để biết khi menu được render
  const sidebarNav = document.getElementById("sidebarNav");
  if (sidebarNav) {
    observer.observe(sidebarNav, {
      childList: true,
      subtree: true,
    });
    console.log("MutationObserver initialized for sidebarNav");
  } else {
    // Nếu chưa có sidebarNav, thử lại sau
    setTimeout(initObserver, 100);
  }
}

// Khởi tạo observer
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initObserver);
} else {
  initObserver();
}

// Layout loader - Load header and footer components
// Tương tự như layout.hbs trong Handlebars

async function loadPartial(partialPath, targetElementId) {
  try {
    const response = await fetch(partialPath);
    if (!response.ok) {
      throw new Error(`Failed to load partial: ${partialPath}`);
    }
    const html = await response.text();
    const targetElement = document.getElementById(targetElementId);
    if (targetElement) {
      targetElement.innerHTML = html;

      // Initialize functionality after loading
      if (partialPath.includes("header.html")) {
        initializeHeader();
      } else if (partialPath.includes("footer.html")) {
        initializeFooter();
      }
    }
  } catch (error) {
    console.error("Error loading partial:", error);
  }
}

function initializeHeader() {
  // Mobile menu toggle
  const mobileToggle = document.getElementById("mobileToggle");
  const mobileSheet = document.getElementById("mobileSheet");
  const mobileClose = document.getElementById("mobileClose");
  const mobileBook = document.getElementById("mobileBook");
  const mobileRooms = document.getElementById("mobileRooms");
  const mobileLoginBtn = document.getElementById("mobileLoginBtn");
  const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");

  if (mobileToggle && mobileSheet) {
    mobileToggle.addEventListener("click", () => {
      mobileSheet.classList.remove("translate-x-full");
    });
  }

  if (mobileClose && mobileSheet) {
    mobileClose.addEventListener("click", () => {
      mobileSheet.classList.add("translate-x-full");
    });
  }

  // Navigation buttons
  if (mobileBook) {
    mobileBook.addEventListener("click", () => {
      const token = getAuthToken();
      if (token) {
        window.location.href = "/booking";
      } else {
        window.location.href = "/login";
      }
      if (mobileSheet) {
        mobileSheet.classList.add("translate-x-full");
      }
    });
  }

  if (mobileRooms) {
    mobileRooms.addEventListener("click", () => {
      window.location.href = "/#rooms";
      if (mobileSheet) {
        mobileSheet.classList.add("translate-x-full");
      }
    });
  }

  if (mobileLoginBtn) {
    mobileLoginBtn.addEventListener("click", () => {
      window.location.href = "/login";
    });
  }

  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener("click", () => {
      clearAuth();
    });
  }

  // Desktop buttons
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const bookNowHeader = document.getElementById("bookNowHeader");
  const navRoomsBtn = document.getElementById("navRoomsBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "/login";
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearAuth();
    });
  }

  if (bookNowHeader && !bookNowHeader.hasAttribute("data-initialized")) {
    // Mark as initialized to prevent duplicate listeners
    bookNowHeader.setAttribute("data-initialized", "true");

    bookNowHeader.addEventListener("click", () => {
      const token = getAuthToken();
      if (token) {
        window.location.href = "/booking";
      } else {
        window.location.href = "/login";
      }
    });
  }

  if (navRoomsBtn) {
    // Default behavior: navigate to /#rooms
    // Trang index sẽ override trong main.js để smooth scroll
    navRoomsBtn.addEventListener("click", () => {
      if (window.location.pathname === "/") {
        // On index page, smooth scroll
        const roomsSection = document.getElementById("rooms");
        if (roomsSection) {
          roomsSection.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Navigate to index
        window.location.href = "/#rooms";
      }
    });
  }

  // Update user info display
  updateUserInfo();
}

function initializeFooter() {
  // Set current year
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

function getInitialFromName(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    // Lấy chữ cái đầu của từ đầu và từ cuối
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  // Nếu chỉ có một từ, lấy chữ cái đầu
  return name[0].toUpperCase();
}

function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const obj = JSON.parse(decodeURIComponent(escape(json)));
    // If the token payload wraps the user object (e.g. { user: { name, email } }) return it
    return obj.user || obj;
  } catch (e) {
    return null;
  }
}

function updateUserInfo() {
  const token = getAuthToken();
  // Prefer session-stored user (set immediately after login). Fallback to token payload.
  const userFromSession =
    typeof getAuthUser === "function" ? getAuthUser() : null;
  const user = userFromSession || (token ? parseJwt(token) : null);
  const userInfo = document.getElementById("userInfo");
  const userNameDisplay = document.getElementById("userNameDisplay");
  const userAvatarInitial = document.getElementById("userAvatarInitial");
  const loginBtn = document.getElementById("loginBtn");
  const mobileUserInfo = document.getElementById("mobileUserInfo");
  const mobileUserName = document.getElementById("mobileUserName");
  const mobileUserAvatarInitial = document.getElementById(
    "mobileUserAvatarInitial"
  );
  const mobileLoginBtn = document.getElementById("mobileLoginBtn");
  const bookNowHeader = document.getElementById("bookNowHeader");

  // Ensure header buttons are initialized (in case header was added dynamically)
  if (bookNowHeader && !bookNowHeader.hasAttribute("data-initialized")) {
    initializeHeader();
  }

  if (user) {
    const initial = getInitialFromName(user.name || user.email);

    // Desktop
    if (userInfo) userInfo.style.display = "flex";
    if (userNameDisplay) userNameDisplay.textContent = user.name || user.email;
    if (userAvatarInitial) userAvatarInitial.textContent = initial;
    if (loginBtn) loginBtn.style.display = "none";

    // Mobile
    if (mobileUserInfo) mobileUserInfo.style.display = "flex";
    if (mobileUserName) mobileUserName.textContent = user.name || user.email;
    if (mobileUserAvatarInitial) mobileUserAvatarInitial.textContent = initial;
    if (mobileLoginBtn) mobileLoginBtn.style.display = "none";
  } else {
    // Desktop
    if (userInfo) userInfo.style.display = "none";
    if (loginBtn) loginBtn.style.display = "inline-flex";

    // Mobile
    if (mobileUserInfo) mobileUserInfo.style.display = "none";
    if (mobileLoginBtn) mobileLoginBtn.style.display = "inline-flex";
  }
}

// Apply given user object to header UI (used when server returns user alongside token)
function applyUserToHeader(user) {
  const userInfo = document.getElementById("userInfo");
  const userNameDisplay = document.getElementById("userNameDisplay");
  const userAvatarInitial = document.getElementById("userAvatarInitial");
  const loginBtn = document.getElementById("loginBtn");
  const mobileUserInfo = document.getElementById("mobileUserInfo");
  const mobileUserName = document.getElementById("mobileUserName");
  const mobileUserAvatarInitial = document.getElementById(
    "mobileUserAvatarInitial"
  );
  const mobileLoginBtn = document.getElementById("mobileLoginBtn");

  if (user) {
    const initial = getInitialFromName(user.name || user.email);
    if (userInfo) userInfo.style.display = "flex";
    if (userNameDisplay) userNameDisplay.textContent = user.name || user.email;
    if (userAvatarInitial) userAvatarInitial.textContent = initial;
    if (loginBtn) loginBtn.style.display = "none";

    if (mobileUserInfo) mobileUserInfo.style.display = "flex";
    if (mobileUserName) mobileUserName.textContent = user.name || user.email;
    if (mobileUserAvatarInitial) mobileUserAvatarInitial.textContent = initial;
    if (mobileLoginBtn) mobileLoginBtn.style.display = "none";
  } else {
    if (userInfo) userInfo.style.display = "none";
    if (loginBtn) loginBtn.style.display = "inline-flex";

    if (mobileUserInfo) mobileUserInfo.style.display = "none";
    if (mobileLoginBtn) mobileLoginBtn.style.display = "inline-flex";
  }
}

// Auto-load partials when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Determine base path based on current page location
  const currentPath = window.location.pathname;
  const isInSubDir = currentPath.includes("/") && !currentPath.endsWith("/");
  const basePath = isInSubDir ? "../partials/" : "partials/";

  // Load header if placeholder exists
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (headerPlaceholder) {
    loadPartial(`${basePath}header.html`, "header-placeholder");
  } else {
    // If header already exists in HTML (not loaded via partial), initialize it directly
    const existingHeader =
      document.getElementById("bookNowHeader") ||
      document.getElementById("loginBtn") ||
      document.getElementById("navRoomsBtn");
    if (existingHeader) {
      initializeHeader();
    }
  }

  // Load footer if placeholder exists
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    loadPartial(`${basePath}footer.html`, "footer-placeholder");
  } else {
    // If footer already exists in HTML, initialize it directly
    const yearElement = document.getElementById("year");
    if (yearElement) {
      initializeFooter();
    }
  }

  // Update user info periodically (in case token changes in another tab)
  setInterval(updateUserInfo, 1000);
});

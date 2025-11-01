// Main page JavaScript for index.html

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  // Mobile sheet toggle
  const mobileSheet = document.getElementById("mobileSheet");
  document.getElementById("mobileToggle").addEventListener("click", () => {
    mobileSheet.style.transform = "translateX(0)";
  });
  document.getElementById("mobileClose").addEventListener("click", () => {
    mobileSheet.style.transform = "translateX(100%)";
  });
  document.getElementById("mobileBook").addEventListener("click", () => {
    const user = getCurrentUser();
    if (user) {
      window.location.href = "booking.html";
    } else {
      window.location.href = "login.html?return=booking.html";
    }
    mobileSheet.style.transform = "translateX(100%)";
  });
  document.getElementById("mobileRooms").addEventListener("click", () => {
    document.getElementById("rooms").scrollIntoView({ behavior: "smooth" });
    mobileSheet.style.transform = "translateX(100%)";
  });

  /* Header interactions */
  document.getElementById("bookNowHeader").addEventListener("click", () => {
    const user = getCurrentUser();
    if (user) {
      window.location.href = "booking.html";
    } else {
      window.location.href = "login.html?return=booking.html";
    }
  });
  document.getElementById("heroBook").addEventListener("click", () => {
    const user = getCurrentUser();
    if (user) {
      window.location.href = "booking.html";
    } else {
      window.location.href = "login.html?return=booking.html";
    }
  });
  document
    .getElementById("heroExplore")
    .addEventListener("click", () => scrollToRooms());
  document
    .getElementById("navRoomsBtn")
    .addEventListener("click", () => scrollToRooms());

  /* Populate Rooms */
  const roomsGrid = document.getElementById("roomsGrid");

  function renderRooms() {
    roomsGrid.innerHTML = "";
    roomsData.forEach((r) => {
      const card = document.createElement("article");
      card.className =
        "rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden";
      card.innerHTML = `
          <div style="height:220px; background: linear-gradient(135deg, rgba(34,57,89,.9), rgba(67,46,40,.6));" class="w-full">
              <img src="${r.url}" alt="${
        r.name
      }" class="w-full h-full object-cover object-center"/>
          </div>
          <div class="p-6 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">${r.name}</h3>
              <div class="chip bg-gray-100 text-accent-foreground">${formatPrice(
                r.price
              )}/night</div>
            </div>
            <p class="text-sm text-muted-foreground">${r.description}</p>
            <div class="flex flex-wrap gap-2 mt-2">
              ${r.features
                .slice(0, 4)
                .map(
                  (f) =>
                    `<span class="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full border border-input bg-card">${f}</span>`
                )
                .join("")}
            </div>
            <div class="flex items-center justify-between pt-2">
              <p class="text-sm text-muted-foreground">${r.size} m² • ${
        r.bedType
      } • ${r.maxGuests} guests</p>
              <div class="flex gap-2">
                <a href="room-detail.html?id=${
                  r.id
                }" class="rounded-md border border-input px-3 py-2 text-sm hover:bg-card/50">Chi tiết</a>
                <a href="booking.html?roomId=${
                  r.id
                }" class="rounded-md bg-[#11234B] text-white px-3 py-2">Đặt phòng</a>
              </div>
            </div>
          </div>
        `;
      roomsGrid.appendChild(card);
    });
  }

  renderRooms();

  /* Populate Offers */
  const offersGrid = document.getElementById("offersGrid");

  function renderOffers() {
    offersGrid.innerHTML = "";
    offersData.forEach((o) => {
      const el = document.createElement("div");
      el.className = "rounded-lg border bg-card p-6";
      el.innerHTML = `
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">${o.title}</h3>
            <div class="chip bg-amber-400 text-accent-foreground">${
              o.discount
            }</div>
          </div>
          <p class="mt-2 text-sm text-muted-foreground">${o.description}</p>
          <hr class="my-4 border-t border-border/60" />
          <ul class="space-y-2 text-sm">
            ${o.features
              .map((f) => `<li class="flex  items-center gap-2">✓ ${f}</li>`)
              .join("")}
          </ul>
        `;
      offersGrid.appendChild(el);
    });
  }

  renderOffers();

  /* Populate Testimonials */
  const testimonialsGrid = document.getElementById("testimonialsGrid");

  function renderTestimonials() {
    testimonialsGrid.innerHTML = "";
    testimonialsData.forEach((t) => {
      const el = document.createElement("div");
      el.className = "rounded-lg border bg-card p-6";
      el.innerHTML = `
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-full bg-gray-200"></div>
            <div>
              <p class="font-medium">${t.name}</p>
              <p class="text-xs text-muted-foreground">${t.location}</p>
            </div>
          </div>
          <p class="mt-4 text-sm text-muted-foreground">"${t.review}"</p>
        `;
      testimonialsGrid.appendChild(el);
    });
  }

  renderTestimonials();

  /* Helpers */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* scroll to rooms */
  function scrollToRooms() {
    document.getElementById("rooms").scrollIntoView({ behavior: "smooth" });
  }

  // Auth UI update
  function updateAuthUI() {
    const user = getCurrentUser();
    const userInfo = document.getElementById("userInfo");
    const loginBtn = document.getElementById("loginBtn");
    const userNameDisplay = document.getElementById("userNameDisplay");
    const mobileUserInfo = document.getElementById("mobileUserInfo");
    const mobileLoginBtn = document.getElementById("mobileLoginBtn");
    const mobileUserName = document.getElementById("mobileUserName");

    if (user) {
      if (userInfo) userInfo.style.display = "flex";
      if (loginBtn) loginBtn.style.display = "none";
      if (userNameDisplay) userNameDisplay.textContent = user.name;
      if (mobileUserInfo) mobileUserInfo.style.display = "flex";
      if (mobileLoginBtn) mobileLoginBtn.style.display = "none";
      if (mobileUserName) mobileUserName.textContent = user.name;
    } else {
      if (userInfo) userInfo.style.display = "none";
      if (loginBtn) loginBtn.style.display = "inline-flex";
      if (mobileUserInfo) mobileUserInfo.style.display = "none";
      if (mobileLoginBtn) mobileLoginBtn.style.display = "inline-flex";
    }
  }

  // Initialize auth UI
  updateAuthUI();

  // Logout buttons
  const logoutBtn = document.getElementById("logoutBtn");
  const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logoutUser();
      updateAuthUI();
    });
  }
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener("click", () => {
      logoutUser();
      updateAuthUI();
      mobileSheet.style.transform = "translateX(100%)";
    });
  }

  // Login buttons
  const loginBtn = document.getElementById("loginBtn");
  const mobileLoginBtn = document.getElementById("mobileLoginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
  if (mobileLoginBtn) {
    mobileLoginBtn.addEventListener("click", () => {
      window.location.href = "login.html";
      mobileSheet.style.transform = "translateX(100%)";
    });
  }

  /* Newsletter */
  document.getElementById("newsletterBtn").addEventListener("click", () => {
    const e = document.getElementById("newsletterEmail").value.trim();
    if (!e) {
      toast("error", "Vui lòng nhập địa chỉ email");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(e)) {
      toast("error", "Vui lòng nhập địa chỉ email hợp lệ");
      return;
    }
    toast(
      "success",
      "Đăng ký thành công!",
      "Kiểm tra email của bạn để nhận các ưu đãi độc quyền."
    );
    document.getElementById("newsletterEmail").value = "";
  });

  /* initial simple demo toast */
  setTimeout(
    () =>
      toast(
        "info",
        "Chào mừng",
        'Khám phá trang web — nhấp vào "Đặt Phòng Ngay" để trải nghiệm quy trình đặt phòng.'
      ),
    700
  );
});

// Main page JavaScript for index
// Lưu ý: Header và footer được load bởi layout.js

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  // Đợi header được load xong (layout.js xử lý header)
  // Chỉ cần xử lý các tương tác riêng của trang index
  const heroBookBtn = document.getElementById("heroBook");
  if (heroBookBtn) {
    heroBookBtn.addEventListener("click", () => {
      const token =
        typeof getAuthToken === "function"
          ? getAuthToken()
          : localStorage.getItem("authToken");
      if (token) {
        window.location.href = "/booking";
      } else {
        window.location.href = "/login?return=booking";
      }
    });
  }
  const heroExploreBtn = document.getElementById("heroExplore");
  if (heroExploreBtn) {
    heroExploreBtn.addEventListener("click", () => scrollToRooms());
  }

  // navRoomsBtn được xử lý trong layout.js, nhưng override để smooth scroll trên index
  // Đợi header được load xong (layout.js load async)
  setTimeout(() => {
    const navRoomsBtn = document.getElementById("navRoomsBtn");
    if (navRoomsBtn) {
      // Remove existing listeners bằng cách thay thế element
      const newBtn = navRoomsBtn.cloneNode(true);
      navRoomsBtn.parentNode.replaceChild(newBtn, navRoomsBtn);
      newBtn.addEventListener("click", (e) => {
        e.preventDefault();
        scrollToRooms();
      });
    }
  }, 100);

  /* Populate Rooms */
  const roomsGrid = document.getElementById("roomsGrid");

  function renderRooms() {
    roomsGrid.innerHTML = "";

    const maxVisible = 4; // Số phòng hiển thị ban đầu
    roomsData.forEach((r, index) => {
      const hiddenClass = index >= maxVisible ? "hidden extra-room" : "";
      const card = document.createElement("article");
      card.className = `rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden ${hiddenClass}`;
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
              <a href="/room-detail?id=${
                r.id
              }" class="rounded-md border border-input px-3 py-2 text-sm hover:bg-card/50">Chi tiết</a>
              <a href="/booking?roomId=${
                r.id
              }" class="rounded-md bg-[#11234B] text-white px-3 py-2">Đặt phòng</a>
            </div>
          </div>
        </div>
      `;
      roomsGrid.appendChild(card);
    });

    // Nếu có nhiều hơn maxVisible phòng thì thêm nút xem thêm
    if (roomsData.length > maxVisible) {
      const btnWrapper = document.createElement("div");
      btnWrapper.className = "flex justify-center mt-4"; // căn giữa
      const showMoreBtn = document.createElement("button");
      showMoreBtn.id = "showMoreRooms";
      showMoreBtn.className =
        "px-4 py-2 rounded border-[2px] border-black-700  bg-card/50 text-black hover:opacity-90";
      showMoreBtn.innerText = "Xem thêm";

      btnWrapper.appendChild(showMoreBtn);
      roomsGrid.parentNode.appendChild(btnWrapper);

      showMoreBtn.addEventListener("click", () => {
        document
          .querySelectorAll(".extra-room")
          .forEach((el) => el.classList.remove("hidden"));
        btnWrapper.style.display = "none"; // ẩn nút wrapper sau khi click
      });
    }
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

  /* scroll to rooms */
  function scrollToRooms() {
    const roomsSection = document.getElementById("rooms");
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Auth UI được xử lý bởi layout.js, không cần khởi tạo lại ở đây

  /* Newsletter */
  const newsletterBtn = document.getElementById("newsletterBtn");
  if (newsletterBtn) {
    newsletterBtn.addEventListener("click", () => {
      const emailInput = document.getElementById("newsletterEmail");
      if (!emailInput) return;

      const e = emailInput.value.trim();
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
      emailInput.value = "";
    });
  }

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

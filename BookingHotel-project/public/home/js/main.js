// Main page JavaScript for index
// Lưu ý: Header và footer được load bởi layout.js

document.addEventListener("DOMContentLoaded", () => {
  /* Hero buttons */
  const heroBookBtn = document.getElementById("heroBook");
  if (heroBookBtn) {
    heroBookBtn.addEventListener("click", () => {
      window.location.href = "/booking";
    });
  }

  const heroExploreBtn = document.getElementById("heroExplore");
  if (heroExploreBtn) {
    heroExploreBtn.addEventListener("click", () => scrollToRooms());
  }

  /* Override navRoomsBtn để smooth scroll (header load async) */
  setTimeout(() => {
    const navRoomsBtn = document.getElementById("navRoomsBtn");
    if (navRoomsBtn) {
      const newBtn = navRoomsBtn.cloneNode(true);
      navRoomsBtn.parentNode.replaceChild(newBtn, navRoomsBtn);
      newBtn.addEventListener("click", (e) => {
        e.preventDefault();
        scrollToRooms();
      });
    }
  }, 100);

  /* Populate Offers */
  const offersGrid = document.getElementById("offersGrid");

  // function renderOffers() {
  //   offersGrid.innerHTML = "";
  //   offersData.forEach((o) => {
  //     const el = document.createElement("div");
  //     el.className = "rounded-lg border bg-card p-6";
  //     el.innerHTML = `
  //       <div class="flex items-center justify-between">
  //         <h3 class="text-lg font-semibold">${o.title}</h3>
  //         <div class="chip bg-amber-400 text-accent-foreground">
  //           ${o.discount}
  //         </div>
  //       </div>
  //       <p class="mt-2 text-sm text-muted-foreground">${o.description}</p>
  //       <hr class="my-4 border-t border-border/60" />
  //       <ul class="space-y-2 text-sm">
  //         ${o.features
  //           .map((f) => `<li class="flex items-center gap-2">✓ ${f}</li>`)
  //           .join("")}
  //       </ul>
  //     `;
  //     offersGrid.appendChild(el);
  //   });
  // }

  // renderOffers();

  /* Populate Testimonials (load from server) */
  const testimonialsGrid = document.getElementById("testimonialsGrid");

  // function renderTestimonialsFromArray(arr) {
  //   testimonialsGrid.innerHTML = "";
  //   arr.forEach((t) => {
  //     const el = document.createElement("div");
  //     el.className = "rounded-lg border bg-card p-6";
  //     const author = t.user && t.user.name ? t.user.name : "Khách hàng";
  //     el.innerHTML = `
  //       <div class="flex items-center gap-3">
  //         <div class="size-10 rounded-full bg-gray-200"></div>
  //         <div>
  //           <p class="font-medium">${author}</p>
  //           <p class="text-xs text-muted-foreground">${new Date(
  //             t.createdAt
  //           ).toLocaleDateString()}</p>
  //         </div>
  //       </div>
  //       <p class="mt-4 text-sm text-muted-foreground">"${(
  //         t.comment || ""
  //       ).replace(/</g, "&lt;")}"</p>
  //     `;
  //     testimonialsGrid.appendChild(el);
  //   });
  // }

  function loadTestimonials() {
    fetch("/reviews")
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success) renderTestimonialsFromArray(json.reviews);
      })
      .catch((err) => console.error("Failed to load reviews", err));
  }

  loadTestimonials();

  /* Scroll to rooms */
  function scrollToRooms() {
    const roomsSection = document.getElementById("rooms");
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: "smooth" });
    }
  }

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

  /* Welcome toast */
  setTimeout(() => {
    toast(
      "info",
      "Chào mừng",
      'Khám phá trang web — nhấp vào "Đặt Phòng Ngay" để xem các phòng.'
    );
  }, 700);
});

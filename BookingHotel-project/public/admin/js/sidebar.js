// sidebar.js
// roomsData được load từ data.js (global variable)
// openRoomDetail được import từ rooms.js nếu cần

// ====================== RENDER SIDEBAR ======================
export function renderSidebarRooms() {
  const sidebarNav = document.querySelector("#sidebar nav");
  if (!sidebarNav) return;

  // Xóa menu cũ nếu tồn tại
  const existing = document.querySelector("#menu-rooms");
  if (existing) existing.remove();

  const roomsMenu = document.createElement("ul");
  roomsMenu.id = "menu-rooms";
  roomsMenu.classList.add("collapse-transition", "space-y-1");

  const floors = [...new Set(roomsData.map((r) => r.floor))];

  floors.forEach((floor) => {
    const liFloor = document.createElement("li");
    liFloor.innerHTML = `
      <button class="sidebar-menu-item collapse-toggle" data-collapse="#floor-${floor}">
        <span>${floor}</span>
        <i class="fa-solid fa-chevron-down text-sm"></i>
      </button>
      <ul id="floor-${floor}" class="collapse-transition space-y-1"></ul>
    `;

    const ulFloor = liFloor.querySelector("ul");

    const types = [
      ...new Set(
        roomsData.filter((r) => r.floor === floor).map((r) => r.category)
      ),
    ];

    types.forEach((type) => {
      const liType = document.createElement("li");
      liType.innerHTML = `
        <button class="sidebar-menu-item collapse-toggle" data-collapse="#floor-${floor}-${type}">
          <span>${type}</span>
          <i class="fa-solid fa-chevron-down text-sm"></i>
        </button>
        <ul id="floor-${floor}-${type}" class="collapse-transition space-y-1"></ul>
      `;

      const ulType = liType.querySelector("ul");

      roomsData
        .filter((r) => r.floor === floor && r.category === type)
        .forEach((room) => {
          const liRoom = document.createElement("li");
          liRoom.innerHTML = `
            <a href="#" class="sidebar-menu-item" data-id="${room.id}">
              ${room.name}
            </a>`;
          ulType.appendChild(liRoom);
        });

      ulFloor.appendChild(liType);
    });

    roomsMenu.appendChild(liFloor);
  });

  // nút Thêm phòng
  const addRoomLi = document.createElement("li");
  addRoomLi.innerHTML = `
    <a href="/admin/rooms" class="sidebar-menu-item">
      <i class="fa-solid fa-plus"></i> Thêm phòng
    </a>`;
  roomsMenu.appendChild(addRoomLi);

  sidebarNav.appendChild(roomsMenu);
}

// ====================== EVENT DELEGATION ======================
function initSidebarEvents() {
  // Collapse toggle
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".collapse-toggle");
    if (!btn) return;

    const target = document.querySelector(btn.dataset.collapse);
    if (!target) return;

    const chevron = btn.querySelector(".fa-chevron-down");

    target.classList.toggle("open");
    chevron?.classList.toggle("rotate-180");
  });

  // Click room → open detail
  document.addEventListener("click", (e) => {
    const link = e.target.closest("#menu-rooms a.sidebar-menu-item[data-id]");
    if (!link) return;

    e.preventDefault();
    const id = Number(link.dataset.id);
    const room = roomsData.find((r) => r.id === id);
    if (!room) return;

    // mở toàn bộ tầng / loại chứa room
    let parent = link.closest(".collapse-transition");
    while (parent && parent.id !== "menu-rooms") {
      parent.classList.add("open");

      const toggleIcon = document.querySelector(
        `[data-collapse="#${parent.id}"] .fa-chevron-down`
      );
      toggleIcon?.classList.add("rotate-180");

      parent = parent.parentElement.closest(".collapse-transition");
    }

    // Kiểm tra xem có đang ở trang rooms không (có mainContent)
    const mainContent = document.getElementById("mainContent");
    if (mainContent) {
      // Nếu đang ở trang rooms, import và gọi openRoomDetail
      import("./rooms.js").then((module) => {
        if (module.openRoomDetail) {
          module.openRoomDetail(room.id);
        }
      });
    } else {
      // Nếu không, điều hướng đến trang room-detail
      window.location.href = `/admin/room-detail?room=${room.id}`;
    }
  });
}

// ====================== INIT ======================
document.addEventListener("DOMContentLoaded", () => {
  renderSidebarRooms();
  initSidebarEvents(); // chỉ chạy 1 lần duy nhất
});

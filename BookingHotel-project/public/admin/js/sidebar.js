// sidebar.js
import { roomsData, openRoomDetail } from "./rooms.js";

// Hàm render menu phòng tự động
export function renderSidebarRooms() {
  const sidebarNav = document.querySelector("#sidebar nav");
  if (!sidebarNav) return;

  // Kiểm tra nếu menu rooms đã tồn tại thì xóa
  const existing = document.querySelector("#menu-rooms");
  if (existing) existing.remove();

  const roomsMenu = document.createElement("ul");
  roomsMenu.id = "menu-rooms";
  roomsMenu.classList.add("collapse-transition", "space-y-1");

  // Lấy danh sách tầng
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

    // Lấy danh sách loại phòng trong tầng
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

      // Thêm các phòng vào loại phòng
      roomsData
        .filter((r) => r.floor === floor && r.category === type)
        .forEach((room) => {
          const liRoom = document.createElement("li");
          liRoom.innerHTML = `<a href="#" class="sidebar-menu-item" data-id="${room.id}">${room.name}</a>`;
          ulType.appendChild(liRoom);
        });

      ulFloor.appendChild(liType);
    });

    roomsMenu.appendChild(liFloor);
  });

  // Thêm nút "Thêm phòng" ở cuối menu
  const addRoomLi = document.createElement("li");
  addRoomLi.innerHTML = `<a href="/admin/rooms" class="sidebar-menu-item"><i class="fa-solid fa-plus"></i> Thêm phòng</a>`;
  roomsMenu.appendChild(addRoomLi);

  sidebarNav.appendChild(roomsMenu);

  // Gắn sự kiện toggle collapse
  attachSidebarToggles();

  // Gắn sự kiện click vào phòng
  attachSidebarRoomLinks();
}

// Toggle collapse tầng / loại
function attachSidebarToggles() {
  document.querySelectorAll(".collapse-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const target = document.querySelector(toggle.dataset.collapse);
      const chevron = toggle.querySelector(".fa-chevron-down");
      if (!target) return;
      const isOpen = target.classList.contains("open");
      if (isOpen) {
        target.classList.remove("open");
        chevron?.classList.remove("rotate-180");
      } else {
        target.classList.add("open");
        chevron?.classList.add("rotate-180");
      }
    });
  });
}

// Click vào phòng → mở chi tiết
function attachSidebarRoomLinks() {
  const roomLinks = document.querySelectorAll(
    "#menu-rooms a.sidebar-menu-item[data-id]"
  );
  roomLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = parseInt(link.dataset.id);
      const room = roomsData.find((r) => r.id === id);
      if (!room) return;

      // Mở đúng tầng và loại phòng
      let parent = link.closest(".collapse-transition");
      while (parent && parent.id !== "menu-rooms") {
        parent.classList.add("open");
        const toggle = document.querySelector(
          `[data-collapse="#${parent.id}"] .fa-chevron-down`
        );
        toggle?.classList.add("rotate-180");
        parent = parent.parentElement.closest(".collapse-transition");
      }

      openRoomDetail(room.id);
    });
  });
}

// Gọi hàm khi DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  renderSidebarRooms();
});

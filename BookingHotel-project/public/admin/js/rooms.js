// rooms.js

// ----------------- DOM ELEMENTS -----------------
const mainContent = document.getElementById("mainContent");
const roomModal = document.getElementById("roomModal");
const roomForm = document.getElementById("roomForm");
const roomIdInput = document.getElementById("roomId");
const roomNameInput = document.getElementById("roomName");
const roomTypeInput = document.getElementById("roomType");
const roomBedInput = document.getElementById("roomBedType");
const roomPriceInput = document.getElementById("roomPrice");
const roomSizeInput = document.getElementById("roomSize");
const roomGuestsInput = document.getElementById("roomGuests");
const roomUrlInput = document.getElementById("roomUrl");
const roomDescInput = document.getElementById("roomDesc");
const roomFeaturesInput = document.getElementById("roomFeatures");
const roomStatusInput = document.getElementById("roomStatus");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");

// ----------------- HELPER: STATUS BADGE -----------------
function getStatusBadge(status) {
  switch (status) {
    case "Đã đặt":
      return '<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Đã đặt</span>';
    case "Bảo trì":
      return '<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Bảo trì</span>';
    case "Trống":
    default:
      return '<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Trống</span>';
  }
}

// ----------------- RENDER BẢNG CRUD -----------------
export function renderRoomTable() {
  mainContent.innerHTML = `
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-extrabold text-gray-800">Quản lý phòng khách sạn</h1>
      <button id="addRoomBtn" class="px-5 py-2 bg-[#11234B] text-white font-medium rounded-lg shadow-md hover:bg-opacity-90 hover:shadow-lg transition duration-200 flex items-center gap-2">
        <i class="fa-solid fa-plus text-sm"></i> Thêm phòng mới
      </button>
    </div>
    <div class="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr class="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50">
              <th class="px-4 py-3">#</th>
              <th class="px-4 py-3">Ảnh</th>
              <th class="px-4 py-3">Tên phòng</th>
              <th class="px-4 py-3">Loại phòng</th>
              <th class="px-4 py-3 text-right">Giá (VNĐ)</th>
              <th class="px-4 py-3 text-center">Sức chứa</th>
              <th class="px-4 py-3 text-center">Giường</th>
              <th class="px-4 py-3 hidden md:table-cell">Diện tích (m²)</th>
              <th class="px-4 py-3 hidden lg:table-cell">Tiện nghi</th>
              <th class="px-4 py-3 text-center">Trạng thái</th>
              <th class="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            ${roomsData
              .map(
                (r, i) => `
              <tr class="hover:bg-blue-50 transition duration-150">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">${
                  i + 1
                }</td>
                <td class="px-4 py-3"><img src="${r.url}" alt="${
                  r.name
                }" class="w-16 h-12 object-cover rounded-md shadow-sm border border-gray-200"/></td>
                <td class="px-4 py-3"><a href="#" class="room-link text-[#11234B] hover:text-blue-700 font-semibold text-sm" data-id="${
                  r.id
                }">${r.name}</a></td>
                <td class="px-4 py-3 text-sm text-gray-600">${r.category}</td>
                <td class="px-4 py-3 text-sm font-bold text-right text-green-600">${r.price.toLocaleString(
                  "vi-VN"
                )}</td>
                <td class="px-4 py-3 text-sm text-center text-gray-600">${
                  r.maxGuests
                }</td>
                <td class="px-4 py-3 text-sm text-center text-gray-600">${
                  r.bedType
                }</td>
                <td class="px-4 py-3 text-sm text-center text-gray-600 hidden md:table-cell">${
                  r.size
                }</td>
                <td class="px-4 py-3 text-xs text-gray-500 max-w-[150px] truncate hidden lg:table-cell" title="${r.features.join(
                  ", "
                )}">${r.features.slice(0, 3).join(", ")}${
                  r.features.length > 3 ? ", ..." : ""
                }</td>
                <td class="px-4 py-3 text-center">${getStatusBadge(
                  r.status
                )}</td>
                <td class="px-4 py-3 text-center space-x-2">
                  <button class="editBtn text-blue-600 hover:text-blue-800 font-medium text-sm p-1 rounded-full hover:bg-blue-100 transition" data-id="${
                    r.id
                  }" title="Sửa">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button class="deleteBtn text-red-600 hover:text-red-800 font-medium text-sm p-1 rounded-full hover:bg-red-100 transition" data-id="${
                    r.id
                  }" title="Xóa">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Click vào tên phòng → render chi tiết
  mainContent.querySelectorAll(".room-link").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openRoomDetail(a.dataset.id);
    });
  });

  document
    .getElementById("addRoomBtn")
    .addEventListener("click", () => openRoomForm());
  attachCRUDButtons();
}

// ----------------- FORM THÊM/SỬA -----------------
export function openRoomForm(room = null) {
  if (roomForm) roomForm.reset();
  if (room) {
    roomIdInput.value = room.id;
    roomNameInput.value = room.name;
    roomTypeInput.value = room.category;
    roomBedInput.value = room.bedType;
    roomPriceInput.value = room.price;
    roomSizeInput.value = room.size;
    roomGuestsInput.value = room.maxGuests;
    roomUrlInput.value = room.url;
    roomDescInput.value = room.description;
    roomFeaturesInput.value = room.features.join(", ");
    roomStatusInput.value = room.status;
    const modalTitleEl = document.getElementById("modalTitle");
    if (modalTitleEl) modalTitleEl.innerText = "Sửa phòng";
  } else {
    const modalTitleEl = document.getElementById("modalTitle");
    if (modalTitleEl) modalTitleEl.innerText = "Thêm phòng";
  }
  if (roomModal) roomModal.classList.remove("hidden");
}
if (roomForm) {
  roomForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = roomIdInput.value;
    const newRoom = {
      id: id ? parseInt(id) : Date.now(),
      name: roomNameInput.value,
      category: roomTypeInput.value,
      floor:
        roomTypeInput.value === "Suite"
          ? "Tầng 5"
          : roomTypeInput.value === "Biệt Thự"
          ? "Tầng Trệt"
          : "Tầng 3",
      bedType: roomBedInput.value,
      price: parseFloat(roomPriceInput.value),
      size: parseInt(roomSizeInput.value),
      maxGuests: parseInt(roomGuestsInput.value),
      url: roomUrlInput.value,
      description: roomDescInput.value,
      features: roomFeaturesInput.value.split(",").map((f) => f.trim()),
      status: roomStatusInput.value,
    };
    if (id) {
      const index =
        typeof roomsData !== "undefined"
          ? roomsData.findIndex((r) => r.id == id)
          : -1;
      if (index > -1) {
        roomsData[index] = newRoom;
      }
    } else {
      if (typeof roomsData !== "undefined") roomsData.push(newRoom);
    }
    if (roomModal) roomModal.classList.add("hidden");
    if (mainContent) renderRoomTable();
  });
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => {
    if (roomModal) roomModal.classList.add("hidden");
  });
}
if (cancelBtn) {
  cancelBtn.addEventListener("click", () => {
    if (roomModal) roomModal.classList.add("hidden");
  });
}

// ----------------- CRUD BUTTON -----------------
function attachCRUDButtons() {
  mainContent.querySelectorAll(".editBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const room = roomsData.find((r) => r.id == btn.dataset.id);
      if (room) openRoomForm(room);
    });
  });
  mainContent.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = roomsData.findIndex((r) => r.id == btn.dataset.id);
      if (index > -1 && confirm("Bạn có chắc muốn xóa phòng này?")) {
        roomsData.splice(index, 1);
        renderRoomTable();
      }
    });
  });
}

// ----------------- SIDEBAR -----------------
export function createSidebar() {
  // Lấy phần tử cha, nơi các menu con sẽ được chèn vào
  const sidebarNav = document.getElementById("sidebarNav");
  const roomsRootLink = document.getElementById("nav-rooms-root");

  if (!sidebarNav || !roomsRootLink) {
    console.error(
      "Sidebar root elements (sidebarNav or nav-rooms-root) not found."
    );
    return;
  } // Cập nhật CSS cho Menu GỐC "Phòng" (Cấp 1) - GIỮ LẠI W-FULL

  // Giữ nguyên class sidebar-menu-item và chỉ thêm collapse-toggle
  roomsRootLink.classList.add("collapse-toggle");
  roomsRootLink.setAttribute("data-collapse", "#menu-rooms");

  // Cập nhật HTML để có cấu trúc giống các nút khác
  roomsRootLink.innerHTML = `
      <i class="fa-regular fa-door-open"></i>
      <span>Phòng</span>
      <i class="fa-solid fa-chevron-down text-sm"></i>
    `; // 2. Tạo UL chứa tất cả các tầng (menu con của "Phòng")

  const roomsUl = document.createElement("ul");
  roomsUl.id = "menu-rooms";
  roomsUl.classList.add("collapse-transition", "space-y-1", "ml-3", "pt-1"); // Thụt lề nhẹ hơn (ml-3) cho cấp 2
  roomsRootLink.after(roomsUl); // 3. Xây dựng cấu trúc menu từ dữ liệu

  const data = Array.isArray(roomsData) ? roomsData : [];
  const floors = {};
  data.forEach((r) => {
    if (!floors[r.floor]) floors[r.floor] = {};
    if (!floors[r.floor][r.category]) floors[r.floor][r.category] = [];
    floors[r.floor][r.category].push(r);
  });

  for (const floorName of Object.keys(floors).sort()) {
    const floorId = `floor-${floorName.replace(/\s/g, "")}`;
    const floorLi = document.createElement("li");
    floorLi.innerHTML = `
      <button class="sidebar-menu-item collapse-toggle flex items-center justify-start py-2 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition duration-150" data-collapse="#${floorId}">
        <i class="fa-solid fa-layer-group w-4 text-indigo-500"></i>
        <span class="ml-3 truncate">${floorName}</span>
        <i class="fa-solid fa-chevron-down text-xs ml-auto text-gray-400 transform transition-transform duration-300"></i>
      </button>
      <ul id="${floorId}" class="collapse-transition space-y-1 ml-3 pt-1"></ul>
    `;
    roomsUl.appendChild(floorLi);

    const floorUl = floorLi.querySelector("ul");

    for (const categoryName of Object.keys(floors[floorName])) {
      const categoryId = `${floorId}-${categoryName.replace(/\s/g, "")}`;
      const categoryLi = document.createElement("li");
      categoryLi.innerHTML = `
        <button class="sidebar-menu-item collapse-toggle flex items-center justify-start py-2 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition duration-150" data-collapse="#${categoryId}">
          <i class="fa-solid fa-tag w-4 text-teal-500"></i>
          <span class="ml-3 truncate">${categoryName}</span>
          <i class="fa-solid fa-chevron-down text-xs ml-auto text-gray-400 transform transition-transform duration-300"></i>
        </button>
        <ul id="${categoryId}" class="collapse-transition space-y-1 ml-3 pt-1"></ul>
      `;
      floorUl.appendChild(categoryLi);

      const categoryUl = categoryLi.querySelector("ul");

      floors[floorName][categoryName].forEach((room) => {
        const roomLi = document.createElement("li");
        roomLi.innerHTML = `<a href="#" class="sidebar-menu-item nav-room-link flex items-center justify-start py-2 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition duration-150" data-id="${room.id}"><i class="fa-solid fa-bed w-4 text-gray-500"></i><span class="ml-3 truncate">${room.name}</span></a>`;
        categoryUl.appendChild(roomLi);
      });
    }
  } // 4. Collapse toggle - Đã được xử lý bởi sidebar-active.js với event delegation
  // Không cần thêm listener ở đây nữa để tránh conflict

  sidebarNav
    .querySelectorAll("a.sidebar-menu-item[data-id]")
    .forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const id = parseInt(link.dataset.id);

        // Nếu mainContent tồn tại (ở trang rooms), render chi tiết
        // Nếu không, điều hướng đến trang rooms
        if (mainContent && typeof openRoomDetail === "function") {
          openRoomDetail(id);
        } else {
          window.location.href = `/admin/room-detail?room=${id}`;
        }

        let parent = link.closest(".collapse-transition");
        while (parent && parent.id !== "sidebarNav") {
          parent.classList.add("open");
          const toggle = document.querySelector(
            `[data-collapse="#${parent.id}"] .fa-chevron-down`
          );
          toggle?.classList.add("rotate-180");
          if (parent.id === "menu-rooms") break;
          parent = parent.parentElement.closest(".collapse-transition");
        }
      });
    });
}

// ----------------- INITIAL -----------------
document.addEventListener("DOMContentLoaded", () => {
  if (mainContent) {
    try {
      renderRoomTable();
    } catch (err) {
      // If rendering table fails on a page without expected DOM, ignore so sidebar can still build
      console.warn("renderRoomTable skipped:", err);
    }
  }

  // Create sidebar only when target container exists (so other pages still show menu)
  if (document.getElementById("sidebarNav")) {
    try {
      createSidebar();
    } catch (err) {
      console.warn("createSidebar failed:", err);
    }
  }
});

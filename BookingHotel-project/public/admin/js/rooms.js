// roomsData (giả định đã được cung cấp ở file khác và có trường 'floor')
// Ví dụ: const roomsData = [{ ..., floor: "Tầng 3" }, ...];

// Khởi tạo data từ localStorage nếu có
let rooms = JSON.parse(localStorage.getItem("rooms") || "[]");
if (!rooms.length) {
    // roomsData phải là dữ liệu đã có trường 'floor' và 'category'
    rooms = roomsData;
    localStorage.setItem("rooms", JSON.stringify(rooms));
}

// Biến global để lưu trữ danh sách phòng sau khi lọc.
// Ban đầu, nó hiển thị tất cả phòng.
let filteredRooms = [...rooms];

// DOM
const roomTableBody = document.getElementById("roomTableBody");
const roomModal = document.getElementById("roomModal");
const addRoomBtn = document.getElementById("addRoomBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const roomForm = document.getElementById("roomForm");
const modalTitle = document.getElementById("modalTitle");

// Inputs
const roomIdInput = document.getElementById("roomId");
const roomNameInput = document.getElementById("roomName");
const roomTypeInput = document.getElementById("roomType");
const roomBedTypeInput = document.getElementById("roomBedType");
const roomPriceInput = document.getElementById("roomPrice");
const roomSizeInput = document.getElementById("roomSize");
const roomGuestsInput = document.getElementById("roomGuests");
const roomUrlInput = document.getElementById("roomUrl");
const roomDescInput = document.getElementById("roomDesc");
const roomFeaturesInput = document.getElementById("roomFeatures");
const roomStatusInput = document.getElementById("roomStatus");
const roomFloorInput = document.getElementById("roomFloor"); // ĐẢM BẢO INPUT NÀY CÓ TRONG HTML MODAL

// Render bảng
function renderRooms() {
    // SỬ DỤNG filteredRooms cho việc render
    const dataToRender = filteredRooms;

    roomTableBody.innerHTML = dataToRender.map((room, idx) => `
      <tr class="border-b hover:bg-gray-50 align-top">
        <td class="py-3 px-4">${idx + 1}</td>
        <td class="py-3 px-4">
          <img src="${room.url || ''}" alt="${room.name}" class="w-20 h-14 object-cover rounded-md border" onerror="this.src='https://via.placeholder.com/150x100?text=No+Image'"/>
        </td>
        <td class="py-3 px-4 font-semibold">${room.name}</td>
        <td class="py-3 px-4 text-sm text-gray-600">${(room.description||'').slice(0,80)}${(room.description||'').length>80?'...':''}</td>
        <td class="py-3 px-4 text-[#11234B] font-medium">${Number(room.price).toLocaleString()}₫</td>
        <td class="py-3 px-4">${room.size ? room.size + ' m²' : '-'}</td>
        <td class="py-3 px-4">${room.maxGuests || '-'}</td>
        <td class="py-3 px-4">${room.bedType || '-'}</td>
        <td class="py-3 px-4">${room.floor || '-'}</td> <td class="py-3 px-4 text-sm">${(room.features||[]).slice(0,3).join(', ')}${(room.features||[]).length>3?'...':''}</td>
        <td class="py-3 px-4 flex gap-2">
          <button class="editBtn px-2 py-1 text-yellow-500 hover:text-yellow-700" data-id="${room.id}" title="Sửa"><i class="fa-solid fa-pen"></i></button>
          <button class="deleteBtn px-2 py-1 text-red-600 hover:text-red-800" data-id="${room.id}" title="Xóa"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `).join('');

    // gán event
    document.querySelectorAll('.editBtn').forEach(btn => btn.onclick = () => openEditRoom(btn.dataset.id));
    document.querySelectorAll('.deleteBtn').forEach(btn => btn.onclick = () => deleteRoom(btn.dataset.id));
}

// Mở modal thêm (Đã thêm reset input floor)
function openAddRoom() {
    modalTitle.textContent = 'Thêm phòng mới';
    roomForm.reset();
    roomIdInput.value = '';

    // Reset các giá trị khác
    roomPriceInput.value = '';
    roomSizeInput.value = '';
    roomGuestsInput.value = '';
    roomUrlInput.value = '';
    roomDescInput.value = '';
    roomFeaturesInput.value = '';
    roomBedTypeInput.value = '';
    roomFloorInput.value = ''; // RESET TRƯỜNG FLOOR

    roomModal.classList.remove('hidden');
}

// Mở modal sửa (Đã thêm đọc trường floor)
function openEditRoom(id) {
    const room = rooms.find(r => String(r.id) === String(id));
    if (!room) return alert('Không tìm thấy phòng');
    modalTitle.textContent = 'Chỉnh sửa phòng';

    roomIdInput.value = room.id;
    roomNameInput.value = room.name || '';
    roomTypeInput.value = room.type || 'Phòng đơn';
    roomBedTypeInput.value = room.bedType || '';
    roomPriceInput.value = room.price || '';
    roomSizeInput.value = room.size || '';
    roomGuestsInput.value = room.maxGuests || '';
    roomUrlInput.value = room.url || '';
    roomDescInput.value = room.description || '';
    roomFeaturesInput.value = (room.features || []).join(', ');
    roomStatusInput.value = room.status || 'Trống';
    roomFloorInput.value = room.floor || ''; // ĐỌC TRƯỜNG FLOOR

    roomModal.classList.remove('hidden');
}

// Đóng modal
function closeRoomModal() {
    roomModal.classList.add('hidden');
}

// Lưu phòng (thêm / sửa) (Đã thêm lưu trường floor)
function saveRoom(e) {
    e.preventDefault();

    const id = roomIdInput.value || Date.now().toString();
    const name = roomNameInput.value.trim();
    if (!name) return alert('Tên phòng bắt buộc');

    const newRoom = {
        id,
        name,
        type: roomTypeInput.value,
        bedType: roomBedTypeInput.value.trim() || '',
        price: Number(roomPriceInput.value) || 0,
        size: roomSizeInput.value ? Number(roomSizeInput.value) : null,
        maxGuests: roomGuestsInput.value ? Number(roomGuestsInput.value) : null,
        url: roomUrlInput.value.trim() || '',
        description: roomDescInput.value.trim() || '',
        features: roomFeaturesInput.value
            ? roomFeaturesInput.value.split(',').map(f => f.trim()).filter(Boolean)
            : [],
        status: roomStatusInput.value || 'Trống',
        floor: roomFloorInput.value || 'Chưa xác định' // LƯU TRƯỜNG FLOOR MỚI
    };

    const idx = rooms.findIndex(r => String(r.id) === String(id));
    if (idx > -1) {
        rooms[idx] = newRoom;
    } else {
        rooms.push(newRoom);
    }

    localStorage.setItem('rooms', JSON.stringify(rooms));

    // Cập nhật filteredRooms và render lại
    filteredRooms = [...rooms];
    renderRooms();
    closeRoomModal();
}

// Xóa phòng (Đã cập nhật filteredRooms sau khi xóa)
function deleteRoom(id) {
    if (!confirm('Bạn có chắc muốn xóa phòng này?')) return;
    rooms = rooms.filter(r => String(r.id) !== String(id));
    localStorage.setItem('rooms', JSON.stringify(rooms));

    // Cập nhật filteredRooms và render lại
    filteredRooms = [...rooms];
    renderRooms();
}

/**
 * Lọc và hiển thị phòng theo tầng
 * @param {string} floorName - Tên tầng (ví dụ: 'Tầng 1') hoặc 'all'
 */
function filterByFloor(floorName) {
    // Đảm bảo lấy dữ liệu gốc mới nhất từ localStorage trước khi lọc
    const allData = JSON.parse(localStorage.getItem("rooms") || "[]");

    if (floorName === 'all') {
        filteredRooms = allData;
    } else {
        // Lọc theo thuộc tính 'floor'
        filteredRooms = allData.filter(room => room.floor === floorName);
    }

    // Gán tiêu đề cho bảng (Tùy chọn)
    const tableTitle = document.getElementById('roomListTitle'); // Đảm bảo bạn có element này trong HTML
    if (tableTitle) {
        tableTitle.textContent = floorName === 'all' ? 'Danh sách tất cả phòng' : `Danh sách phòng - ${floorName}`;
    }

    renderRooms();
}

// Events
addRoomBtn.addEventListener('click', openAddRoom);
closeModalBtn.addEventListener('click', closeRoomModal);
cancelBtn.addEventListener('click', closeRoomModal);
roomForm.addEventListener('submit', saveRoom);

// Render ban đầu: Đảm bảo lần đầu tiên hiển thị toàn bộ dữ liệu
renderRooms();

    // Khởi tạo data từ localStorage nếu có
    let rooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    if (!rooms.length) {
    rooms = roomsData;
    localStorage.setItem("rooms", JSON.stringify(rooms));
}

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

    // Render bảng
    function renderRooms() {
    roomTableBody.innerHTML = rooms.map((room, idx) => `
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
        <td class="py-3 px-4 text-sm">${(room.features||[]).slice(0,3).join(', ')}${(room.features||[]).length>3?'...':''}</td>
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

    // Mở modal thêm
    function openAddRoom() {
    modalTitle.textContent = 'Thêm phòng mới';
    roomForm.reset();
    roomIdInput.value = '';
    // set một số giá trị mặc định
    roomPriceInput.value = '';
    roomSizeInput.value = '';
    roomGuestsInput.value = '';
    roomUrlInput.value = '';
    roomDescInput.value = '';
    roomFeaturesInput.value = '';
    roomBedTypeInput.value = '';
    roomModal.classList.remove('hidden');
}

    // Mở modal sửa
    function openEditRoom(id) {
    const room = rooms.find(r => String(r.id) === String(id));
    if (!room) return alert('Không tìm thấy phòng');
    modalTitle.textContent = 'Chỉnh sửa phòng';
    roomIdInput.value = room.id;
    roomNameInput.value = room.name || '';
    roomTypeInput.value = room.type || room.type || 'Phòng đơn';
    roomBedTypeInput.value = room.bedType || '';
    roomPriceInput.value = room.price || '';
    roomSizeInput.value = room.size || '';
    roomGuestsInput.value = room.maxGuests || '';
    roomUrlInput.value = room.url || '';
    roomDescInput.value = room.description || '';
    roomFeaturesInput.value = (room.features || []).join(', ');
    roomStatusInput.value = room.status || 'Trống';
    roomModal.classList.remove('hidden');
}

    // Đóng modal
    function closeRoomModal() {
    roomModal.classList.add('hidden');
}

    // Lưu phòng (thêm / sửa)
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
    status: roomStatusInput.value || 'Trống'
};

    const idx = rooms.findIndex(r => String(r.id) === String(id));
    if (idx > -1) {
    rooms[idx] = newRoom;
} else {
    rooms.push(newRoom);
}

    localStorage.setItem('rooms', JSON.stringify(rooms));
    renderRooms();
    closeRoomModal();
}

    // Xóa phòng
    function deleteRoom(id) {
    if (!confirm('Bạn có chắc muốn xóa phòng này?')) return;
    rooms = rooms.filter(r => String(r.id) !== String(id));
    localStorage.setItem('rooms', JSON.stringify(rooms));
    renderRooms();
}

    // Events
    addRoomBtn.addEventListener('click', openAddRoom);
    closeModalBtn.addEventListener('click', closeRoomModal);
    cancelBtn.addEventListener('click', closeRoomModal);
    roomForm.addEventListener('submit', saveRoom);

    // Render ban đầu
    renderRooms();
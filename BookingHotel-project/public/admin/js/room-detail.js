export function openRoomDetail(id) {
  const room = roomsData.find((r) => r.id == id);
  if (!room) return;

  // Hàm helper để tạo badge trạng thái (giả định đã tồn tại)
  function getStatusBadge(status) {
    switch (status) {
      case "Đã đặt":
        return '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Đã đặt</span>';
      case "Bảo trì":
        return '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Bảo trì</span>';
      case "Trống":
      default:
        return '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Trống</span>';
    }
  }

  mainContent.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-extrabold text-gray-800">${room.name}</h1>
        <button onclick="renderRoomTable()" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-150 flex items-center gap-2">
          <i class="fa-solid fa-arrow-left"></i> Quay lại
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 lg:p-8">
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-1">
            <img 
              src="${room.url}" 
              alt="${room.name}" 
              class="w-full h-auto object-cover rounded-xl shadow-md transition duration-300 hover:shadow-xl"
            />
          </div>

          <div class="lg:col-span-2 space-y-6">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-gray-700">
              
              <div class="flex items-center space-x-3">
                <i class="fa-solid fa-tag text-blue-500 w-5"></i>
                <p><strong>Loại phòng:</strong> <span class="font-medium">${
                  room.category
                }</span></p>
              </div>
              
              <div class="flex items-center space-x-3">
                <i class="fa-solid fa-bed text-blue-500 w-5"></i>
                <p><strong>Giường:</strong> <span class="font-medium">${
                  room.bedType
                }</span></p>
              </div>

              <div class="flex items-center space-x-3">
                <i class="fa-solid fa-maximize text-blue-500 w-5"></i>
                <p><strong>Diện tích:</strong> <span class="font-medium">${
                  room.size
                } m²</span></p>
              </div>
              
              <div class="flex items-center space-x-3">
                <i class="fa-solid fa-users text-blue-500 w-5"></i>
                <p><strong>Sức chứa:</strong> <span class="font-medium">${
                  room.maxGuests
                } khách</span></p>
              </div>
              
              <div class="flex items-center space-x-3">
                <i class="fa-solid fa-sack-dollar text-green-600 w-5"></i>
                <p><strong>Giá:</strong> <span class="text-xl font-bold text-green-600">${room.price.toLocaleString(
                  "vi-VN"
                )} VNĐ</span>/đêm</p>
              </div>
              
              <div class="flex items-center space-x-3">
                <i class="fa-solid fa-layer-group text-blue-500 w-5"></i>
                <p><strong>Tầng:</strong> <span class="font-medium">${
                  room.floor
                }</span></p>
              </div>

            </div>

            <hr class="border-gray-200">

            <div class="flex items-center justify-between">
              <div>
                <strong class="text-gray-700 block mb-1">Trạng thái:</strong>
                ${getStatusBadge(room.status || "Trống")}
              </div>
              <div>
                <strong class="text-gray-700 block mb-1">Hành động:</strong>
                <button class="editBtn px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition" data-id="${
                  room.id
                }">
                    <i class="fa-solid fa-pen-to-square mr-1"></i> Sửa
                </button>
              </div>
            </div>

            <hr class="border-gray-200">
            
            <div>
              <h3 class="text-lg font-bold text-gray-800 mb-2">Mô tả</h3>
              <p class="text-gray-600 leading-relaxed">${room.description}</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-gray-800 mb-2">Tiện nghi</h3>
              <div class="flex flex-wrap gap-2">
                ${room.features
                  .map(
                    (feature) =>
                      `<span class="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200"><i class="fa-solid fa-check mr-1 text-xs"></i>${feature}</span>`
                  )
                  .join("")}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  `;

  // Cần thêm listeners cho nút Sửa nếu bạn muốn nó hoạt động
  mainContent.querySelector(".editBtn")?.addEventListener("click", () => {
    openRoomForm(id); // Giả sử openRoomForm có thể nhận id để chỉnh sửa
  });
}

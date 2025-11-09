// Room detail page logic

function renderRoomDetail() {
  const roomId = getUrlParameter("id");
  if (!roomId) {
    const content = document.getElementById("roomDetailContent");
    if (content) {
      content.innerHTML = `
      <div class="text-center py-12">
        <p class="text-lg text-muted-foreground mb-4">Không tìm thấy phòng</p>
        <a href="/public" class="text-primary hover:underline">Quay lại trang chủ</a>
      </div>
    `;
    }
    return;
  }

  const room = getRoomById(roomId);
  if (!room) {
    const content = document.getElementById("roomDetailContent");
    if (content) {
      content.innerHTML = `
      <div class="text-center py-12">
        <p class="text-lg text-muted-foreground mb-4">Phòng không tồn tại</p>
        <a href="/public" class="text-primary hover:underline">Quay lại trang chủ</a>
      </div>
    `;
    }
    return;
  }

  const content = document.getElementById("roomDetailContent");
  if (!content) return;

  content.innerHTML = `
    <div class="mb-6">
      <a href="/public#rooms" class="text-sm text-muted-foreground hover:text-foreground">
        ← Quay lại danh sách phòng
      </a>
    </div>

    <div class="grid md:grid-cols-2 gap-8">
      <div>
        <div class="rounded-lg overflow-hidden shadow-lg">
          <img src="${room.url}" alt="${room.name}" class="room-image" />
        </div>
        <div class="mt-6 p-6 rounded-lg border bg-muted/30">
          <h3 class="font-semibold mb-4">Thông tin phòng</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Diện tích:</span>
              <span class="font-medium">${room.size} m²</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Loại giường:</span>
              <span class="font-medium">${room.bedType}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Sức chứa:</span>
              <span class="font-medium">Tối đa ${room.maxGuests} người</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Giá mỗi đêm:</span>
              <span class="text-accent font-semibold text-lg">${formatPrice(
      room.price
  )}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h1 class="text-3xl font-bold mb-4">${room.name}</h1>
        
        <div class="mb-6">
          <h3 class="font-semibold mb-3">Mô tả</h3>
          <p class="text-muted-foreground leading-relaxed">${
      room.description
  }</p>
        </div>

        <div class="mb-6">
          <h3 class="font-semibold mb-3">Tiện ích phòng</h3>
          <div class="grid grid-cols-1 gap-3">
            ${room.features
      .map(
          (f) => `
              <div class="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <svg class="w-5 h-5 text-accent flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-sm">${f}</span>
              </div>
            `
      )
      .join("")}
          </div>
        </div>

        <div class="flex gap-3">
          <a
            href="/booking?roomId=${room.id}"
            class="flex-1 text-center rounded-md bg-[#11234B] text-white px-6 py-3 font-semibold hover:opacity-90 transition-opacity"
          >
            Đặt phòng ngay
          </a>
          <a
            href="/public#rooms"
            class="rounded-md border border-input px-6 py-3 font-medium hover:bg-card/50 transition-colors"
          >
            Xem phòng khác
          </a>
        </div>
      </div>
    </div>
  `;
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  renderRoomDetail();
});

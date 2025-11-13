

    // Sidebar toggle
    const sidebar = document.getElementById("sidebar");
    const openBtn = document.getElementById("openSidebar");
    const closeBtn = document.getElementById("closeSidebar");
    openBtn?.addEventListener("click", () =>
    sidebar.classList.remove("-translate-x-full")
    );
    closeBtn?.addEventListener("click", () =>
    sidebar.classList.add("-translate-x-full")
    );

    // Services CRUD
    let services = JSON.parse(localStorage.getItem("services") || "[]");
    const servicesTableBody = document.getElementById("servicesTableBody");
    const serviceModal = document.getElementById("serviceModal");
    const addServiceBtn = document.getElementById("addServiceBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const serviceForm = document.getElementById("serviceForm");
    const modalTitle = document.getElementById("modalTitle");
    const serviceIdInput = document.getElementById("serviceId");
    const serviceNameInput = document.getElementById("serviceName");
    const serviceIconInput = document.getElementById("serviceIcon");
    const serviceDescInput = document.getElementById("serviceDesc");
    const iconPreview = document.getElementById("iconPreview");

    function updateIconPreview() {
    const icon = serviceIconInput.value.trim();
    if (icon) {
    iconPreview.innerHTML = `<i class="fa-solid ${icon}"></i>`;
} else {
    iconPreview.innerHTML = '<i class="fa-solid fa-question"></i>';
}
}

    function renderServices() {
    servicesTableBody.innerHTML = services
        .map(
            (service, idx) => `
          <tr class="border-b">
            <td class="py-2 px-4">${idx + 1}</td>
            <td class="py-2 px-4">${service.name}</td>
            <td class="py-2 px-4"><i class="fa-solid ${
                service.icon
            } text-xl text-[#0f766e]"></i></td>
            <td class="py-2 px-4 text-sm text-gray-600">${
                service.description || "—"
            }</td>
            <td class="py-2 px-4 flex gap-2">
              <button class="editBtn px-3 py-1  text-yellow-500 hover:text-yellow-7
              00 rounded" data-id="${
                service.id
            }"><i class="fa-solid fa-pen"></i></button>
              <button class="deleteBtn px-3 py-1  text-red-600 rounded hover:text-red-800" data-id="${
                service.id
            }"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
        `
        )
        .join("");

    document
    .querySelectorAll(".editBtn")
    .forEach(
    (btn) => (btn.onclick = () => openEditService(btn.dataset.id))
    );
    document
    .querySelectorAll(".deleteBtn")
    .forEach(
    (btn) => (btn.onclick = () => deleteService(btn.dataset.id))
    );
}

    function openAddService() {
    modalTitle.textContent = "Thêm tiện ích";
    serviceIdInput.value = "";
    serviceNameInput.value = "";
    serviceIconInput.value = "";
    serviceDescInput.value = "";
    updateIconPreview();
    serviceModal.classList.remove("hidden");
}

    function openEditService(id) {
    const service = services.find((s) => s.id == id);
    if (!service) return;
    modalTitle.textContent = "Sửa tiện ích";
    serviceIdInput.value = service.id;
    serviceNameInput.value = service.name;
    serviceIconInput.value = service.icon;
    serviceDescInput.value = service.description || "";
    updateIconPreview();
    serviceModal.classList.remove("hidden");
}

    function closeServiceModal() {
    serviceModal.classList.add("hidden");
}

    function saveService(e) {
    e.preventDefault();
    const id = serviceIdInput.value || Date.now().toString();
    const service = {
    id,
    name: serviceNameInput.value,
    icon: serviceIconInput.value.trim(),
    description: serviceDescInput.value,
};
    const idx = services.findIndex((s) => s.id == id);
    if (idx > -1) services[idx] = service;
    else services.push(service);
    localStorage.setItem("services", JSON.stringify(services));
    renderServices();
    closeServiceModal();
}

    function deleteService(id) {
    if (confirm("Bạn có chắc muốn xóa tiện ích này?")) {
    services = services.filter((s) => s.id != id);
    localStorage.setItem("services", JSON.stringify(services));
    renderServices();
}
}

    // Event handlers
    addServiceBtn.onclick = openAddService;
    closeModalBtn.onclick = closeServiceModal;
    cancelBtn.onclick = closeServiceModal;
    serviceForm.onsubmit = saveService;
    serviceIconInput.addEventListener("input", updateIconPreview);

    // Initialize with sample data if empty
    if (!services.length) {
    services = [
        {
            id: "1",
            name: "WiFi",
            icon: "fa-wifi",
            description: "Kết nối Internet không dây tốc độ cao",
        },
        {
            id: "2",
            name: "Điều hòa",
            icon: "fa-wind",
            description: "Hệ thống điều hòa không khí 24/24",
        },
        {
            id: "3",
            name: "TV",
            icon: "fa-tv",
            description: "Tivi màn hình phẳng HD",
        },
        {
            id: "4",
            name: "Minibar",
            icon: "fa-wine-glass",
            description: "Tủ lạnh mini với đồ uống",
        },
        {
            id: "5",
            name: "Phòng tắm riêng",
            icon: "fa-shower",
            description: "Phòng tắm hiện đại với vòi sen",
        },
        {
            id: "6",
            name: "Tủ quần áo",
            icon: "fa-closet",
            description: "Tủ lưu trữ rộng rãi",
        },
    ];
    localStorage.setItem("services", JSON.stringify(services));
}

    renderServices();
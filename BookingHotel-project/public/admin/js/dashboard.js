//sidebar
const sidebar = document.getElementById("sidebar");
const openBtn = document.getElementById("openSidebar");
const closeBtn = document.getElementById("closeSidebar");

openBtn?.addEventListener("click", () => {
    sidebar.classList.remove("-translate-x-full");
});

closeBtn?.addEventListener("click", () => {
    sidebar.classList.add("-translate-x-full");
});
    // Dữ liệu biểu đồ cột (Doanh thu)
    const barCtx = document.getElementById('barChart');
    new Chart(barCtx, {
    type: 'bar',
    data: {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [{
    label: 'Doanh thu (triệu VNĐ)',
    data: [30, 45, 28, 60, 70, 55, 80, 90, 75, 65, 100, 95],
    backgroundColor: '#3b82f6',
    borderRadius: 6
}]
},
    options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
    y: { beginAtZero: true, ticks: { stepSize: 20 } }
}
}
});

    // Dữ liệu biểu đồ tròn (Loại phòng)
    const pieCtx = document.getElementById('pieChart');
    new Chart(pieCtx, {
    type: 'doughnut',
    data: {
    labels: ['Phòng đơn', 'Phòng đôi', 'Phòng VIP', 'Suite'],
    datasets: [{
    data: [40, 30, 20, 10],
    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
}]
},
    options: {
    responsive: true,
    plugins: {
    legend: {
    position: 'bottom',
    labels: { usePointStyle: true }
}
},
    cutout: '70%'
}
});
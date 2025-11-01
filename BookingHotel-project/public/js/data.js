// Shared data for the application

const roomsData = [
    {
        id: 1,
        name: "Phòng Deluxe",
        url: "/images/PhongSuperio/611068499.jpg",
        description:
            "Phòng sang trọng với giường King-size êm ái, tiện nghi hiện đại và tầm nhìn tuyệt đẹp ra thành phố. Hoàn hảo cho các cặp đôi tìm kiếm sự thoải mái và phong cách.",
        price: 299,
        size: 35,
        maxGuests: 2,
        bedType: "King",
        features: [
            "Giường King Size",
            "View Thành Phố",
            "WiFi Miễn Phí",
            "Mini Bar",
            "Smart TV",
            "Điều Hòa",
        ],
    },
    {
        id: 2,
        url: "/images/PhongDeluxe/611068661.jpg",
        name: "Suite Cao Cấp",
        description:
            "Suite rộng rãi với phòng khách riêng biệt, nội thất cao cấp và tầm nhìn ngoạn mục ra đại dương từ ban công riêng của bạn.",
        price: 499,
        size: 55,
        maxGuests: 3,
        bedType: "King",
        features: [
            "View Biển",
            "Phòng Khách Riêng",
            "Ban Công Riêng",
            "Bồn Tắm Jacuzzi",
            "Minibar Cao Cấp",
            "Bàn Làm Việc",
        ],
    },
    {
        id: 3,
        url: "/images/PhongSuperio/611068511.jpg",
        name: "Suite Penthouse",
        description:
            "Đỉnh cao của sự xa hoa với tầm nhìn toàn cảnh đại dương, sân thượng riêng, dịch vụ quản gia và tiện nghi độc quyền cho trải nghiệm khó quên.",
        price: 899,
        size: 85,
        maxGuests: 4,
        bedType: "King",
        features: [
            "View Toàn Cảnh",
            "Sân Thượng Riêng",
            "Dịch Vụ Quản Gia",
            "Bar Cao Cấp",
            "Phòng Ăn",
            "Phòng Tắm Master",
        ],
    },
    {
        id: 4,
        url: "/images/PhongDeluxe/611068706.jpg",
        name: "Biệt Thự Biển",
        description:
            "Biệt thự ven biển độc quyền với lối đi riêng ra bãi biển, hồ bơi riêng, bếp đầy đủ và dịch vụ concierge cá nhân.",
        price: 1299,
        size: 120,
        maxGuests: 6,
        bedType: "2 King",
        features: [
            "Hồ Bơi Riêng",
            "Lối Ra Biển",
            "Bếp Đầy Đủ",
            "Nhiều Phòng Ngủ",
            "Ăn Ngoài Trời",
            "Concierge",
        ],
    },
];

const amenitiesData = [
    {
        name: "Hồ Bơi Vô Cực",
        description: "Tận hưởng tầm nhìn toàn cảnh đại dương",
    },
    { name: "Trung Tâm Thể Dục", description: "Thiết bị hiện đại, phục vụ 24/7" },
    {
        name: "Spa & Chăm Sóc Sức Khỏe",
        description: "Liệu trình spa cao cấp đa dạng",
    },
    {
        name: "Ẩm Thực Đẳng Cấp",
        description: "Nhà hàng đạt sao Michelin danh giá",
    },
    { name: "WiFi Tốc Độ Cao", description: "Kết nối internet không giới hạn" },
    {
        name: "Lễ Tân 24/7",
        description: "Đội ngũ chuyên nghiệp luôn sẵn sàng hỗ trợ",
    },
    { name: "Đỗ Xe VIP", description: "Dịch vụ đỗ xe có người phục vụ miễn phí" },
    { name: "Dịch Vụ Phòng", description: "Phục vụ tận phòng 24 giờ mỗi ngày" },
    { name: "Bãi Biển Riêng", description: "Đường dạo biển và khu vực riêng tư" },
    {
        name: "Trung Tâm Hội Nghị",
        description: "Phòng họp sang trọng với trang thiết bị hiện đại",
    },
    {
        name: "Khu Vui Chơi Trẻ Em",
        description: "Hoạt động giải trí phong phú cho trẻ",
    },
    {
        name: "Quầy Bar & Sảnh Chờ",
        description: "Thưởng thức cocktail đẳng cấp thế giới",
    },
];

const offersData = [
    {
        title: "Ưu Đãi Đặt Sớm",
        discount: "Giảm 25%",
        description:
            "Đặt trước 30 ngày và tận hưởng ưu đãi độc quyền cho kỳ nghỉ sang trọng của bạn.",
        features: [
            "Giảm 25% giá phòng",
            "Bữa sáng miễn phí cho hai người",
            "Trả phòng muộn đến 14:00",
            "Miễn phí sử dụng spa",
        ],
    },
    {
        title: "Kỳ Nghỉ Lãng Mạn",
        discount: "Gói Đặc Biệt",
        description:
            "Hoàn hảo cho các cặp đôi tìm kiếm kỳ nghỉ lãng mạn với tiện nghi và dịch vụ cao cấp.",
        features: [
            "Champagne chào đón",
            "Trị liệu spa cho cặp đôi",
            "Bữa tối dưới ánh nến",
            "Dịch vụ trang trí phòng với cánh hoa hồng",
        ],
    },
];

const testimonialsData = [
    {
        name: "Nguyễn Thị Hương",
        location: "Hà Nội, Việt Nam",
        review:
            "Tuyệt vời! Tầm nhìn ra biển từ phòng suite thật ngoạn mục. Nhân viên rất tận tình chu đáo để kỷ niệm ngày cưới của chúng tôi thật đặc biệt. Chắc chắn sẽ quay lại!",
    },
    {
        name: "Trần Minh Quân",
        location: "TP.HCM, Việt Nam",
        review:
            "Trải nghiệm khách sạn tuyệt vời nhất! Dịch vụ spa thật tuyệt, đồ ăn xuất sắc, và sự chú ý đến từng chi tiết thật hoàn hảo. Rất đáng để trải nghiệm!",
    },
    {
        name: "Lê Thanh Thảo",
        location: "Đà Nẵng, Việt Nam",
        review:
            "Một thiên đường thực sự! Ngay từ khi đến, chúng tôi đã được đón tiếp như những vị khách VIP. Phòng penthouse vượt xa mong đợi. Hoàn hảo cho tuần trăng mật!",
    },
];

const priceMap = { deluxe: 299, suite: 499, penthouse: 899, villa: 1299 };

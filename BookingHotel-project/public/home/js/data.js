// Shared data for the hotel

const roomsData = [
  // --- Deluxe Rooms ---
  {
    id: 1,
    name: "Phòng Deluxe 101",
    url: "/home/images/PhongDeluxe/611068699.jpg",
    description:
      "Phòng Deluxe ấm cúng với giường King-size, nội thất hiện đại và view hướng thành phố. Lý tưởng cho cặp đôi hoặc khách công tác.",
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
    category: "Deluxe",
    floor: "Tầng 1",
  },
  {
    id: 2,
    name: "Phòng Deluxe 102",
    url: "/home/images/PhongDeluxe/611068706.jpg",
    description:
      "Phòng Deluxe hiện đại với ánh sáng tự nhiên, giường đôi và khu vực làm việc riêng. Phù hợp cho kỳ nghỉ ngắn ngày.",
    price: 299,
    size: 36,
    maxGuests: 2,
    bedType: "Queen",
    features: [
      "Giường Queen Size",
      "View Thành Phố",
      "WiFi Miễn Phí",
      "Bàn Làm Việc",
      "Mini Bar",
      "Smart TV",
    ],
    category: "Deluxe",
    floor: "Tầng 1",
  },

  // --- Suite Rooms ---
  {
    id: 3,
    name: "Phòng Superio 201",
    url: "/home/images/PhongSuperio/611068499.jpg",
    description:
      "Phòng Suite cao cấp với phòng khách riêng, ban công view biển và nội thất sang trọng. Lý tưởng cho kỳ nghỉ thư giãn hoặc tuần trăng mật.",
    price: 499,
    size: 55,
    maxGuests: 3,
    bedType: "King",
    features: [
      "View Biển",
      "Phòng Khách Riêng",
      "Ban Công Riêng",
      "Bồn Tắm Jacuzzi",
      "Mini Bar Cao Cấp",
      "Bàn Làm Việc",
    ],
    category: "Superio",
    floor: "Tầng 2",
  },
  {
    id: 4,
    name: "Phòng Superio 202",
    url: "/home/images/PhongSuperio/611068510.jpg",
    description:
      "Phòng Suite hướng biển, nội thất hiện đại, không gian mở cùng dịch vụ riêng biệt mang đến trải nghiệm nghỉ dưỡng đẳng cấp.",
    price: 499,
    size: 58,
    maxGuests: 3,
    bedType: "King",
    features: [
      "View Biển",
      "Ban Công Riêng",
      "Phòng Khách Rộng",
      "Bồn Tắm Lớn",
      "Smart TV 65 inch",
      "Điều Hòa Hai Chiều",
    ],
    category: "Superio",
    floor: "Tầng 2",
  },
];

const allRoomsData = [...roomsData];

const amenitiesData = [
  {
    name: "Hồ Bơi Ngoài Trời",
    description: "Tận hưởng làn nước mát và tầm nhìn hướng biển",
  },
  { name: "Phòng Gym", description: "Trang bị hiện đại, mở cửa 24/7" },
  { name: "Nhà Hàng", description: "Thưởng thức ẩm thực Á – Âu tinh tế" },
  {
    name: "Spa & Massage",
    description: "Dịch vụ chăm sóc thư giãn chuyên nghiệp",
  },
  {
    name: "WiFi Miễn Phí",
    description: "Kết nối tốc độ cao trong toàn khách sạn",
  },
  { name: "Lễ Tân 24/7", description: "Luôn sẵn sàng phục vụ quý khách" },
  { name: "Dịch Vụ Phòng", description: "Phục vụ tận phòng 24 giờ mỗi ngày" },
  {
    name: "Bãi Đỗ Xe Riêng",
    description: "An toàn, miễn phí cho khách lưu trú",
  },
];

const offersData = [
  {
    title: "Ưu Đãi Đặt Sớm",
    discount: "Giảm 20%",
    description:
      "Đặt phòng trước 30 ngày để nhận ưu đãi độc quyền cho kỳ nghỉ của bạn.",
    features: [
      "Giảm 20% giá phòng",
      "Bữa sáng miễn phí",
      "Trả phòng muộn đến 14:00",
    ],
  },
  {
    title: "Gói Nghỉ Dưỡng Cặp Đôi",
    discount: "Combo Lãng Mạn",
    description:
      "Tận hưởng không gian riêng tư cùng người thương với gói dịch vụ cao cấp.",
    features: [
      "Champagne chào đón",
      "Bữa tối dưới ánh nến",
      "Liệu trình spa cho cặp đôi",
    ],
  },
];

const testimonialsData = [
  {
    name: "Nguyễn Thị Hương",
    location: "Hà Nội",
    review:
      "Phòng Deluxe rất thoải mái và sạch sẽ, nhân viên thân thiện. Tôi rất thích hồ bơi và nhà hàng trong khách sạn!",
  },
  {
    name: "Trần Minh Quân",
    location: "TP.HCM",
    review:
      "Phòng Suite thật tuyệt vời, view biển đẹp và dịch vụ chuyên nghiệp. Đáng giá từng đồng!",
  },
  {
    name: "Lê Thanh Thảo",
    location: "Đà Nẵng",
    review:
      "Kỳ nghỉ hoàn hảo! Không gian yên tĩnh, tiện nghi hiện đại, nhân viên cực kỳ chu đáo.",
  },
];

const priceMap = { deluxe: 299, suite: 499 };

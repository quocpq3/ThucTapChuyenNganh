// Booking page logic

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication first
  if (!requireAuth("login.html?return=booking.html")) {
    // Redirect will happen in requireAuth
    return;
  }

  // Get all form elements
  const roomTypeEl = document.getElementById("b_roomType");
  const checkInEl = document.getElementById("b_checkIn");
  const checkOutEl = document.getElementById("b_checkOut");
  const nameEl = document.getElementById("b_name");
  const emailEl = document.getElementById("b_email");
  const phoneEl = document.getElementById("b_phone");

  // Initialize form with user data
  const user = getCurrentUser();
  if (user) {
    if (nameEl) nameEl.value = user.name || "";
    if (emailEl) emailEl.value = user.email || "";
    if (phoneEl) phoneEl.value = user.phone || "";
  }

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];
  if (checkInEl) checkInEl.setAttribute("min", today);
  if (checkOutEl) checkOutEl.setAttribute("min", today);

  // Handle room selection from URL
  const roomId = getUrlParameter("roomId");
  if (roomId && roomTypeEl) {
    const room = getRoomById(roomId);
    if (room) {
      const roomTypeMap = {
        1: "deluxe",
        2: "suite",
        3: "penthouse",
        4: "villa",
      };
      roomTypeEl.value = roomTypeMap[room.id] || "";
    }
  }

  // Recalculate function
  function recalc() {
    if (!checkInEl || !checkOutEl || !roomTypeEl) return;

    const nights = calculateNights(checkInEl.value, checkOutEl.value);
    const calcNightsEl = document.getElementById("calcNights");
    if (calcNightsEl) calcNightsEl.textContent = String(nights);

    const roomType = roomTypeEl.value;
    const price = roomType ? priceMap[roomType] || 0 : 0;
    const calcPriceEl = document.getElementById("calcPrice");
    if (calcPriceEl)
      calcPriceEl.textContent = price ? formatPrice(price) : "$0";

    const total = price * nights;
    const calcTotalEl = document.getElementById("calcTotal");
    if (calcTotalEl)
      calcTotalEl.textContent = total > 0 ? formatPrice(total) : "$0";
  }

  // Validate booking form
  function validateBookingForm() {
    let isValid = true;
    const errors = [
      "err_name",
      "err_email",
      "err_phone",
      "err_roomType",
      "err_checkIn",
      "err_checkOut",
    ];

    // Clear errors
    errors.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = "none";
        el.textContent = "";
      }
    });

    if (!nameEl || !nameEl.value.trim()) {
      const errEl = document.getElementById("err_name");
      if (errEl) {
        errEl.style.display = "block";
        errEl.textContent = "Vui lòng nhập họ và tên";
      }
      isValid = false;
    }

    if (!emailEl || !emailEl.value.trim()) {
      const errEl = document.getElementById("err_email");
      if (errEl) {
        errEl.style.display = "block";
        errEl.textContent = "Vui lòng nhập email";
      }
      isValid = false;
    } else if (emailEl && !/\S+@\S+\.\S+/.test(emailEl.value)) {
      const errEl = document.getElementById("err_email");
      if (errEl) {
        errEl.style.display = "block";
        errEl.textContent = "Vui lòng nhập email hợp lệ";
      }
      isValid = false;
    }

    if (!phoneEl || !phoneEl.value.trim()) {
      const errEl = document.getElementById("err_phone");
      if (errEl) {
        errEl.style.display = "block";
        errEl.textContent = "Vui lòng nhập số điện thoại";
      }
      isValid = false;
    }

    if (!roomTypeEl || !roomTypeEl.value) {
      const errEl = document.getElementById("err_roomType");
      if (errEl) {
        errEl.style.display = "block";
        errEl.textContent = "Vui lòng chọn loại phòng";
      }
      isValid = false;
    }

    if (!checkInEl || !checkInEl.value) {
      const errEl = document.getElementById("err_checkIn");
      if (errEl) {
        errEl.style.display = "block";
        errEl.textContent = "Vui lòng chọn ngày đến";
      }
      isValid = false;
    }

    if (!checkOutEl || !checkOutEl.value) {
      const errEl = document.getElementById("err_checkOut");
      if (errEl) {
        errEl.style.display = "block";
        errEl.textContent = "Vui lòng chọn ngày đi";
      }
      isValid = false;
    }

    if (checkInEl && checkOutEl && checkInEl.value && checkOutEl.value) {
      const ci = new Date(checkInEl.value);
      const co = new Date(checkOutEl.value);
      if (co <= ci) {
        const errEl = document.getElementById("err_checkOut");
        if (errEl) {
          errEl.style.display = "block";
          errEl.textContent = "Ngày đi phải sau ngày đến";
        }
        isValid = false;
      }
    }

    return isValid;
  }

  // Submit booking
  const confirmBtn = document.getElementById("confirmBooking");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      if (!validateBookingForm()) {
        toast("error", "Vui lòng điền đầy đủ thông tin theo yêu cầu");
        return;
      }

      const countryEl = document.getElementById("b_country");
      const adultsEl = document.getElementById("b_adults");
      const childrenEl = document.getElementById("b_children");
      const specialEl = document.getElementById("b_special");
      const calcTotalEl = document.getElementById("calcTotal");

      const bookingData = {
        name: nameEl ? nameEl.value : "",
        email: emailEl ? emailEl.value : "",
        phone: phoneEl ? phoneEl.value : "",
        country: countryEl ? countryEl.value : "",
        roomType: roomTypeEl ? roomTypeEl.value : "",
        checkIn: checkInEl ? checkInEl.value : "",
        checkOut: checkOutEl ? checkOutEl.value : "",
        adults: adultsEl ? adultsEl.value : "2",
        children: childrenEl ? childrenEl.value : "0",
        special: specialEl ? specialEl.value : "",
        total: calcTotalEl ? calcTotalEl.textContent : "$0",
        date: new Date().toISOString(),
      };

      // Save booking (in a real app, this would go to a server)
      const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
      bookings.push(bookingData);
      localStorage.setItem("bookings", JSON.stringify(bookings));

      toast(
        "success",
        `Xác nhận đặt phòng cho ${bookingData.name}!`,
        `Thông tin xác nhận đã được gửi đến ${bookingData.email}`
      );

      // Redirect to home page after 2 seconds
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    });
  }

  // Recalculate on change
  if (roomTypeEl) {
    roomTypeEl.addEventListener("change", recalc);
  }

  if (checkInEl) {
    checkInEl.addEventListener("change", () => {
      const checkIn = checkInEl.value;
      if (checkIn && checkOutEl) {
        const nextDay = new Date(checkIn);
        nextDay.setDate(nextDay.getDate() + 1);
        checkOutEl.setAttribute("min", nextDay.toISOString().split("T")[0]);
      }
      recalc();
    });
  }

  if (checkOutEl) {
    checkOutEl.addEventListener("change", recalc);
  }

  // Initial calculation
  recalc();
});

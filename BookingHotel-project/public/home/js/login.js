// Login page logic

document.addEventListener("DOMContentLoaded", () => {
  let authMode = "login";

  function showLoginTab() {
    authMode = "login";
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const showLoginTab = document.getElementById("showLoginTab");
    const showRegisterTab = document.getElementById("showRegisterTab");

    if (loginForm) loginForm.style.display = "block";
    if (registerForm) registerForm.style.display = "none";
    if (showLoginTab) showLoginTab.classList.add("active");
    if (showRegisterTab) showRegisterTab.classList.remove("active");
    clearAuthErrors();
  }

  function showRegisterTab() {
    authMode = "register";
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const showLoginTab = document.getElementById("showLoginTab");
    const showRegisterTab = document.getElementById("showRegisterTab");

    if (loginForm) loginForm.style.display = "none";
    if (registerForm) registerForm.style.display = "block";
    if (showRegisterTab) showRegisterTab.classList.add("active");
    if (showLoginTab) showLoginTab.classList.remove("active");
    clearAuthErrors();
  }

  function clearAuthErrors() {
    [
      "err_loginEmail",
      "err_loginPassword",
      "err_registerName",
      "err_registerEmail",
      "err_registerPhone",
      "err_registerPassword",
      "err_registerConfirmPassword",
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = "none";
        el.textContent = "";
      }
    });
  }

  // Login validation and submit
  function validateLogin() {
    let isValid = true;
    const emailEl = document.getElementById("loginEmail");
    const passwordEl = document.getElementById("loginPassword");

    if (!emailEl || !passwordEl) return false;

    const email = emailEl.value.trim();
    const password = passwordEl.value;

    clearAuthErrors();

    if (!email) {
      const errEl = document.getElementById("err_loginEmail");
      if (errEl) {
        errEl.style.display = "block";
        errEl.textContent = "Vui lòng nhập email";
      }
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      const errEl = document.getElementById("err_loginEmail");
      if (errEl) {
        errEl.style.display = "block";
        errEl.textContent = "Email không hợp lệ";
      }
      isValid = false;
    }

    if (!password) {
      const errEl = document.getElementById("err_loginPassword");
      if (errEl) {
        errEl.style.display = "block";
        errEl.textContent = "Vui lòng nhập mật khẩu";
      }
      isValid = false;
    }

    return isValid;
  }

  function handleLogin() {
    if (!validateLogin()) return;

    const emailEl = document.getElementById("loginEmail");
    const passwordEl = document.getElementById("loginPassword");
    if (!emailEl || !passwordEl) return;

    const email = emailEl.value.trim();
    const password = passwordEl.value;

    // send to server
    fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.success) {
          // lưu token (không lưu toàn bộ user vào localStorage)
          if (data.token) {
            setAuthToken(data.token);
            // store minimal user info for header display (session only)
            if (data.user && typeof setAuthUser === "function") {
              setAuthUser(data.user);
            }
            // Update header UI immediately
            if (typeof updateUserInfo === "function") updateUserInfo();
            // If server returned user object, apply it to header right away
            if (data.user && typeof applyUserToHeader === "function") {
              applyUserToHeader(data.user);
            }
          }
          toast(
            "success",
            "Đăng nhập thành công!",
            `Chào mừng, ${data.user.name || data.user.email}`
          );
          setTimeout(() => {
            const returnUrl = getUrlParameter("return");
            if (returnUrl === "booking") {
              window.location.href = "/booking";
            } else {
              window.location.href = "/";
            }
          }, 800);
        } else {
          toast(
            "error",
            "Đăng nhập thất bại",
            data.message || "Email hoặc mật khẩu không chính xác"
          );
        }
      })
      .catch((err) => {
        console.error(err);
        toast("error", "Lỗi server", "Không thể kết nối tới server");
      });
  }

  // Register validation and submit
  function validateRegister() {
    let isValid = true;
    const nameEl = document.getElementById("registerName");
    const emailEl = document.getElementById("registerEmail");
    const phoneEl = document.getElementById("registerPhone");
    const passwordEl = document.getElementById("registerPassword");
    const confirmPasswordEl = document.getElementById(
      "registerConfirmPassword"
    );

    if (!nameEl || !emailEl || !phoneEl || !passwordEl || !confirmPasswordEl) {
      return false;
    }

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const phone = phoneEl.value.trim();
    const password = passwordEl.value;
    const confirmPassword = confirmPasswordEl.value;

    clearAuthErrors();

    if (!name) {
      const errEl = document.getElementById("err_registerName");
      if (errEl) {
        errEl.style.display = "block";
        errEl.textContent = "Vui lòng nhập họ và tên";
      }
      isValid = false;
    }

    if (!email) {
      const errEl = document.getElementById("err_registerEmail");
      if (errEl) {
        errEl.style.display = "block";
        errEl.textContent = "Vui lòng nhập email";
      }
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      const errEl = document.getElementById("err_registerEmail");
      if (errEl) {
        errEl.style.display = "block";
        errEl.textContent = "Email không hợp lệ";
      }
      isValid = false;
    }

    if (!phone) {
      const errEl = document.getElementById("err_registerPhone");
      if (errEl) {
        errEl.style.display = "block";
        errEl.textContent = "Vui lòng nhập số điện thoại";
      }
      isValid = false;
    }

    if (!password) {
      const errEl = document.getElementById("err_registerPassword");
      if (errEl) {
        errEl.style.display = "block";
        errEl.textContent = "Vui lòng nhập mật khẩu";
      }
      isValid = false;
    } else if (password.length < 6) {
      const errEl = document.getElementById("err_registerPassword");
      if (errEl) {
        errEl.style.display = "block";
        errEl.textContent = "Mật khẩu phải có ít nhất 6 ký tự";
      }
      isValid = false;
    }

    if (!confirmPassword) {
      const errEl = document.getElementById("err_registerConfirmPassword");
      if (errEl) {
        errEl.style.display = "block";
        errEl.textContent = "Vui lòng xác nhận mật khẩu";
      }
      isValid = false;
    } else if (password !== confirmPassword) {
      const errEl = document.getElementById("err_registerConfirmPassword");
      if (errEl) {
        errEl.style.display = "block";
        errEl.textContent = "Mật khẩu xác nhận không khớp";
      }
      isValid = false;
    }

    return isValid;
  }

  function handleRegister() {
    if (!validateRegister()) return;

    const nameEl = document.getElementById("registerName");
    const emailEl = document.getElementById("registerEmail");
    const phoneEl = document.getElementById("registerPhone");
    const passwordEl = document.getElementById("registerPassword");
    if (!nameEl || !emailEl || !phoneEl || !passwordEl) return;

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const phone = phoneEl.value.trim();
    const password = passwordEl.value;

    fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.success) {
          toast(
            "success",
            "Đăng ký thành công!",
            "Bạn có thể đăng nhập ngay bây giờ"
          );
          showLoginTab();
          const loginEmailEl = document.getElementById("loginEmail");
          if (loginEmailEl) loginEmailEl.value = email;
        } else {
          const msg = data && data.message ? data.message : "Đăng ký thất bại";
          toast("error", "Đăng ký thất bại", msg);
        }
      })
      .catch((err) => {
        console.error(err);
        toast("error", "Lỗi server", "Không thể kết nối tới server");
      });
  }

  // Event listeners
  const showLoginTabBtn = document.getElementById("showLoginTab");
  const showRegisterTabBtn = document.getElementById("showRegisterTab");
  const submitLoginBtn = document.getElementById("submitLogin");
  const submitRegisterBtn = document.getElementById("submitRegister");
  const loginPasswordEl = document.getElementById("loginPassword");
  const registerConfirmPasswordEl = document.getElementById(
    "registerConfirmPassword"
  );

  if (showLoginTabBtn) {
    showLoginTabBtn.addEventListener("click", showLoginTab);
  }
  if (showRegisterTabBtn) {
    showRegisterTabBtn.addEventListener("click", showRegisterTab);
  }
  if (submitLoginBtn) {
    submitLoginBtn.addEventListener("click", handleLogin);
  }
  if (submitRegisterBtn) {
    submitRegisterBtn.addEventListener("click", handleRegister);
  }

  // Allow Enter key to submit
  if (loginPasswordEl) {
    loginPasswordEl.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleLogin();
    });
  }

  if (registerConfirmPasswordEl) {
    registerConfirmPasswordEl.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleRegister();
    });
  }
});

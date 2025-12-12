document.addEventListener("DOMContentLoaded", () => {
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
  // function validateLogin() {
  //   let isValid = true;
  //   const emailEl = document.getElementById("loginEmail");
  //   const passwordEl = document.getElementById("loginPassword");

  //   if (!emailEl || !passwordEl) return false;

  //   const email = emailEl.value.trim();
  //   const password = passwordEl.value;

  //   clearAuthErrors();

  //   if (!email) {
  //     const errEl = document.getElementById("err_loginEmail");
  //     if (errEl) {
  //       errEl.style.display = "block";
  //       errEl.textContent = "Vui lòng nhập email";
  //     }
  //     isValid = false;
  //   } else if (!/\S+@\S+\.\S+/.test(email)) {
  //     const errEl = document.getElementById("err_loginEmail");
  //     if (errEl) {
  //       errEl.style.display = "block";
  //       errEl.textContent = "Email không hợp lệ";
  //     }
  //     isValid = false;
  //   }

  //   if (!password) {
  //     const errEl = document.getElementById("err_loginPassword");
  //     if (errEl) {
  //       errEl.style.display = "block";
  //       errEl.textContent = "Vui lòng nhập mật khẩu";
  //     }
  //     isValid = false;
  //   }

  //   return isValid;
  // }

  function handleLogin() {
    if (!validateLogin()) return;

    const emailEl = document.getElementById("loginEmail");
    const passwordEl = document.getElementById("loginPassword");
    if (!emailEl || !passwordEl) return;

    const email = emailEl.value.trim();
    const password = passwordEl.value;
  }

  // function validateRegister() {
  //   let isValid = true;
  //   const nameEl = document.getElementById("registerName");
  //   const emailEl = document.getElementById("registerEmail");
  //   const phoneEl = document.getElementById("registerPhone");
  //   const passwordEl = document.getElementById("registerPassword");
  //   const confirmPasswordEl = document.getElementById(
  //     "registerConfirmPassword"
  //   );

  //   if (!nameEl || !emailEl || !phoneEl || !passwordEl || !confirmPasswordEl) {
  //     return false;
  //   }

  //   const name = nameEl.value.trim();
  //   const email = emailEl.value.trim();
  //   const phone = phoneEl.value.trim();
  //   const password = passwordEl.value;
  //   const confirmPassword = confirmPasswordEl.value;

  //   clearAuthErrors();

  //   if (!name) {
  //     const errEl = document.getElementById("err_registerName");
  //     if (errEl) {
  //       errEl.style.display = "block";
  //       errEl.textContent = "Vui lòng nhập họ và tên";
  //     }
  //     isValid = false;
  //   }

  //   if (!email) {
  //     const errEl = document.getElementById("err_registerEmail");
  //     if (errEl) {
  //       errEl.style.display = "block";
  //       errEl.textContent = "Vui lòng nhập email";
  //     }
  //     isValid = false;
  //   } else if (!/\S+@\S+\.\S+/.test(email)) {
  //     const errEl = document.getElementById("err_registerEmail");
  //     if (errEl) {
  //       errEl.style.display = "block";
  //       errEl.textContent = "Email không hợp lệ";
  //     }
  //     isValid = false;
  //   }

  //   if (!phone) {
  //     const errEl = document.getElementById("err_registerPhone");
  //     if (errEl) {
  //       errEl.style.display = "block";
  //       errEl.textContent = "Vui lòng nhập số điện thoại";
  //     }
  //     isValid = false;
  //   }

  //   if (!password) {
  //     const errEl = document.getElementById("err_registerPassword");
  //     if (errEl) {
  //       errEl.style.display = "block";
  //       errEl.textContent = "Vui lòng nhập mật khẩu";
  //     }
  //     isValid = false;
  //   } else if (password.length < 6) {
  //     const errEl = document.getElementById("err_registerPassword");
  //     if (errEl) {
  //       errEl.style.display = "block";
  //       errEl.textContent = "Mật khẩu phải có ít nhất 6 ký tự";
  //     }
  //     isValid = false;
  //   }

  //   if (!confirmPassword) {
  //     const errEl = document.getElementById("err_registerConfirmPassword");
  //     if (errEl) {
  //       errEl.style.display = "block";
  //       errEl.textContent = "Vui lòng xác nhận mật khẩu";
  //     }
  //     isValid = false;
  //   } else if (password !== confirmPassword) {
  //     const errEl = document.getElementById("err_registerConfirmPassword");
  //     if (errEl) {
  //       errEl.style.display = "block";
  //       errEl.textContent = "Mật khẩu xác nhận không khớp";
  //     }
  //     isValid = false;
  //   }

  //   return isValid;
  // }

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

    // fetch removed
  }

  // Event listeners
  const submitLoginBtn = document.getElementById("submitLogin");
  const submitRegisterBtn = document.getElementById("submitRegister");
  const loginPasswordEl = document.getElementById("loginPassword");
  const registerConfirmPasswordEl = document.getElementById(
    "registerConfirmPassword"
  );
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

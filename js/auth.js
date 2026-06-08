const emailInput =
  document.getElementById("email");

const passwordInput =
  document.getElementById("password");

const fullNameInput =
  document.getElementById("fullName");

const confirmPasswordInput =
  document.getElementById("confirmPassword");

const message =
  document.getElementById("message");

const loginCard =
  document.querySelector(".login-card");

let authMode = "signin";

// ====================
// BUTTONS
// ====================

document
  .getElementById("signupBtn")
  ?.addEventListener(
    "click",
    () => {

      if (authMode !== "signup") {
        setAuthMode("signup");
        return;
      }

      signUp();

    }
  );

document
  .getElementById("loginBtn")
  ?.addEventListener(
    "click",
    () => {

      if (authMode === "signup") {
        setAuthMode("signin");
        return;
      }

      signIn();

    }
  );

const logoutBtn =
  document.getElementById(
    "logoutBtn"
  );

if (logoutBtn) {

  logoutBtn.addEventListener(
    "click",
    logout
  );

}

document.addEventListener(
  "click",
  (e) => {

    const navBtn =
      e.target.closest(
        ".mobile-nav-btn"
      );

    if (!navBtn) {
      return;
    }

    const action =
      navBtn.dataset.action;

    if (action === "logout") {
      e.preventDefault();
      logout();
      return;
    }

    if (action === "open-trip-modal") {
      e.preventDefault();
      document.getElementById("openTripModal")?.click();
      return;
    }

    const tabTarget =
      navBtn.dataset.tab;

    if (tabTarget && typeof showTab === "function") {
      e.preventDefault();
      showTab(tabTarget);
      return;
    }

    const scrollTarget =
      navBtn.dataset.scroll;

    if (scrollTarget) {
      e.preventDefault();
      document
        .querySelector(scrollTarget)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      return;
    }

    const href =
      navBtn.dataset.href;

    if (href) {
      if (href.startsWith("#")) {
        e.preventDefault();
        document
          .querySelector(href)
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        return;
      }

      window.location.href = href;
    }
  }
);

// ====================
// SIGN UP
// ====================

function setAuthMode(mode) {

  authMode = mode;

  loginCard?.classList.toggle(
    "signup-mode",
    mode === "signup"
  );

  const loginBtn =
    document.getElementById("loginBtn");

  const signupBtn =
    document.getElementById("signupBtn");

  if (loginBtn) {
    loginBtn.textContent =
      mode === "signup"
        ? "Back to Sign In"
        : "Sign In";
  }

  if (signupBtn) {
    signupBtn.textContent =
      mode === "signup"
        ? "Create Account"
        : "Create Account";
  }

  if (message) {
    message.textContent = "";
    message.classList.remove("success");
  }

}

async function signUp() {

  const fullName =
    fullNameInput?.value.trim();

  const email =
    emailInput?.value.trim();

  const password =
    passwordInput?.value.trim();

  const confirmPassword =
    confirmPasswordInput?.value.trim();

  if (!fullName || !email || !password || !confirmPassword) {

    if (message) {

      message.classList.remove("success");
      message.textContent =
        "Full name, email, and password are required.";

    }

    return;

  }

  if (password !== confirmPassword) {

    if (message) {

      message.classList.remove("success");
      message.textContent =
        "Passwords do not match.";

    }

    return;

  }

  if (password.length < 6) {

    if (message) {

      message.classList.remove("success");
      message.textContent =
        "Password must be at least 6 characters.";

    }

    return;

  }

  const { error } =
    await supabaseClient
      .auth
      .signUp({

        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }

      });

  if (error) {

    if (message) {

      message.classList.remove("success");
      message.textContent =
        error.message;

    }

    return;

  }

  if (message) {

    message.classList.add("success");
    message.textContent =
      "Account created. Check your email.";

  }

}

// ====================
// SIGN IN
// ====================

async function signIn() {

  const email =
    emailInput?.value.trim();

  const password =
    passwordInput?.value.trim();

  if (!email || !password) {

    if (message) {

      message.textContent =
        "Email and password required.";

    }

    return;

  }

  const { error } =
    await supabaseClient
      .auth
      .signInWithPassword({

        email,
        password

      });

  if (error) {

    if (message) {

      message.textContent =
        error.message;

    }

    return;

  }

  window.location.href =
    "index.html";

}

// ====================
// LOGOUT
// ====================

async function logout() {

  console.log(
    "Logout clicked"
  );

  const { error } =
    await supabaseClient
      .auth
      .signOut();

  if (error) {

    console.error(error);

    alert(
      error.message
    );

    return;

  }

  window.location.href =
    "login.html";

}

// ====================
// CHECK SESSION
// ====================

async function checkSession() {

  const {
    data: { session }
  } =
  await supabaseClient
    .auth
    .getSession();

  if (
    session &&
    window.location.pathname.includes(
      "login.html"
    )
  ) {

    window.location.href =
      "index.html";

  }

}

checkSession();

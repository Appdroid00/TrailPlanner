const emailInput =
  document.getElementById("email");

const passwordInput =
  document.getElementById("password");

const message =
  document.getElementById("message");

// ====================
// BUTTONS
// ====================

document
  .getElementById("signupBtn")
  ?.addEventListener(
    "click",
    signUp
  );

document
  .getElementById("loginBtn")
  ?.addEventListener(
    "click",
    signIn
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

// ====================
// SIGN UP
// ====================

async function signUp() {

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
      .signUp({

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

  if (message) {

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
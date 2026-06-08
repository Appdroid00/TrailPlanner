async function protectPage() {

  const {
    data: { session }
  } =
  await supabaseClient.auth.getSession();

  if (!session) {

    window.location.href =
      "login.html";

    return;
  }

  const emailElement =
    document.getElementById("userEmail");

  if (emailElement) {

    emailElement.textContent =
      session.user.email;

  }

}

protectPage();
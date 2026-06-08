document.addEventListener(
  "DOMContentLoaded",
  async () => {

    const {
      data: { user }
    } =
    await supabaseClient.auth.getUser();

    if (!user) {
      window.location.href =
        "login.html";
      return;
    }

    document.getElementById(
      "profileEmail"
    ).textContent =
      user.email;

    await loadProfile(user);

    document
      .getElementById("profileForm")
      ?.addEventListener(
        "submit",
        (event) => saveProfile(event, user)
      );

  }
);

async function loadProfile(user) {

  document.getElementById(
    "fullName"
  ).value =
    user.user_metadata?.full_name || "";

  const { data, error } =
    await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

  if (error) {
    showProfileMessage(
      "Profile table is not ready in Supabase yet.",
      false
    );
    return;
  }

  if (!data) {
    return;
  }

  document.getElementById(
    "fullName"
  ).value =
    data.full_name ||
    user.user_metadata?.full_name ||
    "";

  document.getElementById(
    "homeCity"
  ).value =
    data.home_city || "";

  document.getElementById(
    "homeCountry"
  ).value =
    data.home_country || "";

  document.getElementById(
    "preferredCurrency"
  ).value =
    data.preferred_currency || "PHP";

  document.getElementById(
    "travelStyle"
  ).value =
    data.travel_style || "";

  document.getElementById(
    "defaultBudget"
  ).value =
    data.default_budget || "";

}

async function saveProfile(event, user) {

  event.preventDefault();

  const fullName =
    document
      .getElementById("fullName")
      .value
      .trim();

  if (!fullName) {
    showProfileMessage(
      "Full name is required.",
      false
    );
    return;
  }

  await supabaseClient.auth.updateUser({
    data: {
      full_name: fullName
    }
  });

  const profile = {
    id: user.id,
    full_name: fullName,
    home_city:
      document.getElementById("homeCity").value.trim(),
    home_country:
      document.getElementById("homeCountry").value.trim(),
    preferred_currency:
      document.getElementById("preferredCurrency").value,
    travel_style:
      document.getElementById("travelStyle").value,
    default_budget:
      Number(
        document.getElementById("defaultBudget").value || 0
      ),
    updated_at:
      new Date().toISOString()
  };

  const { error } =
    await supabaseClient
      .from("profiles")
      .upsert(profile);

  if (error) {
    showProfileMessage(
      "Profile table is not ready in Supabase yet.",
      false
    );
    return;
  }

  showProfileMessage(
    "Profile saved.",
    true
  );

}

function showProfileMessage(message, success) {

  const messageEl =
    document.getElementById("profileMessage");

  if (!messageEl) {
    return;
  }

  messageEl.textContent =
    message;

  messageEl.classList.toggle(
    "success",
    success
  );

}

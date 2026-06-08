
const tripId =
  new URLSearchParams(
    window.location.search
  ).get("id");

document.addEventListener(
  "DOMContentLoaded",
  () => {

    if (!tripId) {

      alert("Trip ID not found");

      window.location.href =
        "index.html";

      return;

    }

    loadTrip();

    const saveBtn =
      document.getElementById(
        "saveNotesBtn"
      );

    if (saveBtn) {

      saveBtn.addEventListener(
        "click",
        saveNotes
      );

    }

  }
);

async function loadTrip() {

  const {
    data,
    error
  } =
  await supabaseClient
    .from("trips")
    .select("*")
    .eq(
      "id",
      tripId
    )
    .single();

  if (error) {

    alert(error.message);

    return;

  }

  document.getElementById(
    "tripTitle"
  ).textContent =
    data.destination;

  document.getElementById(
    "tripDates"
  ).textContent =
    `${data.start_date || "-"} to ${data.end_date || "-"}`;

  document.getElementById(
    "tripBudget"
  ).textContent =
    `PHP ${Number(
      data.budget || 0
    ).toLocaleString()}`;

  const statusSelect =
    document.getElementById(
      "tripStatusSelect"
    );

  if (statusSelect) {

  statusSelect.value =
    data.status || "Planning";

  statusSelect.onchange =
    async (e) => {

      const { error } =
        await supabaseClient
          .from("trips")
          .update({
            status:
              e.target.value
          })
          .eq(
            "id",
            tripId
          );

      if (error) {

        alert(
          error.message
        );

        return;

      }

      await loadTrip();

    };

}

  document.getElementById(
    "tripTravelers"
  ).textContent =
    data.travelers || 1;

  const notesField =
    document.getElementById(
      "tripNotes"
    );

  if (notesField) {

    notesField.value =
      data.notes || "";

  }

  document.getElementById(
    "overviewContent"
  ).innerHTML = `
    <div class="trip-card">

      <h3>
        Destination: ${data.destination}
      </h3>

      <p>
        Dates: ${data.start_date || "-"}
        to
        ${data.end_date || "-"}
      </p>

      <p>
        Budget:
        PHP ${Number(
          data.budget || 0
        ).toLocaleString()}
      </p>

      <p>
        Travelers:
        ${data.travelers || 1}
      </p>

      <p>
        Status:
        ${data.status || "Planning"}
      </p>

    </div>
  `;

  const budgetBtn =
    document.getElementById(
      "budgetPageBtn"
    );

  if (budgetBtn) {

    budgetBtn.href =
      `budget.html?id=${tripId}`;

  }

  const packingBtn =
    document.getElementById(
      "packingPageBtn"
    );

  if (packingBtn) {

    packingBtn.href =
      `packing.html?id=${tripId}`;

  }

}

async function saveNotes() {

  const notes =
    document.getElementById(
      "tripNotes"
    ).value;

  const {
    error
  } =
  await supabaseClient
    .from("trips")
    .update({
      notes
    })
    .eq(
      "id",
      tripId
    );

  if (error) {

    alert(error.message);

    return;

  }

  alert(
    "Notes saved"
  );

}

function showTab(tabId) {

  document
    .querySelectorAll(
      ".tab-content"
    )
    .forEach(tab => {

      tab.style.display =
        "none";

    });

  document
    .getElementById(
      tabId
    )
    .style.display =
      "block";

}

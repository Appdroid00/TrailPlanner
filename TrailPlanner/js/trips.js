let editingTripId = null;


document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadTrips();

    const modal =
      document.getElementById(
        "tripModal"
      );

    const openBtn =
      document.getElementById(
        "openTripModal"
      );

    const closeBtn =
      document.getElementById(
        "closeTripModal"
      );

    const form =
      document.getElementById(
        "tripForm"
      );

    if (openBtn) {

      openBtn.addEventListener(
        "click",
        () => {

          resetForm();

          modal.style.display =
            "flex";

        }
      );

    }

    if (closeBtn) {

      closeBtn.addEventListener(
        "click",
        () => {

          modal.style.display =
            "none";

        }
      );

    }

    if (form) {

      form.addEventListener(
        "submit",
        saveTrip
      );

    }

    window.addEventListener(
      "click",
      (e) => {

        if (
          e.target === modal
        ) {

          modal.style.display =
            "none";

        }

      }
    );

  }
);



async function loadTrips() {

  const {
    data: { user }
  } =
  await supabaseClient
    .auth
    .getUser();

  if (!user) {

    window.location.href =
      "login.html";

    return;

  }

  const {
    data,
    error
  } =
  await supabaseClient
    .from("trips")
    .select("*")
    .eq(
      "user_id",
      user.id
    )
    .order(
      "created_at",
      {
        ascending:false
      }
    );

  if (error) {

    console.error(
      error
    );

    return;

  }

  renderTrips(
    data
  );

  updateStats(
    data
  );

}

function updateStats(
  trips
) {

  const tripCount =
    document.getElementById(
      "tripCount"
    );

  const budgetTotal =
    document.getElementById(
      "budgetTotal"
    );

  const upcomingTrips =
    document.getElementById(
      "upcomingTrips"
    );

  if (tripCount) {

    tripCount.textContent =
      trips.length;

  }

  if (budgetTotal) {

    const total =
      trips.reduce(
        (
          sum,
          trip
        ) =>
          sum +
          Number(
            trip.budget || 0
          ),
        0
      );

    budgetTotal.textContent =
      `₱${total.toLocaleString()}`;

  }

  if (upcomingTrips) {

    upcomingTrips.textContent =
      trips.length;

  }

}

function renderTrips(
  trips
) {

  const tripList =
    document.getElementById(
      "tripList"
    );

  if (!tripList)
    return;

  if (
    trips.length === 0
  ) {

    tripList.innerHTML = `
      <div class="empty-state">
        <h3>
          No Trips Yet
        </h3>
        <p>
          Create your first adventure.
        </p>
      </div>
    `;

    return;

  }

  tripList.innerHTML =
    trips.map(
      trip => `

      <div class="trip-card">

        <h3>
          ${trip.destination}
        </h3>

        <p>
          ${trip.start_date || "-"}
          →
          ${trip.end_date || "-"}
        </p>

        <p>
          Budget:
          ₱${Number(
            trip.budget || 0
          ).toLocaleString()}
        </p>

        <div
          style="
            display:flex;
            gap:10px;
            flex-wrap:wrap;
            margin-top:15px;
          ">

          <button
            onclick="openTrip('${trip.id}')">

            Open

          </button>

          <button
            onclick="editTrip('${trip.id}')">

            Edit

          </button>

          <button
            style="
              background:#dc2626;
            "
            onclick="deleteTrip('${trip.id}')">

            Delete

          </button>

        </div>

      </div>

    `
    ).join("");

}

async function saveTrip(
  e
) {

  e.preventDefault();

  const {
    data: { user }
  } =
  await supabaseClient
    .auth
    .getUser();

  const destination =
    document.getElementById(
      "destination"
    ).value;

  const start_date =
    document.getElementById(
      "startDate"
    ).value;

  const end_date =
    document.getElementById(
      "endDate"
    ).value;

  const budget =
    document.getElementById(
      "budget"
    ).value;

  const travelers =
  document.getElementById(
    "travelers"
  ).value;

const status =
  document.getElementById(
    "status"
  )?.value || "Planning";

const notes =
  document.getElementById(
    "notes"
  )?.value || "";

  let error;

  if (
    editingTripId
  ) {

    const result =
      await supabaseClient
        .from("trips")
        .update({

  destination,

  start_date,

  end_date,

  budget,

  travelers,

  status,

  notes

})
        .eq(
          "id",
          editingTripId
        );

    error =
      result.error;

  }

  else {

    const result =
      await supabaseClient
        .from("trips")
        .insert([
  {

    user_id:
      user.id,

    destination,

    start_date,

    end_date,

    budget,

    travelers,

    status,

    notes

  }
]);

    error =
      result.error;

  }

  if (error) {

    alert(
      error.message
    );

    return;

  }

  document.getElementById(
    "tripModal"
  ).style.display =
    "none";

  resetForm();

  loadTrips();

}

async function editTrip(
  id
) {

  const {
    data,
    error
  } =
  await supabaseClient
    .from("trips")
    .select("*")
    .eq(
      "id",
      id
    )
    .single();

  if (error) {

    alert(
      error.message
    );

    return;

  }

  editingTripId =
    id;

  document.getElementById(
    "destination"
  ).value =
    data.destination || "";

  document.getElementById(
    "startDate"
  ).value =
    data.start_date || "";

  document.getElementById(
    "endDate"
  ).value =
    data.end_date || "";

  document.getElementById(
    "budget"
  ).value =
    data.budget || "";
  
  document.getElementById(
  "travelers"
).value =
  data.travelers || 1;

const statusField =
  document.getElementById(
    "status"
  );

if (statusField) {
  statusField.value =
    data.status ||
    "Planning";
}

const notesField =
  document.getElementById(
    "notes"
  );

if (notesField) {
  notesField.value =
    data.notes || "";
}

  document.querySelector(
    ".modal-content h2"
  ).textContent =
    "Edit Trip";

  document.querySelector(
    "#tripForm button"
  ).textContent =
    "Update Trip";

  document.getElementById(
    "tripModal"
  ).style.display =
    "flex";

}

async function deleteTrip(
  id
) {

  const confirmed =
    confirm(
      "Delete this trip?"
    );

  if (
    !confirmed
  ) {
    return;
  }

  const {
    error
  } =
  await supabaseClient
    .from("trips")
    .delete()
    .eq(
      "id",
      id
    );

  if (error) {

    alert(
      error.message
    );

    return;

  }

  loadTrips();

}

function resetForm() {

  editingTripId = null;

  document
    .getElementById("tripForm")
    ?.reset();

  const travelers =
    document.getElementById(
      "travelers"
    );

  if (travelers) {
    travelers.value = 1;
  }

  const status =
    document.getElementById(
      "status"
    );

  if (status) {
    status.value = "Planning";
  }

  const notes =
    document.getElementById(
      "notes"
    );

  if (notes) {
    notes.value = "";
  }

  const title =
    document.querySelector(
      ".modal-content h2"
    );

  if (title) {
    title.textContent =
      "Create Trip";
  }

  const submitBtn =
    document.querySelector(
      "#tripForm button[type='submit']"
    );

  if (submitBtn) {
    submitBtn.textContent =
      "Save Trip";
  }

}

function openTrip(
  id
) {

  window.location.href =
    `trip.html?id=${id}`;

}

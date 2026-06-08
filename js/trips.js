let editingTripId = null;
let pendingDeleteTripId = null;


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

    const deleteModal =
      document.getElementById(
        "deleteTripModal"
      );

    const cancelDeleteBtn =
      document.getElementById(
        "cancelDeleteTripBtn"
      );

    const confirmDeleteBtn =
      document.getElementById(
        "confirmDeleteTripBtn"
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

    if (cancelDeleteBtn) {

      cancelDeleteBtn.addEventListener(
        "click",
        closeDeleteTripModal
      );

    }

    if (confirmDeleteBtn) {

      confirmDeleteBtn.addEventListener(
        "click",
        confirmDeleteTrip
      );

    }

    wireMobileNav([]);

    window.addEventListener(
      "click",
      (e) => {

        if (
          e.target === modal
        ) {

          modal.style.display =
            "none";

        }

        if (
          deleteModal &&
          e.target === deleteModal
        ) {

          closeDeleteTripModal();

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

  wireMobileNav(data);

}

function wireMobileNav(trips) {

  const homeLink =
    document.getElementById(
      "dashboardMobileHomeLink"
    );

  if (homeLink) {
    homeLink.dataset.href =
      "index.html";
  }

  const tripsLink =
    document.getElementById(
      "dashboardMobileTripsLink"
    );

  if (tripsLink) {
    tripsLink.dataset.scroll =
      "#tripList";
  }

  const budgetLink =
    document.getElementById(
      "dashboardMobileBudgetLink"
    );

  if (budgetLink) {
    if (trips && trips.length > 0) {
      budgetLink.dataset.href =
        `budget.html?id=${trips[0].id}`;
      budgetLink.removeAttribute("data-action");
    } else {
      budgetLink.dataset.action =
        "open-trip-modal";
      budgetLink.removeAttribute("data-href");
    }
  }

  const profileLink =
    document.getElementById(
      "dashboardMobileProfileLink"
    );

  if (profileLink) {
    profileLink.dataset.href =
      "profile.html";
    profileLink.removeAttribute(
      "data-action"
    );
  }

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
      `PHP ${total.toLocaleString()}`;

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
          to
          ${trip.end_date || "-"}
        </p>

        <p>
          Budget:
          PHP ${Number(
            trip.budget || 0
          ).toLocaleString()}
        </p>

        <div
          class="trip-card-actions"
          style="
            display:flex;
            gap:10px;
            flex-wrap:wrap;
            margin-top:15px;
          ">

          <button
            class="open-btn"
            onclick="openTrip('${trip.id}')">

            <svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 7h6l2 2h10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"></path>
              <path d="M3 7V5a2 2 0 0 1 2-2h4l2 2h5a2 2 0 0 1 2 2v2"></path>
            </svg>
            Open

          </button>

          <button
            class="edit-btn"
            onclick="editTrip('${trip.id}')">

            <svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
            </svg>
            Edit

          </button>

          <button
            class="delete-btn"
            onclick="deleteTrip('${trip.id}')">

            <svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 6h18"></path>
              <path d="M8 6V4h8v2"></path>
              <path d="M6 6l1 15h10l1-15"></path>
              <path d="M10 11v6"></path>
              <path d="M14 11v6"></path>
            </svg>
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

  pendingDeleteTripId = id;

  const deleteModal =
    document.getElementById(
      "deleteTripModal"
    );

  if (deleteModal) {
    deleteModal.style.display =
      "flex";
  }

}

function closeDeleteTripModal() {

  pendingDeleteTripId = null;

  const deleteModal =
    document.getElementById(
      "deleteTripModal"
    );

  if (deleteModal) {
    deleteModal.style.display =
      "none";
  }

}

async function confirmDeleteTrip() {

  if (!pendingDeleteTripId) {
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
      pendingDeleteTripId
    );

  if (error) {

    alert(
      error.message
    );

    return;

  }

  closeDeleteTripModal();
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

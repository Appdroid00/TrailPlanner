const itineraryTripId =
  new URLSearchParams(
    window.location.search
  ).get("id");

let editingActivityId = null;
let deleteActivityId = null;
let itineraryTripStartDate = null;

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    if (!itineraryTripId) {
      console.error(
        "No trip ID found"
      );
      return;
    }

    const form =
      document.getElementById(
        "activityForm"
      );

    if (form) {
      form.addEventListener(
        "submit",
        saveActivity
      );
    }

    const cancelBtn =
      document.getElementById(
        "cancelEditBtn"
      );

    if (cancelBtn) {
      cancelBtn.addEventListener(
        "click",
        cancelEdit
      );
    }

    const {
      data: trip
    } =
    await supabaseClient
      .from("trips")
      .select(
        "start_date,end_date"
      )
      .eq(
        "id",
        itineraryTripId
      )
      .single();

    if (trip) {

      itineraryTripStartDate =
        trip.start_date;

      document.getElementById(
        "activityDate"
      ).min =
        trip.start_date;

      document.getElementById(
        "activityDate"
      ).max =
        trip.end_date;

    }

    await loadActivities();

    const activityModal =
      document.getElementById(
        "activityModal"
      );

    document
      .getElementById(
        "openActivityModal"
      )
      ?.addEventListener(
        "click",
        () => {

          activityModal.style.display =
            "flex";

        }
      );

    document
      .getElementById(
        "closeActivityModal"
      )
      ?.addEventListener(
        "click",
        () => {

          activityModal.style.display =
            "none";

          cancelEdit();

        }
      );
    document
  .getElementById(
    "cancelDeleteActivityBtn"
  )
  ?.addEventListener(
    "click",
    () => {

      deleteActivityId = null;

      document.getElementById(
        "deleteActivityModal"
      ).style.display =
        "none";

    }
  );

document
  .getElementById(
    "confirmDeleteActivityBtn"
  )
  ?.addEventListener(
    "click",
    async () => {

      if (!deleteActivityId) {
        return;
      }

      const { error } =
        await supabaseClient
          .from("itinerary")
          .delete()
          .eq(
            "id",
            deleteActivityId
          );

      if (error) {
        console.error(error);
        return;
      }

      deleteActivityId = null;

      document.getElementById(
        "deleteActivityModal"
      ).style.display =
        "none";

      await loadActivities();

    }
  );

document.addEventListener(
  "keydown",
  (e) => {

    if (
      e.key === "Escape"
    ) {

      document.getElementById(
        "deleteActivityModal"
      ).style.display =
        "none";

      deleteActivityId = null;

    }

  }
);

    window.addEventListener(
      "click",
      (e) => {

        if (
          e.target === activityModal
        ) {

          activityModal.style.display =
            "none";

          cancelEdit();

        }

      }
    );

  }
);

function formatTime(time) {

  if (!time) {
    return "--:--";
  }

  return new Date(
    `2000-01-01T${time}`
  ).toLocaleTimeString(
    [],
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }
  );

}

async function loadActivities() {

  const {
    data,
    error
  } =
  await supabaseClient
    .from("itinerary")
    .select("*")
    .eq(
      "trip_id",
      itineraryTripId
    )
    .order(
      "activity_date",
      {
        ascending: true
      }
    )
    .order(
      "activity_time",
      {
        ascending: true
      }
    );

  if (error) {
    console.error(error);
    return;
  }

  renderActivities(
    data || []
  );

}

async function saveActivity(
  event
) {

  event.preventDefault();

  const {
    data: { user }
  } =
  await supabaseClient
    .auth
    .getUser();

  if (!user) {
    alert(
      "Please login."
    );
    return;
  }

  const activity_date =
    document.getElementById(
      "activityDate"
    ).value;

  const activity_time =
    document.getElementById(
      "activityTime"
    ).value;

  const title =
    document.getElementById(
      "activityTitle"
    ).value;

  const location =
    document.getElementById(
      "activityLocation"
    ).value;

  const category =
    document.getElementById(
      "activityCategory"
    ).value;

  const notes =
    document.getElementById(
      "activityNotes"
    ).value;

  let error;

  if (
    editingActivityId
  ) {

    const result =
      await supabaseClient
        .from("itinerary")
        .update({
          activity_date,
          activity_time,
          title,
          location,
          category,
          notes
        })
        .eq(
          "id",
          editingActivityId
        );

    error =
      result.error;

  } else {

    const result =
      await supabaseClient
        .from("itinerary")
        .insert([
          {
            user_id: user.id,
            trip_id:
              itineraryTripId,
            activity_date,
            activity_time,
            title,
            location,
            category,
            notes,
            completed: false
          }
        ]);

    error =
      result.error;

  }

  if (error) {
    alert(error.message);
    return;
  }

  editingActivityId = null;

  document.getElementById(
    "activityForm"
  ).reset();

  document.getElementById(
    "activityFormTitle"
  ).textContent =
    "Add Activity";

  document.getElementById(
    "saveActivityBtn"
  ).textContent =
    "Add Activity";

  document.getElementById(
    "cancelEditBtn"
  ).style.display =
    "none";

  await loadActivities();

  document.getElementById(
    "activityModal"
  ).style.display =
    "none";

}

function renderActivities(
  activities
) {

  const container =
    document.getElementById(
      "itineraryList"
    );

  if (!container) return;

  if (
    activities.length === 0
  ) {

    container.innerHTML = `
      <tr>
        <td colspan="7">
          No activities yet.
        </td>
      </tr>
    `;

    return;

  }

  container.innerHTML =
    activities.map(
      activity => `
      <tr>
        <td>${activity.activity_date}</td>
        <td>${formatTime(activity.activity_time)}</td>
        <td class="${activity.completed ? "completed" : ""}">
          ${activity.title}
        </td>
        <td>${activity.location || "-"}</td>
        <td>${activity.category || "-"}</td>
        <td>
          <input
          type="checkbox"
          ${activity.completed ? "checked" : ""}
          onchange="toggleComplete('${activity.id}', ${activity.completed})">
        </td>
        <td class="itinerary-actions">
          <button
          class="edit-btn"
          onclick="editActivity('${activity.id}')">
            <svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
            </svg>
            Edit
          </button>
          <button
          class="delete-btn"
          onclick="deleteActivity('${activity.id}')">
            <svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 6h18"></path>
              <path d="M8 6V4h8v2"></path>
              <path d="M6 6l1 15h10l1-15"></path>
              <path d="M10 11v6"></path>
              <path d="M14 11v6"></path>
            </svg>
            Delete
          </button>
        </td>
      </tr>
    `
    ).join("");

  const mobileContainer =
    document.getElementById(
      "mobileItineraryList"
    );

  if (mobileContainer) {
    mobileContainer.innerHTML =
      activities.map(
        activity => `
          <div class="itinerary-mobile-card">
            <div class="itinerary-mobile-top">
              <div>
                <p class="itinerary-mobile-date">
                  ${activity.activity_date}
                </p>
                <h3 class="itinerary-mobile-title ${activity.completed ? "completed" : ""}">
                  ${activity.title}
                </h3>
              </div>
              <label class="itinerary-mobile-check">
                <input
                  type="checkbox"
                  ${activity.completed ? "checked" : ""}
                  onchange="toggleComplete('${activity.id}', ${activity.completed})">
              </label>
            </div>

            <p class="itinerary-mobile-meta">
              ${formatTime(activity.activity_time)} · ${activity.category || "-"}
            </p>

            <p class="itinerary-mobile-location">
              ${activity.location || "-"}
            </p>

            <div class="itinerary-mobile-actions">
              <button
                class="edit-btn"
                onclick="editActivity('${activity.id}')">
                <svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                </svg>
                Edit
              </button>
              <button
                class="delete-btn"
                onclick="deleteActivity('${activity.id}')">
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

    const mobileCards =
      Array.from(
        mobileContainer.querySelectorAll(
          ".itinerary-mobile-card"
        )
      );

    const groupedCards =
      mobileCards.reduce(
        (groups, card) => {

          const dateText =
            card.querySelector(
              ".itinerary-mobile-date"
            )?.textContent.trim() || "No date";

          if (!groups[dateText]) {
            groups[dateText] = [];
          }

          groups[dateText].push(card);

          return groups;

        },
        {}
      );

    mobileContainer.innerHTML = "";

    Object.entries(
      groupedCards
    ).forEach(
      ([dateText, cards], index) => {

        const group =
          document.createElement(
            "details"
          );

        group.className =
          "itinerary-day-group";
        group.open = true;

        const header =
          document.createElement(
            "summary"
          );

        header.className =
          "itinerary-day-summary";

        const dayNumber =
          getTripDayNumber(
            cards[0]
              .querySelector(
                ".itinerary-mobile-date"
              )
              ?.textContent.trim()
          );

        const dayTitle =
          dayNumber
            ? `Day ${dayNumber}`
            : `Day ${index + 1}`;

        header.innerHTML = `
          <span class="itinerary-day-label">
            <strong>${dayTitle}</strong>
            ${formatDateLabel(dateText)}
          </span>
          <span class="itinerary-day-count">
            ${cards.length} ${cards.length === 1 ? "activity" : "activities"}
          </span>
        `;

        const body =
          document.createElement(
            "div"
          );

        body.className =
          "itinerary-day-cards";

        cards.forEach(
          card => body.appendChild(card)
        );

        group.append(
          header,
          body
        );
        mobileContainer.appendChild(
          group
        );

      }
    );
  }

}

function formatDateLabel(dateValue) {

  if (!dateValue) {
    return "No date";
  }

  return new Date(
    `${dateValue}T00:00:00`
  ).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric"
    }
  );

}

function getTripDayNumber(dateValue) {

  if (
    !dateValue ||
    !itineraryTripStartDate
  ) {
    return null;
  }

  const currentDate =
    new Date(
      `${dateValue}T00:00:00`
    );

  const startDate =
    new Date(
      `${itineraryTripStartDate}T00:00:00`
    );

  const diffDays =
    Math.round(
      (
        currentDate -
        startDate
      ) / 86400000
    );

  return diffDays >= 0
    ? diffDays + 1
    : null;

}

function groupActivitiesByDate(activities) {

  return activities.reduce(
    (groups, activity) => {

      const dateKey =
        activity.activity_date ||
        "No date";

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(activity);

      return groups;

    },
    {}
  );

}

async function editActivity(id) {

  const {
    data,
    error
  } =
  await supabaseClient
    .from("itinerary")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  document.getElementById("activityDate").value =
    data.activity_date;

  document.getElementById("activityTime").value =
    data.activity_time || "";

  document.getElementById("activityTitle").value =
    data.title || "";

  document.getElementById("activityLocation").value =
    data.location || "";

  document.getElementById("activityCategory").value =
    data.category || "";

  document.getElementById("activityNotes").value =
    data.notes || "";

  editingActivityId = id;

  document.getElementById("activityFormTitle").textContent =
    "Edit Activity";

  document.getElementById("saveActivityBtn").textContent =
    "Update Activity";

  document.getElementById("cancelEditBtn").style.display =
    "block";

  document.getElementById("activityModal").style.display =
    "flex";

}

function cancelEdit() {

  editingActivityId = null;

  document.getElementById(
    "activityForm"
  ).reset();

  document.getElementById(
    "activityFormTitle"
  ).textContent =
    "Add Activity";

  document.getElementById(
    "saveActivityBtn"
  ).textContent =
    "Add Activity";

  document.getElementById(
    "cancelEditBtn"
  ).style.display =
    "none";

  document.getElementById(
    "activityModal"
  ).style.display =
    "none";

}

async function toggleComplete(
  id,
  completed
) {

  await supabaseClient
    .from("itinerary")
    .update({
      completed:
        !completed
    })
    .eq(
      "id",
      id
    );

  await loadActivities();

}

function deleteActivity(id) {

  deleteActivityId = id;

  document.getElementById(
    "deleteActivityModal"
  ).style.display =
    "flex";

}

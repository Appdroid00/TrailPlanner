

const tripId =
  new URLSearchParams(
    window.location.search
  ).get("id");

console.log(
  "Trip ID:",
  tripId
);

let editingPackingId = null;
let deletePackingId = null;

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    if (!tripId) {

      alert(
        "Trip ID not found"
      );

      return;

    }

    document.getElementById(
      "backBtn"
    ).href =
      `trip.html?id=${tripId}`;

    document
      .getElementById(
        "packingForm"
      )
      .addEventListener(
        "submit",
        savePackingItem
      );

    document
      .getElementById(
        "cancelPackingEditBtn"
      )
      .addEventListener(
        "click",
        cancelEditPacking
      );

    document
      .getElementById(
        "deletePackingBtn"
      )
      .addEventListener(
        "click",
        deleteEditingPacking
      );

    document
      .getElementById(
        "addSelectedBtn"
      )
      .addEventListener(
        "click",
        addSelectedQuickItems
      );

    document
      .getElementById(
        "quickSearch"
      )
      .addEventListener(
        "input",
        loadQuickList
      );
  const packingModal =
  document.getElementById(
    "packingModal"
  );

document
  .getElementById(
    "openPackingModal"
  )
  ?.addEventListener(
    "click",
    () => {

      packingModal.style.display =
        "flex";

    }
  );
  document
.getElementById(
  "itemName"
)
.addEventListener(
  "input",
  () => {

    const errorEl =
      document.getElementById(
        "itemError"
      );

    errorEl.classList.remove(
      "show"
    );

  }
);

document
  .getElementById(
    "closePackingModal"
  )
  ?.addEventListener(
    "click",
    () => {

      cancelEditPacking();

    }
  );

window.addEventListener(
  "click",
  (e) => {

    if (
      e.target === packingModal
    ) {

      cancelEditPacking();

    }
const deleteModal =
  document.getElementById(
    "deletePackingModal"
  );

if (
  e.target === deleteModal
) {

  deleteModal.style.display =
    "none";

  deletePackingId = null;

}
  }
);

document.addEventListener(
  "keydown",
  (e) => {

    if (
      e.key === "Escape" &&
      packingModal.style.display === "flex"
    ) {

      cancelEditPacking();

    }

  }
);
document
  .getElementById(
    "cancelDeletePackingBtn"
  )
  ?.addEventListener(
    "click",
    () => {

      deletePackingId = null;

      document.getElementById(
        "deletePackingModal"
      ).style.display =
        "none";

    }
  );

document
  .getElementById(
    "confirmDeletePackingBtn"
  )
  ?.addEventListener(
    "click",
    async () => {

      if (!deletePackingId) return;

      await supabaseClient
        .from("packing")
        .delete()
        .eq(
          "id",
          deletePackingId
        );

      deletePackingId = null;

      document.getElementById(
        "deletePackingModal"
      ).style.display =
        "none";

      await loadPackingItems();

    }
    
  );

    await loadTrip();
    await loadPackingItems();
    await loadQuickList();

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
    console.error(error);
    return;
  }

  document.getElementById(
    "tripName"
  ).textContent =
    data.destination;

  const tripDates =
    document.getElementById(
      "tripDates"
    );

  if (tripDates) {

    tripDates.textContent =
      `${data.start_date || "-"} to ${data.end_date || "-"}`;

  }

  const overviewBtn =
    document.getElementById(
      "overviewBtn"
    );

  const itineraryBtn =
    document.getElementById(
      "itineraryBtn"
    );

  const budgetBtn =
    document.getElementById(
      "budgetBtn"
    );

  const notesBtn =
    document.getElementById(
      "notesBtn"
    );

  if (overviewBtn) {
    overviewBtn.href =
      `trip.html?id=${tripId}`;
  }

  if (itineraryBtn) {
    itineraryBtn.href =
      `trip.html?id=${tripId}`;
  }

  if (budgetBtn) {
    budgetBtn.href =
      `budget.html?id=${tripId}`;
  }

  if (notesBtn) {
    notesBtn.href =
      `trip.html?id=${tripId}#notes`;
  }

  const mobileTripLink =
    document.getElementById(
      "packingMobileTripLink"
    );

  if (mobileTripLink) {
    mobileTripLink.dataset.href =
      `trip.html?id=${tripId}`;
  }

  const mobileBudgetLink =
    document.getElementById(
      "packingMobileBudgetLink"
    );

  if (mobileBudgetLink) {
    mobileBudgetLink.dataset.href =
      `budget.html?id=${tripId}`;
  }

  const mobileNotesLink =
    document.getElementById(
      "packingMobileNotesLink"
    );

  if (mobileNotesLink) {
    mobileNotesLink.dataset.href =
      `trip.html?id=${tripId}#notes`;
    mobileNotesLink.removeAttribute(
      "data-scroll"
    );
  }

}
async function loadPackingItems() {

  const {
    data,
    error
  } =
  await supabaseClient
    .from("packing")
    .select("*")
    .eq(
      "trip_id",
      tripId
    )
    .order(
      "created_at",
      {
        ascending: false
      }
    );

  if (error) {
    console.error(error);
    return;
  }

  renderPackingItems(
    data || []
  );

  updatePackingSummary(
    data || []
  );

}

function updatePackingSummary(
  items
) {

  const total =
    items.length;

  const packed =
    items.filter(
      item => item.packed
    ).length;

  const percent =
    total > 0
      ? (packed / total) * 100
      : 0;

  document.getElementById(
    "packingSummaryText"
  ).textContent =
    `${packed} / ${total} Packed (${percent.toFixed(0)}%)`;

  document.getElementById(
    "packingProgressBar"
  ).style.width =
    `${percent}%`;

  const totalItems =
    document.getElementById(
      "totalItems"
    );

  const packedItems =
    document.getElementById(
      "packedItems"
    );

  const packingPercent =
    document.getElementById(
      "packingPercent"
    );

  if (totalItems) {
    totalItems.textContent =
      total;
  }

  if (packedItems) {
    packedItems.textContent =
      packed;
  }

  if (packingPercent) {
    packingPercent.textContent =
      `${percent.toFixed(0)}%`;
  }

}
function renderPackingItems(items) {

  const container =
    document.getElementById(
      "packingList"
    );

  const mobileContainer =
    document.getElementById(
      "mobilePackingList"
    );

  if (items.length === 0) {

    container.innerHTML = `
      <tr>
        <td colspan="5">
          No items yet.
        </td>
      </tr>
    `;

    if (mobileContainer) {

      mobileContainer.innerHTML = `
        <div class="empty-mobile-list">
          No items yet.
        </div>
      `;

    }

    return;

  }

  /* Desktop Table */

  container.innerHTML =
    items.map(item => `

      <tr>

        <td>

          <input
            type="checkbox"
            ${item.packed ? "checked" : ""}
            onchange="togglePacked('${item.id}', ${item.packed})">

        </td>

        <td>

          <span class="${item.packed ? "packed" : ""}">

            ${item.item_name}

          </span>

        </td>

        <td>

          ${item.category}

        </td>

        <td>

          ${item.quantity}

        </td>

        <td class="packing-actions">

          <button
            class="edit-btn"
            onclick="editPackingItem('${item.id}')">

            Edit

          </button>

          <button
            class="delete-btn"
            onclick="deletePackingItem('${item.id}')">

            Delete

          </button>

        </td>

      </tr>

    `).join("");

  /* Mobile Checklist */

  if (mobileContainer) {

    mobileContainer.innerHTML =
      items.map(item => `

        <div
          class="mobile-packing-item ${item.packed ? "packed" : ""}"
          onclick="editPackingItem('${item.id}')">

          <input
            type="checkbox"
            ${item.packed ? "checked" : ""}
            onclick="
              event.stopPropagation();
              togglePacked('${item.id}', ${item.packed});
            ">

          <span>

            ${item.item_name}

          </span>

        </div>

      `).join("");

  }

}
async function savePackingItem(
  event
) {

  event.preventDefault();

  const {
    data: { user }
  } =
  await supabaseClient
    .auth
    .getUser();

  const item_name =
    document
      .getElementById(
        "itemName"
      )
      .value
      .trim();

  const category =
    document
      .getElementById(
        "itemCategory"
      )
      .value;

  const quantity =
    Number(
      document
        .getElementById(
          "itemQuantity"
        )
        .value
    );

  const errorEl =
    document.getElementById(
      "itemError"
    );

  errorEl.textContent = "";

  errorEl.classList.remove(
    "show"
  );

  let error;

  if (
    editingPackingId
  ) {

    const {
      data: existingItems
    } =
    await supabaseClient
      .from("packing")
      .select(
        "id,item_name"
      )
      .eq(
        "trip_id",
        tripId
      );

    const duplicate =
      existingItems.some(
        item =>
          item.id !==
            editingPackingId &&
          item.item_name
            .trim()
            .toLowerCase() ===
          item_name
            .trim()
            .toLowerCase()
      );

    if (duplicate) {

      errorEl.textContent =
        "Item already exists in this trip.";

      errorEl.classList.add(
        "show"
      );

      return;

    }

    const result =
      await supabaseClient
        .from("packing")
        .update({
          item_name,
          category,
          quantity
        })
        .eq(
          "id",
          editingPackingId
        );

    error =
      result.error;

  } else {

    const {
      data: existingItems
    } =
    await supabaseClient
      .from("packing")
      .select(
        "item_name"
      )
      .eq(
        "trip_id",
        tripId
      );

    const duplicate =
      existingItems.some(
        item =>
          item.item_name
            .trim()
            .toLowerCase() ===
          item_name
            .trim()
            .toLowerCase()
      );

    if (duplicate) {

      errorEl.textContent =
        "Item already exists in this trip.";

      errorEl.classList.add(
        "show"
      );

      return;

    }

    const result =
      await supabaseClient
        .from("packing")
        .insert([
          {
            user_id:
              user.id,
            trip_id:
              tripId,
            item_name,
            category,
            quantity,
            packed: false
          }
        ]);

    error =
      result.error;

    if (!error) {

      await saveToLibrary(
        item_name,
        category
      );

    }

  }

  if (error) {

    console.error(
      error
    );

    return;

  }

  cancelEditPacking();

  await loadPackingItems();

  await loadQuickList();

}
async function saveToLibrary(
  item_name,
  category
) {

  const {
    data: { user }
  } =
  await supabaseClient
    .auth
    .getUser();

  const existing =
    await supabaseClient
      .from("packing_library")
      .select("id")
      .eq(
        "item_name",
        item_name
      )
      .maybeSingle();

  if (
    existing.data
  ) {
    return;
  }

  const result =
    await supabaseClient
      .from("packing_library")
      .insert([
        {
          user_id:
            user.id,
          item_name,
          category
        }
      ]);

  console.log(
    "Library insert:",
    result
  );



}
async function loadQuickList() {

  const search =
    document
      .getElementById(
        "quickSearch"
      )
      .value
      .toLowerCase();

  const {
    data,
    error
  } =
  await supabaseClient
    .from("packing_library")
    .select("*")
    .order(
      "item_name"
    );

  if (error) {
    return;
  }

  const filtered =
    data.filter(
      item =>
        item.item_name
          .toLowerCase()
          .includes(search)
    );

  document.getElementById(
  "quickList"
).innerHTML = `

<div class="quick-list-table">

  <div class="quick-list-header">

    <div></div>

    <div>ITEM NAME</div>

    <div>CATEGORY</div>

  </div>

  ${filtered.map(item => `

    <div class="quick-list-row">

      <div>

        <input
        type="checkbox"
        class="quick-checkbox"
        data-name="${item.item_name}"
        data-category="${item.category}">

      </div>

      <div class="quick-item-name">

        ${item.item_name}

      </div>

      <div class="quick-item-category">

        ${item.category}

      </div>

    </div>

  `).join("")}

</div>

`;

}

async function addSelectedQuickItems() {

  const {
    data: { user }
  } =
  await supabaseClient
    .auth
    .getUser();

  const checkboxes =
    document.querySelectorAll(
      ".quick-checkbox:checked"
    );

  if (
    checkboxes.length === 0
  ) {
    return;
  }

  const {
    data: existingItems
  } =
  await supabaseClient
    .from("packing")
    .select("item_name")
    .eq(
      "trip_id",
      tripId
    );

  const existingNames =
    new Set(
      existingItems.map(
        item =>
          item.item_name
            .trim()
            .toLowerCase()
      )
    );

  const inserts = [];

  checkboxes.forEach(
    checkbox => {

      const itemName =
        checkbox.dataset.name
          .trim()
          .toLowerCase();

      if (
        existingNames.has(
          itemName
        )
      ) {
        return;
      }

      inserts.push({
        user_id:
          user.id,
        trip_id:
          tripId,
        item_name:
          checkbox.dataset.name,
        category:
          checkbox.dataset.category,
        quantity: 1,
        packed: false
      });

    }
  );

  if (
  inserts.length === 0
) {

  showQuickListMessage(
    "All selected items already exist in your packing list."
  );

  return;

}

  await supabaseClient
    .from("packing")
    .insert(
      inserts
    );

  await loadPackingItems();

}
async function togglePacked(
  id,
  packed
) {

  await supabaseClient
    .from("packing")
    .update({
      packed: !packed
    })
    .eq(
      "id",
      id
    );

  await loadPackingItems();

}

async function editPackingItem(
  id
) {

  const {
    data,
    error
  } =
  await supabaseClient
    .from("packing")
    .select("*")
    .eq(
      "id",
      id
    )
    .single();

  if (error) {
    return;
  }

  editingPackingId =
    id;

  document.getElementById(
    "itemName"
  ).value =
    data.item_name;

  document.getElementById(
    "itemCategory"
  ).value =
    data.category;

  document.getElementById(
    "itemQuantity"
  ).value =
    data.quantity;

  document.getElementById(
    "packingFormTitle"
  ).textContent =
    "Edit Item";

  document.getElementById(
    "savePackingBtn"
  ).textContent =
    "Update Item";

  document.getElementById(
    "cancelPackingEditBtn"
  ).style.display =
    "block";

  document.getElementById(
    "deletePackingBtn"
  ).style.display =
    "block";

  document.getElementById(
  "packingModal"
).style.display =
  "flex";

}

function cancelEditPacking() {

  editingPackingId =
    null;

  document.getElementById(
    "packingForm"
  ).reset();

  document.getElementById(
    "packingFormTitle"
  ).textContent =
    "Add Item";

  document.getElementById(
    "savePackingBtn"
  ).textContent =
    "Add To List";

  document.getElementById(
    "cancelPackingEditBtn"
  ).style.display =
    "none";

  document.getElementById(
    "deletePackingBtn"
  ).style.display =
    "none";

  document.getElementById(
    "packingModal"
  ).style.display =
    "none";

}

function deletePackingItem(
  id
) {

  deletePackingId = id;

  document.getElementById(
    "deletePackingModal"
  ).style.display =
    "flex";
  const errorEl =
  document.getElementById(
    "itemError"
  );

errorEl.textContent = "";

errorEl.classList.remove(
  "show"
);

}

function deleteEditingPacking() {

  if (
    !editingPackingId
  ) {
    return;
  }

  deletePackingId =
    editingPackingId;

  cancelEditPacking();

  document.getElementById(
    "deletePackingModal"
  ).style.display =
    "flex";

}
function showToast(message) {

  let toast =
    document.getElementById(
      "toast"
    );

  if (!toast) {

    toast =
      document.createElement(
        "div"
      );

    toast.id =
      "toast";

    document.body.appendChild(
      toast
    );

  }

  toast.textContent =
    message;

  toast.classList.add(
    "show-toast"
  );

  setTimeout(() => {

    toast.classList.remove(
      "show-toast"
    );

  }, 3000);

}
function showQuickListMessage(
  message
) {

  let msg =
    document.getElementById(
      "quickListMessage"
    );

  if (!msg) {

    msg =
      document.createElement(
        "div"
      );

    msg.id =
      "quickListMessage";

    const quickListCard =
      document.querySelector(
        ".quick-list-card"
      );

    quickListCard.insertBefore(
      msg,
      document.getElementById(
        "addSelectedBtn"
      )
    );

  }

  msg.textContent =
    message;

  msg.classList.add(
    "show"
  );

  setTimeout(() => {

    msg.classList.remove(
      "show"
    );

  }, 3000);

}

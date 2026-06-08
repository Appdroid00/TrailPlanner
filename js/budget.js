const tripId =
  new URLSearchParams(
    window.location.search
  ).get("id");

let editingExpenseId = null;
let deleteExpenseId = null;
let tripBudget = 0;

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    if (!tripId) {
      alert("Trip ID not found");
      return;
    }

    const form =
      document.getElementById(
        "expenseForm"
      );

    if (form) {
      form.addEventListener(
        "submit",
        saveExpense
      );
    }

    const cancelBtn =
      document.getElementById(
        "cancelExpenseEditBtn"
      );

    if (cancelBtn) {
      cancelBtn.addEventListener(
        "click",
        cancelEditExpense
      );
    }

    const deleteBtn =
      document.getElementById(
        "deleteExpenseBtn"
      );

    if (deleteBtn) {
      deleteBtn.addEventListener(
        "click",
        deleteEditingExpense
      );
    }

    document.getElementById(
      "backBtn"
    ).href =
      `trip.html?id=${tripId}`;

      const expenseModal =
  document.getElementById(
    "expenseModal"
  );

document
  .getElementById(
    "openExpenseModal"
  )
  ?.addEventListener(
    "click",
    () => {

      expenseModal.style.display =
        "flex";

    }
  );

document
  .getElementById(
    "closeExpenseModal"
  )
  ?.addEventListener(
    "click",
    () => {

      cancelEditExpense();

    }
  );

window.addEventListener(
  "click",
  (e) => {

    if (
      e.target === expenseModal
    ) {

      cancelEditExpense();

    }

  }
);

document.addEventListener(
  "keydown",
  (e) => {

    if (
      e.key === "Escape" &&
      expenseModal.style.display === "flex"
    ) {

      cancelEditExpense();

    }

  }
);
document
.getElementById(
  "cancelDeleteExpenseBtn"
)
?.addEventListener(
  "click",
  () => {

    deleteExpenseId = null;

    document.getElementById(
      "deleteExpenseModal"
    ).style.display =
      "none";

  }
);
document
.getElementById(
  "confirmDeleteExpenseBtn"
)
?.addEventListener(
  "click",
  async () => {

    if (!deleteExpenseId) {
      return;
    }

    const { error } =
      await supabaseClient
        .from("expenses")
        .delete()
        .eq(
          "id",
          deleteExpenseId
        );

    if (error) {
      alert(error.message);
      return;
    }

    deleteExpenseId = null;

    document.getElementById(
      "deleteExpenseModal"
    ).style.display =
      "none";

    await loadExpenses();

  
  }
  
);
await loadTripBudget();
await loadExpenses();

  }
);
function formatPeso(
  amount
) {

  return new Intl.NumberFormat(
    "en-PH",
    {
      style: "currency",
      currency: "PHP"
    }
  ).format(
    Number(amount || 0)
  );


}

async function loadTripBudget() {

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

  tripBudget =
    Number(
      data.budget || 0
    );

  document.getElementById(
    "tripName"
  ).textContent =
    data.destination;

  document.getElementById(
    "tripDates"
  ).textContent =
    `${data.start_date || "-"} to ${data.end_date || "-"}`;

  
    const overviewBtn =
    document.getElementById(
      "overviewBtn"
    );

  const itineraryBtn =
    document.getElementById(
      "itineraryBtn"
    );

  const packingBtn =
    document.getElementById(
      "packingBtn"
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

  if (packingBtn) {
    packingBtn.href =
      `packing.html?id=${tripId}`;
  }

  if (notesBtn) {
    notesBtn.href =
      `trip.html?id=${tripId}#notes`;
  }

  document.getElementById(
    "totalBudget"
  ).textContent =
    formatPeso(
      tripBudget
    );

}

async function loadExpenses() {

  const {
    data,
    error
  } =
  await supabaseClient
    .from("expenses")
    .select("*")
    .eq(
      "trip_id",
      tripId
    )
    .order(
      "expense_date",
      {
        ascending: false
      }
    );

  if (error) {
    console.error(error);
    return;
  }

  renderExpenses(
    data || []
  );

  updateBudgetSummary(
    data || []
  );

}

function updateBudgetSummary(
  expenses
) {

  const totalSpent =
    expenses.reduce(
      (
        total,
        expense
      ) =>
        total +
        Number(
          expense.amount || 0
        ),
      0
    );

  const remaining =
    tripBudget -
    totalSpent;

  const percentage =
    tripBudget > 0
      ? Math.min(
          (
            totalSpent /
            tripBudget
          ) * 100,
          100
        )
      : 0;

  document.getElementById(
    "totalSpent"
  ).textContent =
    formatPeso(
      totalSpent
    );

  document.getElementById(
    "remainingBudget"
  ).textContent =
    formatPeso(
      remaining
    );

  document.getElementById(
    "budgetSummaryText"
  ).textContent =
    `${formatPeso(totalSpent)} spent of ${formatPeso(tripBudget)} budget (${percentage.toFixed(0)}%)`;

  document.getElementById(
    "budgetProgressBar"
  ).style.width =
    `${percentage}%`;

}

function renderExpenses(
  expenses
) {

  const container =
    document.getElementById(
      "expenseList"
    );

  if (!container) return;

  if (
    expenses.length === 0
  ) {

    container.innerHTML = `
      <div class="empty-state">
        <h3>No expenses yet</h3>
        <p>Record your first expense.</p>
      </div>
    `;

    return;

  }

  container.innerHTML = `

    <div class="expense-table-wrapper">

      <table class="expense-table">

        <thead>

          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

        ${expenses.map(
          expense => `

          <tr>

            <td>
              ${new Date(
                expense.expense_date
              ).toLocaleDateString(
                "en-US"
              )}
            </td>

            <td>
              ${expense.description}
            </td>

            <td>
              ${expense.category}
            </td>

            <td>
              ${formatPeso(
                expense.amount
              )}
            </td>

            <td>

              <div class="expense-actions">

                <button
                class="edit-btn"
                onclick="editExpense('${expense.id}')">

                  Edit

                </button>

                <button
                class="delete-btn"
                onclick="deleteExpense('${expense.id}')">

                  Delete

                </button>

              </div>

            </td>

          </tr>

        `
        ).join("")}

        </tbody>

      </table>

    </div>

  `;

}
async function saveExpense(
  event
) {

  event.preventDefault();

  const {
    data: { user }
  } =
  await supabaseClient
    .auth
    .getUser();

  const expense_date =
    document.getElementById(
      "expenseDate"
    ).value;

  const category =
    document.getElementById(
      "expenseCategory"
    ).value;

  const description =
    document.getElementById(
      "expenseDescription"
    ).value;

  const amount =
    Number(
      document.getElementById(
        "expenseAmount"
      ).value
    );

  let error;

  if (
    editingExpenseId
  ) {

    const result =
      await supabaseClient
        .from("expenses")
        .update({
          expense_date,
          category,
          description,
          amount
        })
        .eq(
          "id",
          editingExpenseId
        );

    error =
      result.error;

  } else {

    const result =
      await supabaseClient
        .from("expenses")
        .insert([
          {
            user_id:
              user.id,
            trip_id:
              tripId,
            expense_date,
            category,
            description,
            amount
          }
        ]);

    error =
      result.error;

  }

  if (error) {
    alert(error.message);
    return;
  }

  cancelEditExpense();

  await loadExpenses();

}

async function editExpense(
  id
) {

  const {
    data,
    error
  } =
  await supabaseClient
    .from("expenses")
    .select("*")
    .eq(
      "id",
      id
    )
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  document.getElementById(
    "expenseDate"
  ).value =
    data.expense_date;

  document.getElementById(
    "expenseCategory"
  ).value =
    data.category;

  document.getElementById(
    "expenseDescription"
  ).value =
    data.description;

  document.getElementById(
    "expenseAmount"
  ).value =
    data.amount;

  editingExpenseId =
    id;

  document.getElementById(
    "expenseFormTitle"
  ).textContent =
    "Edit Expense";

  document.getElementById(
    "saveExpenseBtn"
  ).textContent =
    "Update Expense";

  document.getElementById(
    "cancelExpenseEditBtn"
  ).style.display =
    "block";

  document.getElementById(
    "deleteExpenseBtn"
  ).style.display =
    "block";

  document.getElementById(
  "expenseModal"
).style.display =
  "flex";

}

function cancelEditExpense() {

  editingExpenseId =
    null;

  document.getElementById(
    "expenseForm"
  ).reset();

  document.getElementById(
    "expenseFormTitle"
  ).textContent =
    "Record Expense";

  document.getElementById(
    "saveExpenseBtn"
  ).textContent =
    "Save Expense";

  document.getElementById(
    "cancelExpenseEditBtn"
  ).style.display =
    "none";

  document.getElementById(
    "deleteExpenseBtn"
  ).style.display =
    "none";

  document.getElementById(
    "expenseModal"
  ).style.display =
    "none";

}
function deleteExpense(id) {

  deleteExpenseId = id;

  document.getElementById(
    "deleteExpenseModal"
  ).style.display = "flex";

}
function deleteEditingExpense() {

  if (!editingExpenseId) {
    return;
  }

  deleteExpenseId =
    editingExpenseId;

  cancelEditExpense();

  document.getElementById(
    "deleteExpenseModal"
  ).style.display = "flex";

}

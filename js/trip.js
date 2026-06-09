
const tripId =
  new URLSearchParams(
    window.location.search
  ).get("id");

const mustTryCatalog = {
  albay: [
    {
      title: "Pinangat",
      tag: "Food",
      note: "Popular",
      body:
        "A classic Bicol dish to try while you're in the province."
    },
    {
      title: "Sili Ice Cream",
      tag: "Food",
      note: "Trend",
      body:
        "A local sweet-and-spicy stop that travelers keep searching for."
    },
    {
      title: "Ligñon Hill",
      tag: "View",
      note: "Open",
      body:
        "A go-to lookout for a wide Mayon view and quick city stop."
    },
    {
      title: "Cagsawa Ruins",
      tag: "Place",
      note: "Check before going",
      body:
        "One of Albay's most recognizable heritage and photo stops."
    }
  ]
};

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

    if (window.location.hash === "#notes") {
      showTab("notes");
    }

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

    ${buildMustTrySection(data.destination)}
  `;

  const budgetBtn =
    document.getElementById(
      "budgetPageBtn"
    );

  if (budgetBtn) {

    budgetBtn.href =
      `budget.html?id=${tripId}`;

  }

  const budgetQuickBtn =
    document.getElementById(
      "budgetPageBtnQuick"
    );

  if (budgetQuickBtn) {
    budgetQuickBtn.href =
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

  const packingQuickBtn =
    document.getElementById(
      "packingPageBtnQuick"
    );

  if (packingQuickBtn) {
    packingQuickBtn.href =
      `packing.html?id=${tripId}`;
  }

  const mobileBudgetLink =
    document.getElementById(
      "tripMobileBudgetLink"
    );

  if (mobileBudgetLink) {
    mobileBudgetLink.dataset.href =
      `budget.html?id=${tripId}`;
  }

  const mobilePackingLink =
    document.getElementById(
      "tripMobilePackingLink"
    );

  if (mobilePackingLink) {
    mobilePackingLink.dataset.href =
      `packing.html?id=${tripId}`;
  }

  const mobileItineraryLink =
    document.getElementById(
      "tripMobileItineraryLink"
    );

  if (mobileItineraryLink) {
    mobileItineraryLink.dataset.tab =
      "itinerary";
  }

}

function buildMustTrySection(
  destination
) {

  const guides =
    resolveMustTryGuides(
      destination
    ) || [
      createFallbackMustTryGuide(
        destination
      )
    ];

  const items =
    guides.flatMap(
      guide => guide.items || []
    );

  const sources =
    guides.flatMap(
      guide => guide.sources || []
    );

  const title =
    guides.length > 1
      ? guides
          .map(guide => guide.label)
          .join(" + ")
      : guides[0]?.label || destination || "this trip";

  if (!items.length) {
    return `
      <div class="must-try-panel">
        <div class="must-try-header">
          <div>
            <p class="section-eyebrow">Latest Must Try</p>
            <h3>Trending in ${title}</h3>
          </div>
        <span class="must-try-chip">Auto match</span>
        </div>
        <p class="must-try-empty">
          We will show local must-try spots here once a destination guide is available.
        </p>
      </div>
    `;
  }

  return `
    <section class="must-try-panel">
      <div class="must-try-header">
        <div>
          <p class="section-eyebrow">Latest Must Try</p>
          <h3>Trending in ${title}</h3>
        </div>
        <span class="must-try-chip">Verified picks</span>
      </div>

      <div class="must-try-grid">
        ${items
          .map(
            item => {

              const mapUrl =
                buildGoogleMapsSearchUrl(
                  title,
                  item.title
                );

              return `
              <a
                class="must-try-card must-try-link"
                href="${mapUrl}"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open ${item.title} in Google Maps">
                <div class="must-try-card-top">
                  <span class="must-try-tag">${item.tag}</span>
                  <span class="must-try-note">${item.note}</span>
                </div>
                <h4>${item.title}</h4>
                <p>${item.body}</p>
              </a>
            `;
            }
          )
          .join("")}
      </div>

      <p class="must-try-footnote">
        Check opening hours and local advisories before you go.
      </p>
      ${buildMustTrySources(sources)}
    </section>
  `;

}

function createFallbackMustTryGuide(
  destination
) {

  const label =
    (destination || "this trip")
      .trim() || "this trip";

  return {
    label,
    items: [
      {
        title: `${label} local food`,
        tag: "Food",
        note: "Auto",
        body:
          `A good place to start looking for the signature food of ${label}.`
      },
      {
        title: `${label} must-see stop`,
        tag: "Place",
        note: "Auto",
        body:
          `A notable spot in ${label} that travelers usually add to their list.`
      },
      {
        title: `${label} local experience`,
        tag: "Trend",
        note: "Auto",
        body:
          `A nearby activity or experience worth checking while you're in ${label}.`
      }
    ],
    sources: []
  };

}

function buildMustTrySources(
  sources
) {

  if (!sources.length) {
    return "";
  }

  return `
    <div class="must-try-sources">
      ${sources
        .map(
          source => `
            <a href="${source.href}" target="_blank" rel="noopener noreferrer">
              ${source.label}
            </a>
          `
        )
        .join("")}
    </div>
  `;

}

function buildGoogleMapsSearchUrl(
  destination,
  placeName
) {

  const query =
    [
      placeName,
      destination
    ]
      .filter(Boolean)
      .join(", ");

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

}

function resolveMustTryGuides(
  destination
) {

  const normalized =
    normalizeLocationName(
      destination
    );

  const parts =
    normalized
      .split(",")
      .map(part =>
        part.trim()
      )
      .filter(Boolean);

  const matchParts = [
    ...parts,
    normalized
  ];

  const matches = [];

  for (const guide of mustTryGuides) {

    const aliases = [
      ...(guide.aliases || []),
      ...(guide.province
        ? [guide.province]
        : [])
    ].map(alias =>
      normalizeLocationName(alias)
    );

    if (
      aliases.some(alias =>
        matchParts.includes(alias)
      )
    ) {
      matches.push(guide);
      continue;
    }

    if (
      aliases.some(alias =>
        matchParts.some(part =>
          part.includes(alias)
        )
      )
    ) {
      matches.push(guide);
    }

  }

  if (!matches.length) {
    return null;
  }

  return matches.filter(
    (guide, index, list) =>
      list.findIndex(
        item => item.key === guide.key
      ) === index
  );

}

function normalizeLocationName(
  value
) {

  return (value || "")
    .toString()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.]/g, "")
    .trim();

}

const mustTryGuides = [
  {
    key: "albay",
    label: "Albay",
    aliases: [
      "albay",
      "province of albay"
    ],
    items: [
      {
        title: "Pinangat",
        tag: "Food",
        note: "Popular",
        body:
          "A classic Bicol dish to try while you're in the province."
      },
      {
        title: "Sili Ice Cream",
        tag: "Food",
        note: "Trend",
        body:
          "A local sweet-and-spicy stop that travelers keep searching for."
      },
      {
        title: "Cagsawa Ruins",
        tag: "Place",
        note: "Check before going",
        body:
          "One of Albay's most recognizable heritage and photo stops."
      }
    ],
    sources: [
      {
        label: "Tourism | Province of Albay",
        href: "https://albay.gov.ph/tourism/"
      },
      {
        label: "Local Foods | Province of Albay",
        href: "https://albay.gov.ph/local-food/"
      },
      {
        label: "Tourist Spot | Province of Albay",
        href: "https://albay.gov.ph/tourist-spot/"
      }
    ]
  },
  {
    key: "la union",
    label: "La Union",
    aliases: [
      "la union",
      "province of la union"
    ],
    items: [
      {
        title: "Surf Town Food Stops",
        tag: "Food",
        note: "Popular",
        body:
          "Local cafes and beachside eats are part of the La Union travel loop."
      },
      {
        title: "Beach Sunset Walk",
        tag: "View",
        note: "Trend",
        body:
          "A simple but always popular sunset stop after a day by the shore."
      },
      {
        title: "Local Pasalubong",
        tag: "Shop",
        note: "Must try",
        body:
          "Look for regional snacks and treats before heading home."
      }
    ],
    sources: [
      {
        label: "Tourism | Provincial Government of La Union",
        href: "https://launion.gov.ph/department/la-union-provincial-tourism-office/"
      },
      {
        label: "travELYU | Provincial Government of La Union",
        href: "https://launion.gov.ph/travelyu/"
      },
      {
        label: "La Union Circuits | Provincial Government of La Union",
        href: "https://launion.gov.ph/la-union-circuits/"
      }
    ]
  },
  {
    key: "sorsogon",
    label: "Sorsogon",
    aliases: [
      "sorsogon",
      "province of sorsogon"
    ],
    items: [
      {
        title: "Donsol Whale Shark Experience",
        tag: "View",
        note: "Popular",
        body:
          "One of the province's best-known nature experiences."
      },
      {
        title: "Bulusan Lake",
        tag: "Place",
        note: "Trend",
        body:
          "A calm nature stop that belongs on most Sorsogon lists."
      },
      {
        title: "Museo Sorsogon",
        tag: "Culture",
        note: "Must try",
        body:
          "A good stop for local history and culture."
      }
    ],
    sources: [
      {
        label: "Tourism Office | Province of Sorsogon",
        href: "https://www.sorsogon.gov.ph/wp-content/uploads/2023/07/Provincial-Tourism-Culture-and-Arts-Office-compressed.pdf"
      },
      {
        label: "Annual Report | Province of Sorsogon",
        href: "https://sorsogon.gov.ph/wp-content/uploads/2024/01/80918692f7144a52836e787688a27c14-compressed-2d9d735f9629be55130fd3dd15d17c35-min.pdf"
      }
    ]
  },
  {
    key: "legazpi",
    label: "Legazpi City, Albay",
    aliases: [
      "legazpi",
      "legazpi city",
      "legazpi, albay",
      "legazpi city, albay"
    ],
    province: "albay",
    items: [
      {
        title: "Ligñon Hill",
        tag: "View",
        note: "Open",
        body:
          "A go-to lookout for a wide Mayon view and quick city stop."
      },
      {
        title: "Embarcadero",
        tag: "Spot",
        note: "Popular",
        body:
          "A familiar hangout and dining stop in the city."
      },
      {
        title: "Sili Ice Cream",
        tag: "Food",
        note: "Trend",
        body:
          "A local sweet-and-spicy stop that travelers keep searching for."
      }
    ]
  },
  {
    key: "san fernando",
    label: "San Fernando, La Union",
    aliases: [
      "san fernando",
      "san fernando city",
      "san fernando, la union",
      "san fernando city, la union"
    ],
    province: "la union",
    items: [
      {
        title: "Urbiztondo Surf Break",
        tag: "View",
        note: "Popular",
        body:
          "One of the best-known stops if you want the classic La Union beach vibe."
      },
      {
        title: "Seaside Cafes",
        tag: "Food",
        note: "Trend",
        body:
          "Coffee, brunch, and beach views are a big part of the local experience."
      }
    ],
    sources: [
      {
        label: "Tourism | Provincial Government of La Union",
        href: "https://launion.gov.ph/department/la-union-provincial-tourism-office/"
      },
      {
        label: "travELYU | Provincial Government of La Union",
        href: "https://launion.gov.ph/travelyu/"
      },
      {
        label: "La Union Circuits | Provincial Government of La Union",
        href: "https://launion.gov.ph/la-union-circuits/"
      }
    ]
  },
  {
    key: "sorsogon city",
    label: "Sorsogon City",
    aliases: [
      "sorsogon city",
      "sorsogon city, sorsogon"
    ],
    province: "sorsogon",
    items: [
      {
        title: "Museo Sorsogon",
        tag: "Culture",
        note: "Popular",
        body:
          "A compact city stop for local history and exhibits."
      },
      {
        title: "Capitol Area Walk",
        tag: "Spot",
        note: "Trend",
        body:
          "An easy city walk around the provincial center."
      }
    ],
    sources: [
      {
        label: "Tourism Office | Province of Sorsogon",
        href: "https://www.sorsogon.gov.ph/wp-content/uploads/2023/07/Provincial-Tourism-Culture-and-Arts-Office-compressed.pdf"
      },
      {
        label: "Annual Report | Province of Sorsogon",
        href: "https://sorsogon.gov.ph/wp-content/uploads/2024/01/80918692f7144a52836e787688a27c14-compressed-2d9d735f9629be55130fd3dd15d17c35-min.pdf"
      }
    ]
  },
  {
    key: "barcelona",
    label: "Barcelona, Sorsogon",
    aliases: [
      "barcelona",
      "barcelona, sorsogon"
    ],
    province: "sorsogon",
    items: [
      {
        title: "AgriHope Tourism Farm",
        tag: "Trend",
        note: "Popular",
        body:
          "A municipal tourism farm site often featured by the local government."
      },
      {
        title: "Barcelona Ruins Park",
        tag: "Place",
        note: "Must see",
        body:
          "A heritage stop and one of the town's recognizable attractions."
      }
    ],
    sources: [
      {
        label: "Home | LGU Barcelona",
        href: "https://barcelona.sorsogon.gov.ph/"
      },
      {
        label: "History of Barcelona | LGU Barcelona",
        href: "https://barcelona.sorsogon.gov.ph/history-of-barcelona/"
      },
      {
        label: "AgriHope | LGU Barcelona",
        href: "https://barcelona.sorsogon.gov.ph/agrihope-there-is-hope-in-agriculture-lgu-barcelona-owned-tourism-farm-site/"
      }
    ]
  },
  {
    key: "daraga",
    label: "Daraga, Albay",
    aliases: [
      "daraga",
      "daraga, albay"
    ],
    province: "albay",
    items: [
      {
        title: "Cagsawa Ruins",
        tag: "Place",
        note: "Popular",
        body:
          "The classic heritage stop often paired with a Mayon view."
      },
      {
        title: "Daraga Church",
        tag: "Heritage",
        note: "Must see",
        body:
          "A well-known landmark with a strong local history."
      }
    ]
  },
  {
    key: "tabaco",
    label: "Tabaco City, Albay",
    aliases: [
      "tabaco",
      "tabaco city",
      "tabaco, albay"
    ],
    province: "albay",
    items: [
      {
        title: "Tabaco Cathedral",
        tag: "Heritage",
        note: "Popular",
        body:
          "A familiar city landmark and an easy cultural stop."
      },
      {
        title: "Local Pili Treats",
        tag: "Food",
        note: "Trend",
        body:
          "A sweet buy-and-try stop for pili-based snacks and pasalubong."
      }
    ]
  }
];

function updateTripItineraryProgress(
  activities
) {

  const total =
    activities.length;

  const completed =
    activities.filter(
      activity => activity.completed
    ).length;

  const percent =
    total > 0
      ? (completed / total) * 100
      : 0;

  const progressText =
    document.getElementById(
      "tripItineraryProgressText"
    );

  if (progressText) {
    progressText.textContent =
      `${completed} / ${total} Activities (${percent.toFixed(0)}%)`;
  }

  const progressBar =
    document.getElementById(
      "tripItineraryProgressBar"
    );

  if (progressBar) {
    progressBar.style.width =
      `${percent}%`;
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

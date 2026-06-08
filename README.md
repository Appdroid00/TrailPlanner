PROJECT: TrailPlanner

OVERVIEW

TrailPlanner is a travel planning web application built with:

* HTML
* CSS
* Vanilla JavaScript
* Supabase

No frameworks are used.

DO NOT use:

* React
* Vue
* Angular
* jQuery
* Bootstrap components requiring JavaScript

The project should remain lightweight, mobile responsive, and production-ready.

---

## TECH STACK

Frontend:

* HTML
* CSS
* Vanilla JavaScript

Backend:

* Supabase

Database:

* PostgreSQL via Supabase

---

## PROJECT STRUCTURE

Pages:

* index.html
* dashboard.html
* trip.html
* budget.html
* packing.html

JavaScript:

* js/auth.js
* js/supabase.js
* js/trip.js
* js/budget.js
* js/packing.js

CSS:

* css/main.css
* css/mobile.css
* css/trip.css
* css/budget.css
* css/packing.css

---

## DATABASE

Table: trips

Columns:

* id
* user_id
* destination
* start_date
* end_date
* budget

Table: expenses

Columns:

* id
* user_id
* trip_id
* expense_date
* category
* description
* amount

Table: packing_items

Columns:

* id
* user_id
* trip_id
* item_name
* category
* quantity
* packed

---

## CURRENT FEATURES

Dashboard

* User authentication
* Trip list
* Create trip
* Edit trip
* Delete trip
* Dashboard statistics
* Mobile bottom navigation

Trip Page

* Trip overview
* Budget summary
* Packing summary
* Notes section
* Navigation tabs
* Itinerary management

Budget Page

* Budget summary cards
* Total budget
* Total spent
* Remaining budget
* Progress bar
* Add expense
* Edit expense
* Delete expense
* Expense table
* Custom delete modal

Packing Page

* Add packing item
* Edit packing item
* Delete packing item
* Mark packed/unpacked
* Progress tracking
* Packing summary
* Quick List panel
* Duplicate item prevention
* Custom delete modal

---

## UI DESIGN STANDARDS

Design Style:

* Modern SaaS
* Professional travel-planning look
* Clean cards
* Soft shadows
* Rounded corners
* Blue primary color
* Consistent spacing
* Mobile responsive

Buttons:

* Consistent styling
* Rounded corners
* Hover states
* Loading states when needed

Cards:

* White background
* Soft shadow
* Rounded corners
* Consistent padding

---

## MODAL STANDARDS

All pages must use custom modals.

DO NOT USE:

* alert()
* confirm()
* prompt()

Requirements:

* Overlay background
* Click outside to close
* ESC key closes modal
* Consistent styling

Delete Modal:

Title:

Delete Item

Message:

Are you sure you want to delete this item?

Buttons:

* Cancel
* Delete

---

## PACKING PAGE REQUIREMENTS

Duplicate Prevention

If item already exists in the same trip:

Example:

Camera

User tries to add:

Camera

Show inline validation:

Item already exists in this trip.

Do NOT use:

* alert()
* confirm()

Quick List

Users can:

* Search items
* Select multiple items
* Add selected items

If selected item already exists:

Show inline message inside Quick List card.

Do not use alert().

Desktop View

Current desktop layout:

Packing Checklist | Quick List

Checklist is on the left.
Quick List is on the right.

Keep this layout.

Mobile View

Desktop table should remain unchanged.

Mobile view should use a simplified checklist.

Instead of:

✓ Item Name Category Qty Actions

Show:

☐ Camera
☐ Passport
☑ Laptop
☐ Powerbank

Requirements:

* Checkbox visible
* Item name visible
* Easy thumb interaction
* Mobile-friendly cards
* Desktop remains unchanged

---

## BUDGET PAGE REQUIREMENTS

Delete Expense Flow

1. User clicks Delete
2. Custom modal opens
3. User confirms
4. Expense is deleted
5. Table refreshes

No browser confirm().

Budget Features

* Total budget
* Total spent
* Remaining budget
* Progress bar
* Expense CRUD

---

## ITINERARY PAGE REQUIREMENTS

Current Features

* Add activity
* Edit activity
* Delete activity
* Status checkbox
* Activity table

Future Enhancement

Group activities by:

Day 1
Day 2
Day 3

Based on trip start date.

Use collapsible day rows while keeping table layout.

Not implemented yet.

---

## RESPONSIVE DESIGN GOALS

Desktop

* Professional dashboard
* Tables
* Multi-column layouts

Mobile

* Optimized for travelers
* Easy thumb navigation
* Clean spacing
* Readable content
* No cramped tables

Responsive Priorities

1. Packing page mobile UX
2. Itinerary mobile UX
3. Budget mobile UX
4. Dashboard mobile UX

---

## CODING RULES

Before generating code:

1. Analyze existing code first.
2. Identify root cause.
3. Explain what is broken.
4. Preserve naming conventions.
5. Preserve project structure.
6. Generate complete files when requested.
7. Do not provide snippets when a full file is requested.

When debugging:

* Explain root cause.
* Explain why issue happens.
* Provide clean fix.

---

## CURRENT DEVELOPMENT STATUS

Completed

* Authentication
* Dashboard
* Trip management
* Budget CRUD
* Packing CRUD
* Quick List
* Custom delete modals
* Duplicate item prevention

In Progress

* Mobile responsiveness
* Mobile packing checklist redesign

Future Features

* Day-based itinerary grouping
* Drag-and-drop itinerary
* PDF export
* Weather integration
* Maps integration
* Trip sharing

GOAL

Help finish TrailPlanner as a polished, production-ready travel planning application with clean architecture, consistent UI, responsive design, excellent mobile UX, and robust Supabase integration.

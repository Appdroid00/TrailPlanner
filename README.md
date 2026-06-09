# TrailPlanner

TrailPlanner is a travel planning web app built with plain HTML, CSS, and vanilla JavaScript, with Supabase as the backend.

## Stack

- HTML
- CSS
- Vanilla JavaScript
- Supabase
- PostgreSQL

## Pages

- `index.html` - dashboard
- `login.html` - sign in / sign up
- `trip.html` - trip overview and itinerary
- `budget.html` - budget and expense management
- `packing.html` - packing checklist
- `profile.html` - user profile

## Main Features

- Authentication with login and signup
- Dashboard with trip cards and summary stats
- Create, edit, and delete trips
- Trip itinerary management with grouped mobile day sections
- Budget tracking with expenses
- Packing list with packed/unpacked status
- Profile storage for user details and preferences
- Mobile bottom navigation
- Home page mobile nav shows Home, Trips, and Profile only
- Compact responsive modals and mobile-friendly layouts
- App logo shown in the main headers and login screen

## Supabase Tables

### `trips`

- `id`
- `user_id`
- `destination`
- `start_date`
- `end_date`
- `budget`
- `travelers`
- `status`
- `notes`

### `itinerary`

- `id`
- `user_id`
- `trip_id`
- `activity_date`
- `activity_time`
- `title`
- `location`
- `category`
- `completed`
- `notes`

### `expenses`

- `id`
- `user_id`
- `trip_id`
- `expense_date`
- `category`
- `description`
- `amount`

### `packing`

- `id`
- `user_id`
- `trip_id`
- `item_name`
- `category`
- `quantity`
- `packed`

### `packing_library`

- `id`
- `item_name`
- `category`

### `profiles`

- `id`
- `user_id`
- `full_name`
- `email`
- `phone`
- `home_country`
- `preferred_currency`
- `travel_style`
- `default_budget`
- `passport_name`
- `passport_number`
- `emergency_contact`
- `emergency_phone`
- `created_at`
- `updated_at`

## Local Setup

1. Open the project in VS Code.
2. Update the Supabase URL and key in `js/supabase.js` if needed.
3. Run the app with Live Server.
4. Open the site on your phone using the same local network IP.

## UI Notes

- The app is designed for both desktop and phone.
- Buttons use consistent blue and red action styles.
- Delete actions use custom in-app modals instead of browser alerts.
- Mobile layouts keep content readable and scrollable.
- Mobile itinerary items are grouped by trip day for easier scrolling.
- Modal forms use compact spacing on phones to reduce screen height.
- Budget access stays inside the trip pages on mobile.

## Current Status

Completed:

- Auth
- Dashboard
- Trips
- Budget CRUD
- Packing CRUD
- Itinerary CRUD
- Profile page
- Responsive navigation
- Custom delete modals
- Mobile itinerary grouping
- Compact mobile modal forms
- App logo applied across screens

Ongoing:

- Mobile polish
- Layout refinement across screen sizes

## Goal

Build TrailPlanner into a clean, responsive, production-ready travel planner with strong mobile UX and a simple Supabase backend.

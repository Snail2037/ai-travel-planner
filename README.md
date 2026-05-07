# AI Travel Planner

AI Travel Planner is a chat-first trip planning web app for domestic U.S. travel. The idea is simple: instead of manually dragging places into an itinerary, the user tells the app what kind of trip they want, answers a few quick planning questions, and the app builds a day-by-day plan with real restaurants, events, attractions, weather context, budget estimates, and editable activity cards.

The product is inspired by the feeling of working with a travel agent, but with the speed and flexibility of an AI assistant.

## What It Does

The app starts with a large AI trip-builder page where the user can type something like:

```text
Plan a 3-day trip to Chicago
```

Instead of immediately generating a generic itinerary, the app first asks useful follow-up questions:

- Where are you flying from?
- What dates are you traveling?
- How many travelers?
- What are your must-dos?
- What budget range should the plan respect?

Once the user answers, the planner builds a full itinerary. The goal is to make the app feel less like a static form and more like a real planning conversation.

## Current Flow

1. User enters a trip idea on the landing page.
2. The app opens a planning chat and asks for missing details.
3. The user provides dates, origin, travelers, preferences, and budget.
4. The planner creates a U.S.-only itinerary.
5. The server enriches the plan with live API data.
6. The user can review the trip in multiple views:
   - **Itinerary**: day-by-day activity cards
   - **Calendar**: compact time-block schedule
   - **Magazine**: city-guide style summary

## Features

- Domestic U.S. trip planning across all 50 states
- City aliases like NYC, Chicago, Vegas, LA, Miami, Austin, Nashville, and more
- Question-first planning flow
- Day-by-day itinerary generation
- Calendar-style schedule view
- Magazine-style city guide
- Booking readiness status
- “Why this stop?” explanations for each activity
- Swap controls for each stop:
  - cheaper
  - closer
  - more fun
  - indoor
  - later
- Real API source badges:
  - Yelp
  - Ticketmaster
  - Geoapify
  - Local
- Duplicate prevention so the same restaurant, event, or attraction does not repeat across the trip
- Server-side API proxy so private keys never go into browser code

## APIs Used

The app can run without API keys, but it becomes more realistic when keys are present.

- **Yelp Fusion API**: restaurants, bars, nightlife
- **Ticketmaster Discovery API**: comedy shows, concerts, sports, live events
- **Geoapify Places API**: attractions, museums, shopping, parks, points of interest
- **OpenWeatherMap API**: current weather
- **National Weather Service API**: no-key weather fallback for U.S. locations

## Running Locally

This MVP intentionally avoids external frontend dependencies. It uses plain HTML, CSS, browser JavaScript, and a tiny Node server.

```bash
node server.mjs
```

Then open:

```text
http://localhost:4173
```

## Environment Variables

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Then fill in any API keys you want to use:

```bash
TICKETMASTER_API_KEY=
YELP_API_KEY=
GEOAPIFY_API_KEY=
OPENWEATHER_API_KEY=
```

The `.env` file is ignored by Git. Do not commit real API keys.

## Project Structure

```text
.
├── index.html          # Landing page and planner shell
├── styles.css          # Full UI styling
├── app.js              # Frontend state, chat flow, tabs, rendering
├── aiPlanner.js        # Local trip-planning logic and U.S. destination data
├── apiServices.mjs     # Server-side API enrichment calls
├── server.mjs          # Static server and /api/enrich endpoint
├── docs/
│   ├── architecture.md
│   └── api-contract.md
└── .env.example
```

## Why I Built It This Way

The goal was to build a strong MVP before adding a full backend framework. The current version proves the core product experience:

- conversational planning
- structured itinerary generation
- API enrichment
- live weather context
- realistic named places
- editable trip cards

The code is also shaped so it can later move into a more formal full-stack architecture.

## Future Improvements

- Replace the local planner with a real LLM orchestration backend
- Add user accounts and saved trips
- Add real flight and hotel search
- Add map routing between stops
- Add drag-and-drop itinerary editing
- Add persistent trip memory for user preferences
- Port the frontend to Angular
- Build a Spring Boot API gateway and service layer

## Interview Pitch

AI Travel Planner is a chat-first domestic travel planning app. Users describe a trip in natural language, answer a few planning questions, and receive a personalized itinerary with real restaurants, events, attractions, weather, budget context, and editable schedule views. I focused on making the system feel like a real travel planning assistant while keeping the architecture ready for future LLM orchestration and full-stack scaling.

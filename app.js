import { defaultTrip, getCopilotResponse } from "./aiPlanner.js";

const baseTrip = structuredClone(defaultTrip);
let trip = structuredClone(baseTrip);

const landingPage = document.querySelector("#landingPage");
const plannerApp = document.querySelector("#plannerApp");
const landingForm = document.querySelector("#landingForm");
const landingInput = document.querySelector("#landingInput");
const myTripsButton = document.querySelector("#myTripsButton");
const intakeCanvas = document.querySelector("#intakeCanvas");
const intakeActions = document.querySelector("#intakeActions");
const plannerBoard = document.querySelector(".planner-board");
const plannerMeta = document.querySelector(".planner-meta");
const brandSubtitle = document.querySelector("#brandSubtitle");
const briefDates = document.querySelector("#briefDates");
const briefStyle = document.querySelector("#briefStyle");
const briefBudget = document.querySelector("#briefBudget");
const heroTitle = document.querySelector("#heroTitle");
const messages = document.querySelector("#messages");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const dayTabs = document.querySelector("#dayTabs");
const timeline = document.querySelector("#timeline");
const selectedDayTitle = document.querySelector("#selectedDayTitle");
const selectedWeather = document.querySelector("#selectedWeather");
const dailySpend = document.querySelector("#dailySpend");
const routeSummary = document.querySelector("#routeSummary");
const routeTime = document.querySelector("#routeTime");
const signals = document.querySelector("#signals");
const budgetMeter = document.querySelector("#budgetMeter");
const budgetDelta = document.querySelector("#budgetDelta");
const budgetBreakdown = document.querySelector("#budgetBreakdown");
const readinessChip = document.querySelector("#readinessChip");
const boardTitle = document.querySelector("#boardTitle");
let pendingPrompt = "";
let waitingForDetails = false;
let currentView = "Itinerary";
let planningDetails = {
  origin: "",
  dates: "",
  travelers: "",
  budget: ""
};

function money(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

function dailyTotal(day) {
  return day.stops.reduce((sum, stop) => sum + stop.cost, 0);
}

function tripSpend() {
  const fixed = Object.values(trip.fixedCosts).reduce((sum, value) => sum + value, 0);
  const variable = trip.days.reduce((sum, day) => sum + dailyTotal(day), 0);
  return fixed + variable;
}

function renderMessages() {
  messages.scrollTop = messages.scrollHeight;
}

function addMessage(role, text) {
  const bubble = document.createElement("div");
  bubble.className = `message ${role}`;
  bubble.innerHTML = formatMessage(text);
  messages.appendChild(bubble);
  renderMessages();
}

function formatMessage(text) {
  return text
    .split("\n")
    .map((line) => {
      const escaped = escapeHtml(line);
      if (/^\d+\./.test(line.trim())) return `<div class="question-line">${escaped}</div>`;
      if (line.trim().startsWith("•")) return `<div class="bullet-line">${escaped}</div>`;
      return `<p>${escaped}</p>`;
    })
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderTabs() {
  dayTabs.innerHTML = "";
  ["Itinerary", "Calendar", "Magazine"].forEach((label) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `view-tab${label === currentView ? " active" : ""}`;
    button.textContent = label;
    button.addEventListener("click", () => {
      currentView = label;
      render();
    });
    dayTabs.appendChild(button);
  });
}

function renderMainView() {
  if (currentView === "Calendar") {
    renderCalendar();
    return;
  }
  if (currentView === "Magazine") {
    renderMagazine();
    return;
  }
  renderTimeline();
}

function renderTimeline() {
  boardTitle.textContent = "Day-by-day plan";

  timeline.innerHTML = "";
  trip.days.forEach((tripDay, dayIndex) => {
    const section = document.createElement("section");
    section.className = "day-section";
    section.innerHTML = `
      <div class="day-marker"></div>
      <div class="day-content">
        <header class="day-heading">
          <h3>${tripDay.title} <span>${getDayLabel(dayIndex)}</span></h3>
          <span class="activity-count">${tripDay.stops.length} activities</span>
        </header>
        <div class="day-stops">
          ${tripDay.stops.map((stop, stopIndex) => renderStop(stop, stopIndex, dayIndex)).join("")}
        </div>
        <button type="button" class="add-row"><span>＋</span> ADD</button>
      </div>
    `;
    timeline.appendChild(section);
  });
}

function renderStop(stop, index, dayIndex) {
  return `
    <article class="stop" data-day-index="${dayIndex}" data-stop-index="${index}">
      <div class="stop-thumb" data-count="${index + 1}">${iconForStop(stop)}</div>
      <div class="stop-body">
        <div class="stop-meta">
          <span class="stop-type">${typeIcon(stop)}</span>
          <span>${stop.time || "Flexible"}</span>
          ${renderSourceBadges(stop)}
        </div>
        <h4>${escapeHtml(stop.title)}</h4>
        <p>${escapeHtml(stop.notes)}</p>
        <div class="why-line">Why this stop: ${whyThisStop(stop)}</div>
        <div class="swap-row">
          ${["cheaper", "closer", "more fun", "indoor", "later"].map((action) => `<button type="button" data-swap="${action}">${action}</button>`).join("")}
        </div>
      </div>
      <div class="cost">${money(stop.cost || 0)}</div>
    </article>
  `;
}

function renderCalendar() {
  boardTitle.textContent = "Calendar";
  timeline.innerHTML = `
    <section class="calendar-grid">
      ${trip.days.map((day, dayIndex) => `
        <article class="calendar-day">
          <header>
            <strong>${day.title}</strong>
            <span>${getDayLabel(dayIndex)}</span>
          </header>
          ${day.stops.map((stop) => `
            <div class="calendar-block ${calendarClass(stop)}">
              <time>${stop.time || "Flex"}</time>
              <strong>${escapeHtml(stop.title)}</strong>
              <span>${money(stop.cost || 0)}</span>
            </div>
          `).join("")}
        </article>
      `).join("")}
    </section>
  `;
}

function renderMagazine() {
  boardTitle.textContent = `${trip.anchor || trip.city} city guide`;
  const foodStops = stopsByTags(["food", "restaurant"]);
  const nightlifeStops = stopsByTags(["club", "nightlife", "comedy", "shows"]);
  const attractionStops = stopsByTags(["attractions", "museum", "outdoors", "shopping"]);
  timeline.innerHTML = `
    <section class="magazine-grid">
      ${renderGuideCard("Best Neighborhoods", [
        `${trip.anchor} downtown for first-night orientation`,
        nightlifeStops[0]?.title || "Main entertainment district",
        attractionStops[0]?.title || "Waterfront or museum district"
      ])}
      ${renderGuideCard("Food Hit List", foodStops.slice(0, 4).map((stop) => stop.title))}
      ${renderGuideCard("Nightlife Notes", nightlifeStops.slice(0, 4).map((stop) => `${stop.title} — ${stop.notes}`))}
      ${renderGuideCard("Local Tips", [
        "Book the highest-demand dinner before flights",
        "Cluster activities by neighborhood to avoid wasted rideshares",
        "Keep one indoor backup each day for weather or fatigue"
      ])}
      ${renderGuideCard("What To Book Early", [
        nightlifeStops.find((stop) => stop.tags?.includes("Ticketmaster"))?.title || nightlifeStops[0]?.title || "Comedy or show tickets",
        foodStops[0]?.title || "Dinner reservations",
        attractionStops[0]?.title || "Timed-entry attraction tickets"
      ])}
    </section>
  `;
}

function renderGuideCard(title, items) {
  const cleanItems = items.filter(Boolean).slice(0, 5);
  return `
    <article class="guide-card">
      <p class="eyebrow">${title}</p>
      <ul>
        ${cleanItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </article>
  `;
}

function stopsByTags(tags) {
  return trip.days
    .flatMap((day) => day.stops)
    .filter((stop) => tags.some((tag) => (stop.tags || []).join(" ").toLowerCase().includes(tag)));
}

function calendarClass(stop) {
  const tags = (stop.tags || []).join(" ");
  if (tags.includes("food") || tags.includes("restaurant")) return "food";
  if (tags.includes("comedy") || tags.includes("shows") || tags.includes("club")) return "event";
  if (tags.includes("attractions") || tags.includes("museum")) return "place";
  return "base";
}

function iconForStop(stop) {
  const tags = (stop.tags || []).join(" ");
  if (tags.includes("food") || tags.includes("restaurant")) return "⌘";
  if (tags.includes("comedy") || tags.includes("shows")) return "◉";
  if (tags.includes("club") || tags.includes("nightlife")) return "♪";
  if (tags.includes("museum") || tags.includes("attractions")) return "▥";
  if (tags.includes("shopping")) return "◇";
  return "⌖";
}

function typeIcon(stop) {
  const tags = (stop.tags || []).join(" ");
  if (tags.includes("food") || tags.includes("restaurant")) return "☕";
  if (tags.includes("comedy") || tags.includes("shows")) return "◌";
  if (tags.includes("club") || tags.includes("nightlife")) return "♫";
  if (tags.includes("museum") || tags.includes("attractions")) return "▧";
  return "•";
}

function renderSourceBadges(stop) {
  return sourceBadges(stop).map((badge) => `<span class="source-badge ${badge.toLowerCase()}">${badge}</span>`).join("");
}

function sourceBadges(stop) {
  const tags = stop.tags || [];
  if (tags.includes("Yelp")) return ["Yelp"];
  if (tags.includes("Ticketmaster")) return ["Ticketmaster"];
  if (tags.includes("Geoapify")) return ["Geoapify"];
  return ["Local"];
}

function whyThisStop(stop) {
  const tags = (stop.tags || []).join(" ").toLowerCase();
  const reasons = [];
  if (tags.includes("yelp")) reasons.push("live restaurant data");
  if (tags.includes("ticketmaster")) reasons.push("date-aware event data");
  if (tags.includes("geoapify")) reasons.push("nearby place data");
  if (tags.includes("food") || tags.includes("restaurant")) reasons.push("matches your food preferences");
  if (tags.includes("comedy") || tags.includes("shows")) reasons.push("fits your entertainment preferences");
  if (tags.includes("club") || tags.includes("nightlife")) reasons.push("adds nightlife energy");
  if (tags.includes("indoor")) reasons.push("weather-safe backup");
  if ((stop.cost || 0) <= 20) reasons.push("budget-friendly");
  return reasons.slice(0, 3).join(", ") || "balances route flow, cost, and local relevance";
}

function getDayLabel(index) {
  return ["Thu, 11 Jun", "Fri, 12 Jun", "Sat, 13 Jun", "Sun, 14 Jun", "Mon, 15 Jun", "Tue, 16 Jun", "Wed, 17 Jun"][index] || `Day ${index + 1}`;
}

function renderSignals() {
  const day = trip.days[trip.selectedDay];
  signals.innerHTML = day.signals
    .map(([title, text]) => `<div class="signal"><strong>${title}</strong><span>${text}</span></div>`)
    .join("");
}

async function enrichCurrentTrip() {
  try {
    const response = await fetch("/api/enrich", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trip)
    });
    if (!response.ok) return;
    const enrichment = await response.json();
    applyEnrichment(enrichment);
  } catch {
    // Keep the local planner fully usable when APIs or network access are unavailable.
  }
}

function applyEnrichment(enrichment) {
  const day = trip.days[trip.selectedDay];
  const apiSignals = [];
  enrichStopsWithSpecificPlaces(enrichment);
  if (enrichment.weather?.length) {
    const forecast = enrichment.weather[0];
    day.weather = `${forecast.summary}, ${forecast.temperature}`;
    apiSignals.push(["Weather", `${forecast.name}: ${forecast.summary}, ${forecast.temperature}.`]);
  }
  if (enrichment.events?.length) {
    const event = enrichment.events[0];
    apiSignals.push(["Ticketmaster", `${event.name}${event.venue ? ` at ${event.venue}` : ""}.`]);
  }
  if (enrichment.restaurants?.length) {
    const restaurant = enrichment.restaurants[0];
    apiSignals.push(["Yelp", `${restaurant.name}${restaurant.rating ? ` rated ${restaurant.rating}` : ""}.`]);
  }
  if (enrichment.attractions?.length) {
    apiSignals.push(["Geoapify", `${enrichment.attractions[0].name} found near ${trip.anchor}.`]);
  }
  if (apiSignals.length) {
    day.signals = [...apiSignals, ...day.signals].slice(0, 5);
    render();
  }
}

function enrichStopsWithSpecificPlaces(enrichment) {
  const restaurants = [...(enrichment.restaurants || [])];
  const events = [...(enrichment.events || [])];
  const attractions = [...(enrichment.attractions || [])];
  const usedTitles = new Set(trip.days.flatMap((day) => day.stops.map((stop) => normalizeTitle(stop.title))));
  trip.days.forEach((day) => {
    day.stops = day.stops.map((stop) => {
      const tags = (stop.tags || []).join(" ");
      if ((tags.includes("food") || tags.includes("restaurant")) && restaurants.length) {
        const place = takeUnique(restaurants, usedTitles, "name");
        if (!place) return stop;
        return {
          ...stop,
          title: place.name,
          notes: [place.price, place.rating ? `${place.rating} stars` : "", place.address].filter(Boolean).join(" · ") || stop.notes,
          tags: Array.from(new Set([...(stop.tags || []), "Yelp"]))
        };
      }
      if ((tags.includes("comedy") || tags.includes("shows") || tags.includes("nightlife") || tags.includes("club")) && events.length) {
        const event = takeUnique(events, usedTitles, "name");
        if (!event) return stop;
        return {
          ...stop,
          title: event.name,
          notes: [event.venue, event.date, event.time].filter(Boolean).join(" · ") || stop.notes,
          tags: Array.from(new Set([...(stop.tags || []), "Ticketmaster"]))
        };
      }
      if ((tags.includes("attractions") || tags.includes("museum") || tags.includes("shopping") || tags.includes("outdoors")) && attractions.length) {
        const attraction = takeUnique(attractions, usedTitles, "name");
        if (!attraction) return stop;
        return {
          ...stop,
          title: attraction.name,
          notes: attraction.address || stop.notes,
          tags: Array.from(new Set([...(stop.tags || []), "Geoapify"]))
        };
      }
      return stop;
    });
  });
}

function takeUnique(items, usedTitles, key) {
  const index = items.findIndex((item) => !usedTitles.has(normalizeTitle(item[key] || "")));
  if (index === -1) return null;
  const [item] = items.splice(index, 1);
  usedTitles.add(normalizeTitle(item[key] || ""));
  return item;
}

function normalizeTitle(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function renderBudget() {
  const spent = tripSpend();
  const remaining = trip.budget - spent;
  const ratio = Math.min(100, Math.round((spent / trip.budget) * 100));
  budgetMeter.style.width = `${ratio}%`;
  budgetDelta.className = remaining >= 0 ? "positive" : "negative";
  budgetDelta.textContent = `~${money(spent)}`;

  const daily = trip.days.reduce((sum, day) => sum + dailyTotal(day), 0);
  budgetBreakdown.innerHTML = [
    ["Flights", trip.fixedCosts.flight],
    ["Hotels", trip.fixedCosts.hotel],
    ["Transit", trip.fixedCosts.transit],
    ["Food + activities", daily]
  ]
    .map(([label, value]) => `<div class="budget-line"><span>${label}</span><strong>${money(value)}</strong></div>`)
    .join("");
}

function renderReadiness() {
  const missing = [];
  if (!planningDetails.origin) missing.push("origin");
  if (!planningDetails.dates) missing.push("dates");
  if (!planningDetails.travelers) missing.push("travelers");
  if (!planningDetails.budget) missing.push("budget");
  const ready = missing.length === 0;
  readinessChip.className = `chip readiness-chip ${ready ? "ready" : "needs"}`;
  readinessChip.textContent = ready ? "Ready to book" : `Needs ${missing.join("/")}`;
}

function render() {
  const day = trip.days[trip.selectedDay];
  brandSubtitle.textContent = `${trip.city} adaptive plan`;
  briefDates.textContent = `${trip.days.length} days`;
  briefStyle.textContent = trip.style || "Personalized";
  briefBudget.textContent = money(trip.budget);
  heroTitle.textContent = `Plan a ${trip.days.length}-day trip to ${trip.state || trip.city}`;
  selectedDayTitle.textContent = trip.city;
  selectedWeather.textContent = day.weather;
  dailySpend.textContent = `${money(dailyTotal(day))} planned`;
  routeSummary.textContent = day.route;
  routeTime.textContent = day.routeTime;
  renderTabs();
  renderMainView();
  renderSignals();
  renderBudget();
  renderReadiness();
}

function showPlanner() {
  landingPage.classList.add("is-hidden");
  plannerApp.classList.remove("is-hidden");
}

function showIntake() {
  waitingForDetails = true;
  intakeCanvas.classList.remove("is-hidden");
  intakeActions.classList.remove("is-hidden");
  dayTabs.classList.add("is-hidden");
  plannerBoard.classList.add("is-hidden");
  plannerMeta.classList.add("is-hidden");
}

function showItinerary() {
  waitingForDetails = false;
  currentView = "Itinerary";
  intakeCanvas.classList.add("is-hidden");
  intakeActions.classList.add("is-hidden");
  dayTabs.classList.remove("is-hidden");
  plannerBoard.classList.remove("is-hidden");
  plannerMeta.classList.remove("is-hidden");
}

function askPlanningQuestions(prompt) {
  pendingPrompt = prompt;
  showPlanner();
  showIntake();
  messages.innerHTML = "";
  addMessage("user", prompt);
  addMessage(
    "bot",
    `I'd love to help plan this trip. I just need a few quick details before I start searching:\n` +
      `1. Where are you flying from? City or airport is fine.\n` +
      `2. What dates? Include the year if you know it.\n` +
      `3. How many travelers?\n` +
      `4. What are your must-dos? Comedy, clubbing, eating, attractions, museums, sports, beaches?\n` +
      `5. Budget range? I’ll price everything in USD.`
  );
}

function buildTripFromDetails(details) {
  showItinerary();
  planningDetails = parsePlanningDetails(details);
  const combinedPrompt = `${pendingPrompt}. Details: ${details}`;
  addMessage("bot", "Perfect. I’m pulling specific restaurants, shows, attractions, weather, and local itinerary anchors now.");
  applyCopilotResponse(getCopilotResponse(combinedPrompt, trip));
}

function parsePlanningDetails(details) {
  const lower = details.toLowerCase();
  return {
    origin: details.match(/\b([A-Z]{3})\b/)?.[1] || (lower.includes("from") ? "provided" : ""),
    dates: lower.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|next weekend|tomorrow|today)\b/)?.[0] || "",
    travelers: lower.match(/\b\d+\s*(traveler|travelers|people|person)\b/)?.[0] || "",
    budget: details.match(/\$ ?\d[\d,]*/)?.[0] || (lower.includes("budget") || lower.includes("flexible") ? "provided" : "")
  };
}

function applyRainMode() {
  applyCopilotResponse(getCopilotResponse("Swap a day indoors if it rains", trip));
}

function applyBudgetTune() {
  trip.days.forEach((day) => {
    day.stops = day.stops.map((stop) => {
      if (stop.cost > 60) {
        return {
          ...stop,
          cost: stop.cost - 18,
          tags: Array.from(new Set([...stop.tags, "budget-tuned"]))
        };
      }
      return stop;
    });
  });
  render();
}

function applyCopilotResponse(response) {
  const { action } = response;
  if (response.trip) {
    trip = response.trip;
  }
  if (action.type === "replace_day") {
    trip.days[action.dayIndex] = action.day;
    trip.selectedDay = action.dayIndex;
  }
  if (action.type === "tune_budget") {
    applyBudgetTune();
  }
  if (action.type === "add_stop") {
    trip.days[action.dayIndex].stops.splice(2, 0, action.stop);
    trip.selectedDay = action.dayIndex;
  }
  if (action.type === "set_route_preference") {
    const day = trip.days[trip.selectedDay];
    day.route = action.preference === "driving-friendly" ? "Driving-friendly route" : "Transit-first route";
    day.signals = [
      ["Route", `Copilot switched this day to ${action.preference}.`],
      ["Timing", "Stops stay in the same order to preserve reservations."],
      ["Preference", "This preference can be stored in the future memory layer."]
    ];
  }
  addMessage("bot", response.assistantMessage);
  render();
  enrichCurrentTrip();
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage("user", text);
  chatInput.value = "";
  if (waitingForDetails) {
    buildTripFromDetails(text);
    return;
  }
  window.setTimeout(() => applyCopilotResponse(getCopilotResponse(text, trip)), 260);
});

timeline.addEventListener("click", (event) => {
  const button = event.target.closest("[data-swap]");
  if (!button) return;
  const stopCard = button.closest(".stop");
  const dayIndex = Number(stopCard?.dataset.dayIndex);
  const stopIndex = Number(stopCard?.dataset.stopIndex);
  if (Number.isNaN(dayIndex) || Number.isNaN(stopIndex)) return;
  applyStopSwap(dayIndex, stopIndex, button.dataset.swap);
});

function applyStopSwap(dayIndex, stopIndex, swapType) {
  const stop = trip.days[dayIndex].stops[stopIndex];
  const updated = { ...stop, tags: Array.from(new Set([...(stop.tags || []), `swap-${swapType}`])) };
  if (swapType === "cheaper") {
    updated.cost = Math.max(0, Math.round((stop.cost || 0) * 0.72));
    updated.notes = `${stop.notes} Swapped toward a lower-cost option.`;
  }
  if (swapType === "closer") {
    updated.notes = `${stop.notes} Repositioned to favor a tighter route cluster.`;
  }
  if (swapType === "more fun") {
    updated.notes = `${stop.notes} Tuned for higher energy and stronger trip personality.`;
  }
  if (swapType === "indoor") {
    updated.tags = Array.from(new Set([...updated.tags, "indoor"]));
    updated.notes = `${stop.notes} Indoor-friendly backup selected.`;
  }
  if (swapType === "later") {
    updated.time = shiftStopTime(stop.time || "12:00", 1);
    updated.notes = `${stop.notes} Shifted later for a slower pace.`;
  }
  trip.days[dayIndex].stops[stopIndex] = updated;
  addMessage("bot", `Updated ${stop.title}: ${swapType}.`);
  render();
}

function shiftStopTime(time, hours) {
  const [rawHour, rawMinute] = time.split(":").map(Number);
  const hour = Number.isFinite(rawHour) ? rawHour : 12;
  const minute = Number.isFinite(rawMinute) ? rawMinute : 0;
  return `${String(Math.min(hour + hours, 23)).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

landingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = landingInput.value.trim();
  if (!text) return;
  askPlanningQuestions(text);
});

document.querySelectorAll(".prompt-row button").forEach((button) => {
  button.addEventListener("click", () => {
    landingInput.value = button.textContent;
    landingForm.requestSubmit();
  });
});

myTripsButton.addEventListener("click", () => {
  showPlanner();
  showIntake();
});

intakeActions.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    chatInput.value = button.textContent;
    chatForm.requestSubmit();
  });
});

document.querySelector("#rainButton").addEventListener("click", applyRainMode);
document.querySelector("#budgetButton").addEventListener("click", applyBudgetTune);
document.querySelector("#resetButton").addEventListener("click", () => {
  trip = structuredClone(baseTrip);
  messages.innerHTML = "";
  seedConversation();
  render();
});

function seedConversation() {
  addMessage("bot", "Start with a U.S. trip idea, then I’ll ask for the missing details before building the itinerary.");
  addMessage("bot", "Try: “Plan a 3-day trip to Chicago” or “Plan a 4-day Florida trip with clubs and Cuban food.”");
}

seedConversation();
render();
enrichCurrentTrip();

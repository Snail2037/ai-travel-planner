const stateProfiles = [
  ["Alabama", "AL", "Birmingham", "Southern food, civil rights history, music rooms"],
  ["Alaska", "AK", "Anchorage", "glaciers, wildlife, scenic drives"],
  ["Arizona", "AZ", "Phoenix", "desert hikes, resort dining, nightlife"],
  ["Arkansas", "AR", "Little Rock", "riverfront culture, comfort food, trails"],
  ["California", "CA", "Los Angeles", "beaches, studios, food scenes, nightlife"],
  ["Colorado", "CO", "Denver", "mountain access, breweries, comedy, music"],
  ["Connecticut", "CT", "New Haven", "pizza, coastal towns, museums"],
  ["Delaware", "DE", "Rehoboth Beach", "boardwalks, beaches, tax-free shopping"],
  ["Florida", "FL", "Miami", "beaches, clubs, Cuban food, art districts"],
  ["Georgia", "GA", "Atlanta", "music, comedy, food halls, nightlife"],
  ["Hawaii", "HI", "Honolulu", "beaches, local food, hikes, culture"],
  ["Idaho", "ID", "Boise", "outdoors, breweries, downtown food"],
  ["Illinois", "IL", "Chicago", "architecture, comedy, food, clubs"],
  ["Indiana", "IN", "Indianapolis", "sports, food halls, museums"],
  ["Iowa", "IA", "Des Moines", "farm-to-table food, live music, parks"],
  ["Kansas", "KS", "Kansas City", "barbecue, jazz, museums"],
  ["Kentucky", "KY", "Louisville", "bourbon, live music, Southern food"],
  ["Louisiana", "LA", "New Orleans", "jazz, clubs, Creole food, history"],
  ["Maine", "ME", "Portland", "seafood, lighthouses, breweries"],
  ["Maryland", "MD", "Baltimore", "harbor, crab, museums, comedy"],
  ["Massachusetts", "MA", "Boston", "history, comedy, seafood, sports"],
  ["Michigan", "MI", "Detroit", "music, museums, food, nightlife"],
  ["Minnesota", "MN", "Minneapolis", "lakes, comedy, food halls, music"],
  ["Mississippi", "MS", "Jackson", "blues, soul food, civil rights history"],
  ["Missouri", "MO", "St. Louis", "barbecue, blues, museums, sports"],
  ["Montana", "MT", "Bozeman", "mountains, breweries, scenic drives"],
  ["Nebraska", "NE", "Omaha", "steakhouses, music, museums"],
  ["Nevada", "NV", "Las Vegas", "clubs, shows, dining, attractions"],
  ["New Hampshire", "NH", "Portsmouth", "coastal food, breweries, mountain day trips"],
  ["New Jersey", "NJ", "Jersey City", "waterfront views, diners, nightlife"],
  ["New Mexico", "NM", "Santa Fe", "art, chile, adobe architecture"],
  ["New York", "NY", "New York City", "clubs, comedy, Broadway, food"],
  ["North Carolina", "NC", "Charlotte", "food halls, breweries, sports, music"],
  ["North Dakota", "ND", "Fargo", "downtown food, breweries, prairie drives"],
  ["Ohio", "OH", "Columbus", "food, sports, comedy, neighborhoods"],
  ["Oklahoma", "OK", "Oklahoma City", "Western culture, food halls, music"],
  ["Oregon", "OR", "Portland", "food carts, coffee, parks, music"],
  ["Pennsylvania", "PA", "Philadelphia", "history, food, museums, comedy"],
  ["Rhode Island", "RI", "Providence", "coastal food, design, nightlife"],
  ["South Carolina", "SC", "Charleston", "Lowcountry food, beaches, history"],
  ["South Dakota", "SD", "Rapid City", "Badlands, monuments, scenic drives"],
  ["Tennessee", "TN", "Nashville", "live music, hot chicken, nightlife"],
  ["Texas", "TX", "Austin", "BBQ, live music, comedy, nightlife"],
  ["Utah", "UT", "Salt Lake City", "mountains, national parks, food"],
  ["Vermont", "VT", "Burlington", "lakefront, breweries, farm-to-table food"],
  ["Virginia", "VA", "Richmond", "history, food, breweries, art"],
  ["Washington", "WA", "Seattle", "coffee, markets, music, waterfront"],
  ["West Virginia", "WV", "Charleston", "mountain drives, rivers, comfort food"],
  ["Wisconsin", "WI", "Milwaukee", "breweries, lakefront, comedy, food"],
  ["Wyoming", "WY", "Jackson", "national parks, wildlife, mountain dining"]
].map(([state, abbr, anchor, vibe]) => ({ state, abbr, anchor, vibe }));

const preferenceModules = {
  clubbing: {
    label: "clubbing and nightlife",
    tags: ["clubs", "nightlife"],
    stops: [
      ["21:30", "Cocktail lounge warm-up", "Start with a reservation-friendly lounge before the main nightlife block.", 54],
      ["23:00", "Club district night out", "Late-night dancing near rideshare-friendly streets and backup bars.", 82]
    ]
  },
  attractions: {
    label: "major attractions",
    tags: ["attractions", "must-see"],
    stops: [
      ["10:00", "Signature attraction window", "Hit the state's most recognizable local attraction before peak crowds.", 38],
      ["15:00", "Scenic photo stop", "A flexible landmark stop that keeps the day from becoming too rigid.", 12]
    ]
  },
  eating: {
    label: "food and restaurants",
    tags: ["food", "restaurants"],
    stops: [
      ["12:30", "Local lunch crawl", "Build lunch around the state's strongest regional flavors and casual counters.", 46],
      ["19:30", "Reservation-worthy dinner", "One memorable dinner picked for atmosphere, local identity, and budget fit.", 72]
    ]
  },
  comedy: {
    label: "comedy shows",
    tags: ["comedy", "shows"],
    stops: [
      ["18:00", "Pre-show dinner nearby", "Dinner placed close to the venue to avoid a rushed evening.", 44],
      ["20:00", "Comedy club set", "Stand-up or improv night with a late-show backup.", 38]
    ]
  },
  outdoors: {
    label: "outdoors",
    tags: ["outdoors", "scenic"],
    stops: [
      ["09:00", "Morning trail or waterfront walk", "Outdoor block scheduled early for better weather and lighter crowds.", 10],
      ["16:00", "Sunset viewpoint", "Low-cost scenic reset before dinner.", 8]
    ]
  },
  museums: {
    label: "museums and culture",
    tags: ["museum", "culture"],
    stops: [
      ["11:00", "Museum anchor", "A culture block with enough time to actually enjoy it instead of rushing.", 28],
      ["15:30", "Gallery or historic district", "Smaller second stop based on neighborhood flow.", 16]
    ]
  },
  shopping: {
    label: "shopping",
    tags: ["shopping", "local"],
    stops: [
      ["13:30", "Local shops and makers", "Independent shops, markets, or boutiques with snack options nearby.", 35],
      ["17:00", "Neighborhood browse block", "A lighter shopping window before dinner plans.", 24]
    ]
  }
};

const cityPlaceSeeds = {
  Austin: {
    attractions: [["10:00", "Texas State Capitol", "Historic grounds, rotunda, and downtown photo stop.", 0], ["15:00", "Lady Bird Lake Boardwalk", "Skyline views and an easy waterfront walk.", 0]],
    eating: [["12:30", "Franklin Barbecue", "Austin barbecue institution; go early or use a backup nearby.", 36], ["19:30", "Uchi Austin", "Reservation-worthy sushi and modern Japanese dinner.", 95]],
    comedy: [["18:00", "Dinner on East 6th", "Pre-show food near Austin's comedy and music rooms.", 44], ["20:00", "Cap City Comedy Club", "Stand-up night with rotating national and local comics.", 42]],
    clubbing: [["21:30", "Garage cocktail bar", "Downtown warm-up spot with a low-key entrance.", 48], ["23:00", "Barbarella Austin", "Late-night dancing in the Red River district.", 38]]
  },
  Chicago: {
    attractions: [["10:00", "Millennium Park & Cloud Gate", "The Bean, Pritzker Pavilion, and Lurie Garden.", 0], ["15:00", "Willis Tower Skydeck", "The Ledge glass floor and 103rd-floor views.", 44]],
    eating: [["12:30", "Lou Malnati's Pizzeria", "Classic Chicago deep-dish lunch.", 32], ["19:30", "Girl & the Goat", "West Loop dinner anchor with shareable plates.", 92]],
    comedy: [["18:00", "Dinner near Wells Street", "Easy pre-show dinner near Old Town comedy venues.", 42], ["20:00", "The Second City", "Chicago's classic improv and sketch comedy institution.", 55]],
    clubbing: [["21:30", "Three Dots and a Dash", "Tiki cocktail warm-up in River North.", 52], ["23:00", "Smartbar", "Late-night dancing near Wrigleyville.", 38]],
    museums: [["11:00", "The Art Institute of Chicago", "Impressionist galleries, Modern Wing, and Thorne Miniature Rooms.", 32], ["15:30", "Chicago Cultural Center", "Free architecture stop and stained-glass dome.", 0]]
  },
  Miami: {
    attractions: [["10:00", "Wynwood Walls", "Murals, galleries, and street-art blocks.", 18], ["15:00", "South Pointe Park", "Beachfront skyline views at the tip of South Beach.", 0]],
    eating: [["12:30", "Versailles Restaurant", "Cuban classics in Little Havana.", 28], ["19:30", "Mandolin Aegean Bistro", "Garden dinner in the Design District.", 78]],
    clubbing: [["21:30", "Broken Shaker", "Cocktail warm-up in Miami Beach.", 48], ["23:00", "E11EVEN Miami", "High-energy late-night club experience.", 95]]
  },
  "Los Angeles": {
    attractions: [["10:00", "Griffith Observatory", "City views, exhibits, and Hollywood Sign angles.", 0], ["15:00", "Santa Monica Pier", "Beachfront arcade, pier walk, and sunset views.", 15]],
    eating: [["12:30", "Grand Central Market", "Downtown food hall with strong local variety.", 34], ["19:30", "Bestia", "Arts District dinner reservation anchor.", 95]],
    comedy: [["18:00", "Dinner on Sunset Boulevard", "Pre-show meal near the comedy circuit.", 44], ["20:00", "The Comedy Store", "Legendary stand-up club on the Sunset Strip.", 48]]
  },
  "Las Vegas": {
    attractions: [["10:00", "Bellagio Conservatory & Fountains", "Classic Strip stop with easy photo pacing.", 0], ["15:00", "High Roller Observation Wheel", "Big skyline views near LINQ Promenade.", 38]],
    eating: [["12:30", "Block 16 Urban Food Hall", "Casual food hall inside The Cosmopolitan.", 32], ["19:30", "Lotus of Siam", "Beloved Thai dinner off the Strip.", 72]],
    comedy: [["18:00", "Dinner at The LINQ Promenade", "Easy pre-show dining near comedy venues.", 42], ["20:00", "Jimmy Kimmel's Comedy Club", "Stand-up show on the Strip.", 55]],
    clubbing: [["21:30", "The Chandelier", "Cocktail warm-up inside The Cosmopolitan.", 58], ["23:00", "Omnia Nightclub", "Large-scale Strip club night.", 110]]
  },
  "New York City": {
    attractions: [["10:00", "Central Park Bethesda Terrace", "Classic park architecture and walking loop.", 0], ["15:00", "Top of the Rock", "Midtown skyline viewpoint.", 44]],
    eating: [["12:30", "Katz's Delicatessen", "Pastrami lunch on the Lower East Side.", 36], ["19:30", "Via Carota", "West Village dinner anchor.", 90]],
    comedy: [["18:00", "Dinner in Greenwich Village", "Pre-show dinner near the comedy clubs.", 46], ["20:00", "Comedy Cellar", "Iconic basement stand-up room.", 45]]
  }
};

const destinationAliases = {
  nyc: "NY",
  manhattan: "NY",
  brooklyn: "NY",
  la: "CA",
  "los angeles": "CA",
  vegas: "NV",
  "las vegas": "NV",
  miami: "FL",
  chicago: "IL",
  austin: "TX",
  nashville: "TN",
  atlanta: "GA",
  denver: "CO",
  seattle: "WA",
  boston: "MA",
  philly: "PA",
  philadelphia: "PA"
};

const defaultPreferences = ["attractions", "eating", "comedy"];

export const defaultTrip = buildStateTrip({
  profile: findState("Texas"),
  days: 3,
  budget: 1200,
  preferences: defaultPreferences
});

export function planTripFromPrompt(message) {
  const lower = message.toLowerCase();
  const profile = findStateInText(lower);
  const days = getRequestedDays(lower) || 3;
  const budget = getRequestedBudget(lower) || estimateBudget(days, lower);
  const preferences = inferPreferences(lower);

  if (!profile) {
    return {
      assistantMessage: "I only plan domestic U.S. trips now. Tell me one of the 50 states, how many days, and your vibe: clubbing, attractions, eating, comedy shows, outdoors, museums, or shopping.",
      action: { type: "ask_clarifying_question", missing: ["state"] }
    };
  }

  const trip = buildStateTrip({ profile, days, budget, preferences });
  return {
    assistantMessage: `Built a ${days}-day ${profile.state} trip based around ${profile.anchor}, optimized for ${trip.style}.`,
    action: { type: "create_trip", destination: profile.state, days },
    trip
  };
}

export function getCopilotResponse(message, trip) {
  const lower = message.toLowerCase();
  if (isTripCreation(lower) || findStateInText(lower)) {
    return planTripFromPrompt(message);
  }
  if (mentionsInternationalDestination(lower)) {
    return {
      assistantMessage: "This version is domestic U.S. only. Pick any of the 50 states and I’ll build a state-based itinerary.",
      action: { type: "ask_clarifying_question", missing: ["state"] }
    };
  }
  if (lower.includes("rain") || lower.includes("indoor")) {
    return buildRainPlan(trip);
  }
  if (lower.includes("budget") || lower.includes("cheap") || lower.includes("under")) {
    return {
      assistantMessage: "I trimmed the expensive stops and tagged the substitutions so you can see what changed.",
      action: { type: "tune_budget", savingsTarget: 72 }
    };
  }
  if (mentionsFood(lower)) {
    return {
      assistantMessage: "I added a local food stop to the selected day without breaking the route timing.",
      action: {
        type: "add_stop",
        dayIndex: trip.selectedDay,
        stop: {
          time: "16:30",
          title: `${trip.anchor || trip.city} local bite detour`,
          notes: "Personalized food block based on your restaurant preference.",
          tags: ["food", "restaurants", "AI-picked"],
          cost: 32
        }
      }
    };
  }
  if (lower.includes("club") || lower.includes("nightlife")) {
    return addPreferenceStop(trip, "clubbing");
  }
  if (lower.includes("comedy")) {
    return addPreferenceStop(trip, "comedy");
  }
  if (lower.includes("walking") || lower.includes("public transport") || lower.includes("transit") || lower.includes("driving")) {
    return {
      assistantMessage: "I updated the current route preference and surfaced transportation-aware signals.",
      action: { type: "set_route_preference", preference: lower.includes("driving") ? "driving-friendly" : "transit-first" }
    };
  }
  return {
    assistantMessage: "I’m U.S.-only now. Try: “Plan a 4-day Florida trip for clubbing, eating, and attractions” or “Plan 2 days in Illinois with comedy shows and food.”",
    action: { type: "no_op" }
  };
}

function buildStateTrip({ profile, days, budget, preferences }) {
  const selectedPreferences = preferences.length ? preferences : defaultPreferences;
  const style = selectedPreferences.map((key) => preferenceModules[key].label).join(", ");
  return {
    selectedDay: 0,
    city: `${profile.anchor}, ${profile.state}`,
    anchor: profile.anchor,
    state: profile.state,
    stateAbbr: profile.abbr,
    country: "USA",
    style,
    budget,
    fixedCosts: {
      flight: Math.round(budget * 0.32),
      hotel: Math.round(budget * 0.38),
      transit: Math.max(45, days * 24)
    },
    days: buildUniqueDays(profile, days, selectedPreferences)
  };
}

function buildUniqueDays(profile, dayCount, preferences) {
  const usedTitles = new Set();
  return Array.from({ length: dayCount }, (_, index) => {
    const day = buildDay(profile, index, preferences);
    day.stops = day.stops.map((stop) => {
      if (!usedTitles.has(normalizeTitle(stop.title))) {
        usedTitles.add(normalizeTitle(stop.title));
        return stop;
      }
      const replacement = findReplacementStop(profile, stop, usedTitles, index);
      usedTitles.add(normalizeTitle(replacement.title));
      return replacement;
    });
    return day;
  });
}

function buildDay(profile, index, preferences) {
  const dayPreference = preferences[index % preferences.length];
  const secondPreference = preferences[(index + 1) % preferences.length];
  const firstModule = preferenceModules[dayPreference];
  const secondModule = preferenceModules[secondPreference];
  const routeModes = ["downtown loop", "neighborhood hop", "food and show route", "scenic drive"];
  const weather = index % 3 === 1 ? "Possible evening rain" : index % 3 === 2 ? "Warm afternoon" : "Clear planning window";
  const stops = [
    buildArrivalOrMorningStop(profile, index),
    ...moduleStops(firstModule, profile, 0, dayPreference),
    ...moduleStops(secondModule, profile, 1, secondPreference)
  ].slice(0, 4);

  return {
    title: `Day ${index + 1}`,
    area: `${profile.anchor} ${firstModule.label}`,
    weather,
    route: `${profile.anchor} ${routeModes[index % routeModes.length]}`,
    routeTime: `${34 + (index % 4) * 9} min drive/transit`,
    signals: [
      ["Domestic Focus", `${profile.state} plan anchored in ${profile.anchor}; all recommendations stay in the U.S.`],
      ["Preference", `Day weighted toward ${firstModule.label} with ${secondModule.label} layered in.`],
      ["Budget", `Estimated daily activity and dining spend: ${formatMoney(estimateDailyVariable(stops))}.`]
    ],
    stops
  };
}

function findReplacementStop(profile, stop, usedTitles, dayIndex) {
  const tags = stop.tags || [];
  const seed = cityPlaceSeeds[profile.anchor] || {};
  const pools = [
    ...Object.values(seed).flat(),
    ...Object.values(preferenceModules).flatMap((module) => module.stops)
  ];
  const match = pools.find(([time, title]) => {
    const normalized = normalizeTitle(title);
    return !usedTitles.has(normalized) && title !== stop.title;
  });
  if (match) {
    const [time, title, notes, cost] = match;
    return {
      time: shiftTime(time, dayIndex % 3),
      title,
      notes,
      tags,
      cost
    };
  }
  return {
    ...stop,
    title: `${stop.title} alternative`,
    notes: `${stop.notes} Chosen as a unique backup so the itinerary does not repeat places.`
  };
}

function buildArrivalOrMorningStop(profile, index) {
  if (index === 0) {
    return {
      time: "10:00",
      title: `${profile.anchor} arrival + neighborhood orientation`,
      notes: `Start with a low-friction first stop that introduces ${profile.state}'s ${profile.vibe}.`,
      tags: ["arrival", "orientation"],
      cost: 18
    };
  }
  return {
    time: "09:30",
    title: `${profile.anchor} coffee and local reset`,
    notes: "Light morning start before the day’s higher-energy plans.",
    tags: ["coffee", "local"],
    cost: 16
  };
}

function moduleStops(module, profile, offset, preferenceKey) {
  const seeded = cityPlaceSeeds[profile.anchor]?.[preferenceKey] || module.stops;
  return seeded.map(([time, title, notes, cost], index) => ({
    time: offset === 0 ? time : shiftTime(time, index + 1),
    title: title.startsWith(profile.anchor) ? title : title,
    notes,
    tags: module.tags,
    cost
  }));
}

function addPreferenceStop(trip, preference) {
  const module = preferenceModules[preference];
  const [time, title, notes, cost] = module.stops[module.stops.length - 1];
  return {
    assistantMessage: `I added a ${module.label} block to the selected day.`,
    action: {
      type: "add_stop",
      dayIndex: trip.selectedDay,
      stop: {
        time,
        title: `${trip.anchor || trip.city} ${title}`,
        notes,
        tags: [...module.tags, "AI-picked"],
        cost
      }
    }
  };
}

function findStateInText(lower) {
  const alias = Object.entries(destinationAliases).find(([name]) => new RegExp(`\\b${name}\\b`).test(lower));
  if (alias) return findState(alias[1]);
  return stateProfiles.find((profile) => {
    const state = profile.state.toLowerCase();
    const abbr = profile.abbr.toLowerCase();
    const anchor = profile.anchor.toLowerCase();
    return lower.includes(state) || lower.includes(anchor) || new RegExp(`\\b${abbr}\\b`).test(lower);
  });
}

function findState(name) {
  const lower = name.toLowerCase();
  return stateProfiles.find((profile) => profile.state.toLowerCase() === lower || profile.abbr.toLowerCase() === lower);
}

function getRequestedDays(lower) {
  return Number(lower.match(/(\d+)[-\s]?(day|days)/)?.[1]) || null;
}

function getRequestedBudget(lower) {
  return Number(lower.match(/\$?(\d{3,5})/)?.[1]) || null;
}

function estimateBudget(days, lower) {
  const daily = lower.includes("luxury") || lower.includes("nice") ? 420 : lower.includes("budget") || lower.includes("cheap") ? 220 : 310;
  return Math.max(500, days * daily);
}

function inferPreferences(lower) {
  const preferences = [];
  if (lower.includes("club") || lower.includes("nightlife") || lower.includes("bar")) preferences.push("clubbing");
  if (lower.includes("attraction") || lower.includes("sightseeing") || lower.includes("landmark")) preferences.push("attractions");
  if (mentionsFood(lower)) preferences.push("eating");
  if (lower.includes("comedy") || lower.includes("stand-up") || lower.includes("standup")) preferences.push("comedy");
  if (lower.includes("outdoor") || lower.includes("hike") || lower.includes("beach") || lower.includes("nature")) preferences.push("outdoors");
  if (lower.includes("museum") || lower.includes("art") || lower.includes("history")) preferences.push("museums");
  if (lower.includes("shopping") || lower.includes("shop")) preferences.push("shopping");
  return [...new Set(preferences)];
}

function mentionsFood(lower) {
  return lower.includes("food") || lower.includes("eating") || lower.includes("restaurant") || lower.includes("dinner") || lower.includes("brunch");
}

function mentionsInternationalDestination(lower) {
  return ["tokyo", "paris", "seoul", "london", "italy", "japan", "france", "korea", "europe"].some((place) => lower.includes(place));
}

function isTripCreation(lower) {
  return lower.includes("plan") || lower.includes("build") || lower.includes("create") || lower.includes("trip to") || lower.includes("going to");
}

function buildRainPlan(trip) {
  const dayIndex = Math.min(1, trip.days.length - 1);
  const place = trip.anchor || trip.city || "your destination";
  return {
    assistantMessage: `I moved Day ${dayIndex + 1} into an indoor-friendly version around ${place}, preserving ${trip.style || "your preferences"}.`,
    action: {
      type: "replace_day",
      dayIndex,
      day: {
        title: `Day ${dayIndex + 1}`,
        area: `${place} indoor attractions + food`,
        weather: "Rain adaptation active",
        route: "Indoor fallback route",
        routeTime: "42 min drive/transit",
        signals: [
          ["Weather", "Outdoor blocks replaced with restaurants, museums, shows, and covered districts."],
          ["Domestic Focus", "The replan stays within the selected U.S. state."],
          ["Copilot", "Reduced exposed walking while preserving the original preference mix."]
        ],
        stops: [
          {
            time: "10:00",
            title: `${place} brunch or coffee start`,
            notes: "Weather-safe morning with flexible pacing.",
            tags: ["food", "indoor"],
            cost: 34
          },
          {
            time: "12:30",
            title: "Museum or indoor attraction",
            notes: "A rain-proof anchor stop with nearby alternatives.",
            tags: ["attractions", "indoor"],
            cost: 36
          },
          {
            time: "16:00",
            title: "Local shops or food hall",
            notes: "Covered browsing and snacks without needing a long transfer.",
            tags: ["shopping", "food"],
            cost: 42
          },
          {
            time: "20:00",
            title: "Comedy show or live set",
            notes: "Evening entertainment that works well in bad weather.",
            tags: ["comedy", "nightlife"],
            cost: 48
          }
        ]
      }
    }
  };
}

function shiftTime(time, hours) {
  const [hour, minute] = time.split(":").map(Number);
  return `${String(Math.min(hour + hours, 23)).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function estimateDailyVariable(stops) {
  return stops.reduce((sum, stop) => sum + stop.cost, 0);
}

function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

function normalizeTitle(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

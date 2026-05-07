const stateCoordinates = {
  AL: [33.5186, -86.8104],
  AK: [61.2176, -149.8997],
  AZ: [33.4484, -112.074],
  AR: [34.7465, -92.2896],
  CA: [34.0522, -118.2437],
  CO: [39.7392, -104.9903],
  CT: [41.3083, -72.9279],
  DE: [38.7209, -75.076],
  FL: [25.7617, -80.1918],
  GA: [33.749, -84.388],
  HI: [21.3099, -157.8581],
  ID: [43.615, -116.2023],
  IL: [41.8781, -87.6298],
  IN: [39.7684, -86.1581],
  IA: [41.5868, -93.625],
  KS: [39.0997, -94.5786],
  KY: [38.2527, -85.7585],
  LA: [29.9511, -90.0715],
  ME: [43.6591, -70.2568],
  MD: [39.2904, -76.6122],
  MA: [42.3601, -71.0589],
  MI: [42.3314, -83.0458],
  MN: [44.9778, -93.265],
  MS: [32.2988, -90.1848],
  MO: [38.627, -90.1994],
  MT: [45.677, -111.0429],
  NE: [41.2565, -95.9345],
  NV: [36.1699, -115.1398],
  NH: [43.0718, -70.7626],
  NJ: [40.7178, -74.0431],
  NM: [35.687, -105.9378],
  NY: [40.7128, -74.006],
  NC: [35.2271, -80.8431],
  ND: [46.8772, -96.7898],
  OH: [39.9612, -82.9988],
  OK: [35.4676, -97.5164],
  OR: [45.5152, -122.6784],
  PA: [39.9526, -75.1652],
  RI: [41.824, -71.4128],
  SC: [32.7765, -79.9311],
  SD: [44.0805, -103.231],
  TN: [36.1627, -86.7816],
  TX: [30.2672, -97.7431],
  UT: [40.7608, -111.891],
  VT: [44.4759, -73.2121],
  VA: [37.5407, -77.436],
  WA: [47.6062, -122.3321],
  WV: [38.3498, -81.6326],
  WI: [43.0389, -87.9065],
  WY: [43.4799, -110.7624]
};

export async function enrichTrip(trip, env = process.env) {
  const [lat, lon] = stateCoordinates[trip.stateAbbr] || stateCoordinates.TX;
  const location = trip.anchor || trip.city;
  const [weather, restaurants, events, attractions] = await Promise.all([
    fetchWeather(lat, lon, env.OPENWEATHER_API_KEY),
    fetchYelp(location, trip.stateAbbr, env.YELP_API_KEY),
    fetchTicketmaster(location, trip.stateAbbr, env.TICKETMASTER_API_KEY),
    fetchGeoapify(lat, lon, env.GEOAPIFY_API_KEY)
  ]);

  return {
    weather,
    restaurants,
    events,
    attractions,
    providers: {
      weather: env.OPENWEATHER_API_KEY ? "OpenWeatherMap" : "National Weather Service",
      restaurants: env.YELP_API_KEY ? "Yelp" : "mock",
      events: env.TICKETMASTER_API_KEY ? "Ticketmaster" : "mock",
      attractions: env.GEOAPIFY_API_KEY ? "Geoapify" : "mock"
    }
  };
}

async function fetchWeather(lat, lon, openWeatherApiKey) {
  if (openWeatherApiKey) {
    const openWeather = await fetchOpenWeather(lat, lon, openWeatherApiKey);
    if (openWeather.length) return openWeather;
  }
  return fetchNationalWeatherService(lat, lon);
}

async function fetchOpenWeather(lat, lon, apiKey) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    units: "imperial",
    appid: apiKey
  });
  try {
    const json = await fetchJson(`https://api.openweathermap.org/data/2.5/weather?${params}`);
    return [
      {
        name: "Current",
        summary: json.weather?.[0]?.description || "Current weather",
        temperature: `${Math.round(json.main?.temp)} F`
      }
    ];
  } catch {
    return [];
  }
}

async function fetchNationalWeatherService(lat, lon) {
  try {
    const point = await fetchJson(`https://api.weather.gov/points/${lat},${lon}`, {
      headers: { "User-Agent": "TravelPlannerMVP/0.1" }
    });
    const forecastUrl = point?.properties?.forecast;
    if (!forecastUrl) throw new Error("Missing forecast URL");
    const forecast = await fetchJson(forecastUrl, {
      headers: { "User-Agent": "TravelPlannerMVP/0.1" }
    });
    return (forecast?.properties?.periods || []).slice(0, 3).map((period) => ({
      name: period.name,
      summary: period.shortForecast,
      temperature: `${period.temperature} ${period.temperatureUnit}`
    }));
  } catch {
    return [
      { name: "Today", summary: "Weather unavailable; keep one indoor backup.", temperature: "N/A" }
    ];
  }
}

async function fetchYelp(location, stateAbbr, apiKey) {
  if (!apiKey) return [];
  const params = new URLSearchParams({
    location: `${location}, ${stateAbbr}`,
    categories: "restaurants,bars,nightlife",
    limit: "5",
    sort_by: "best_match"
  });
  try {
    const json = await fetchJson(`https://api.yelp.com/v3/businesses/search?${params}`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    return (json.businesses || []).map((business) => ({
      name: business.name,
      rating: business.rating,
      price: business.price || "",
      url: business.url,
      address: business.location?.display_address?.join(", ") || ""
    }));
  } catch {
    return [];
  }
}

async function fetchTicketmaster(location, stateAbbr, apiKey) {
  if (!apiKey) return [];
  const params = new URLSearchParams({
    apikey: apiKey,
    countryCode: "US",
    stateCode: stateAbbr,
    city: location,
    size: "5",
    sort: "date,asc"
  });
  try {
    const json = await fetchJson(`https://app.ticketmaster.com/discovery/v2/events.json?${params}`);
    return (json._embedded?.events || []).map((event) => ({
      name: event.name,
      date: event.dates?.start?.localDate || "",
      time: event.dates?.start?.localTime || "",
      url: event.url,
      venue: event._embedded?.venues?.[0]?.name || ""
    }));
  } catch {
    return [];
  }
}

async function fetchGeoapify(lat, lon, apiKey) {
  if (!apiKey) return [];
  const params = new URLSearchParams({
    categories: "tourism,tourism.sights,entertainment,museum,leisure.park,commercial,commercial.shopping_mall,catering.restaurant",
    filter: `circle:${lon},${lat},25000`,
    bias: `proximity:${lon},${lat}`,
    limit: "12",
    apiKey
  });
  try {
    const json = await fetchJson(`https://api.geoapify.com/v2/places?${params}`);
    return (json.features || []).map((feature) => ({
      name: feature.properties?.name || feature.properties?.address_line1 || "Local attraction",
      address: feature.properties?.formatted || "",
      categories: feature.properties?.categories || []
    }));
  } catch {
    return [];
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

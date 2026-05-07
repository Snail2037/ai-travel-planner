# API Contract Draft

## Send Chat Message

`POST /api/trips/{tripId}/chat/messages`

Request:

```json
{
  "message": "Plan a 4-day Florida trip for clubbing, eating, and attractions",
  "clientContext": {
    "selectedDay": 1,
    "countryScope": "USA"
  }
}
```

Response:

```json
{
  "assistantMessage": "Built a 4-day Florida trip based around Miami, optimized for clubbing, food, and attractions.",
  "action": {
    "type": "create_trip",
    "destination": "Florida",
    "days": 4,
    "confidence": 0.91
  },
  "trip": {
    "id": "trip_florida_2026",
    "country": "USA",
    "state": "Florida",
    "anchor": "Miami",
    "budget": 1240,
    "days": []
  }
}
```

Allowed action types:

```text
create_trip
replace_day
tune_budget
add_stop
set_route_preference
ask_clarifying_question
no_op
```

## Reoptimize Itinerary

`POST /api/trips/{tripId}/reoptimize`

Request:

```json
{
  "trigger": "weather_change",
  "constraints": {
    "preserveFoodStops": true,
    "maxWalkingMinutes": 35,
    "dailyBudgetRemaining": 170
  }
}
```

## Trip Memory

`PATCH /api/users/{userId}/travel-memory`

Request:

```json
{
  "preferences": [
    {
      "key": "food_style",
      "value": "street_food_over_fine_dining",
      "source": "explicit_user_feedback"
    }
  ]
}
```

## Real-Time Events

`POST /api/events/travel`

Request:

```json
{
  "type": "flight_delay",
  "tripId": "trip_tokyo_2026",
  "severity": "medium",
  "payload": {
    "flightNumber": "JL005",
    "delayMinutes": 55
  }
}
```

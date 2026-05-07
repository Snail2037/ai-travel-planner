# Travel Copilot Architecture

## Goal

Travel Copilot is a chat-driven trip planning platform that turns natural language into structured itinerary actions. The MVP in this repository proves the user experience first. The production version should split the system into Angular, Spring Boot APIs, LLM orchestration, and event-driven real-time updates.

## Target System

```text
Angular Web App
  -> Spring Boot API Gateway
    -> Chat Service
    -> Itinerary Service
    -> Recommendation Service
    -> Real-Time Event Service
  -> PostgreSQL
  -> Redis
  -> S3-compatible asset storage
  -> External APIs: LLM provider, weather, maps, flights
```

## Core Flow

1. User sends a chat message.
2. Chat Service loads trip state, user preferences, and active constraints.
3. LLM returns a structured command such as `update_itinerary`, `ask_clarifying_question`, or `reoptimize_day`.
4. Itinerary Service validates the command against budget, opening hours, travel time, and user constraints.
5. The response returns both assistant text and the updated itinerary snapshot.

## Service Responsibilities

Chat Service:
Converts user messages into safe structured operations. It owns prompts, tool schemas, conversation state, and clarification logic.

Itinerary Service:
Owns trips, days, stops, route timing, budget totals, and edit history.

Recommendation Service:
Ranks places using hybrid logic: rules for budget, distance, hours, and dietary constraints; ML or embedding-based similarity for personalization.

Real-Time Event Service:
Consumes weather, flight, traffic, and crowd events. Emits itinerary impact alerts and suggested replans.

Memory Layer:
Stores long-term preferences such as food style, pace, hotel patterns, walking tolerance, and disliked activities.

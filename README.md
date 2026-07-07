# JourneyPlanner Front End

Next.js App Router MVP for a travel planning experience based on the provided concept:
- Trip listing and management
- Timeline itinerary view
- Flights and lodging side panels
- Modal forms for adding/editing data

## Stack
- Next.js (App Router) + TypeScript
- Bootstrap + Bootstrap Icons

## Run
```bash
npm install
npm run dev
```

Set your API base URL in `.env.local` if needed:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
API_BASE_URL=http://localhost:5000
```

## API Integration
The app expects a .NET Web API with these endpoints:
- `GET /api/trips`
- `POST /api/trips`
- `PUT /api/trips/{tripId}`
- `DELETE /api/trips/{tripId}`
- `GET /api/trips/{tripId}`
- `POST /api/trips/{tripId}/events`
- `DELETE /api/trips/{tripId}/events/{eventId}`
- `POST /api/trips/{tripId}/flights`
- `DELETE /api/trips/{tripId}/flights/{flightId}`
- `POST /api/trips/{tripId}/lodgings`
- `DELETE /api/trips/{tripId}/lodgings/{lodgingId}`

When the API is unavailable during development, server fetches fall back to mock data so the UI still renders.

## Server and Client Components
- React Server Components:
  - `app/page.tsx` and `app/trips/[tripId]/page.tsx` fetch itinerary data from the API.
  - `components/trips/app-sidebar.tsx` and `components/trips/timeline.tsx` render static/data-driven layout.
- Client Components:
  - `components/trips/trip-directory-client.tsx` handles create/edit/delete trip actions.
  - `components/trips/trip-page-actions.tsx` and `components/trips/event-form-modal.tsx` handle interactive modal forms.
  - `components/trips/resource-manager.tsx` handles add/remove flight and lodging interactions.
  - `components/trips/delete-entity-button.tsx` handles in-place delete actions.

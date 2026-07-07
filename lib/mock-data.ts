import { TripDetail, TripSummary } from "./types";

export const mockTrips: TripSummary[] = [
  {
    id: "japan-adventure-2024",
    title: "Japan Adventure 2024",
    description: "Spring trip across Tokyo and Kyoto with temples, food and neighborhoods.",
    destination: "Tokyo & Kyoto",
    startDate: "2024-03-15",
    endDate: "2024-04-02",
    emoji: "\ud83c\uddef\ud83c\uddf5"
  },
  {
    id: "italy-summer-tour",
    title: "Italy Summer Tour",
    description: "Venice, Florence and Rome with museum passes and train hops.",
    destination: "Italy",
    startDate: "2024-06-10",
    endDate: "2024-06-22",
    emoji: "\ud83c\uddee\ud83c\uddf9"
  },
  {
    id: "london-weekend",
    title: "London Weekend",
    description: "Quick city break around Notting Hill and Shoreditch.",
    destination: "London, UK",
    startDate: "2024-09-20",
    endDate: "2024-09-24",
    emoji: "\ud83c\uddec\ud83c\udde7"
  }
];

export const mockTripDetails: Record<string, TripDetail> = {
  "japan-adventure-2024": {
    ...mockTrips[0],
    notes: "Reserve local train passes at least 72 hours before departure.",
    travelers: [
      { id: "alex", name: "Alex Carter" },
      { id: "maya", name: "Maya Lee" }
    ],
    events: [
      {
        id: "e1",
        type: "flight",
        title: "Flight Arrives",
        date: "2024-03-15",
        startTime: "15:30",
        location: "SFO-NRT",
        bookingCode: "353-38",
        tags: ["Arrival"],
        imageUrl:
          "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=70"
      },
      {
        id: "e2",
        type: "lodging",
        title: "Check-in",
        date: "2024-03-15",
        startTime: "16:30",
        location: "Hotel Gracery Shinjuku",
        bookingCode: "JP451",
        tags: ["Hotel"],
        imageUrl:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=70"
      },
      {
        id: "e3",
        type: "activity",
        title: "Dinner",
        date: "2024-03-15",
        startTime: "19:00",
        location: "Shinjuku",
        tags: ["Tickets booked"]
      },
      {
        id: "e4",
        type: "activity",
        title: "Senso-ji Temple",
        date: "2024-03-16",
        startTime: "10:00",
        location: "Asakusa, Tokyo",
        tags: ["Tickets booked"],
        imageUrl:
          "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=400&q=70"
      },
      {
        id: "e5",
        type: "activity",
        title: "Lunch",
        date: "2024-03-16",
        startTime: "13:00",
        location: "Asakusa district",
        tags: ["Tickets booked"]
      },
      {
        id: "e6",
        type: "activity",
        title: "Tokyo Skytree",
        date: "2024-03-16",
        startTime: "15:00",
        location: "Sumida",
        tags: ["Tickets booked"],
        imageUrl:
          "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=400&q=70"
      }
    ],
    flights: [
      {
        id: "f1",
        route: "SFO \u2192 NRT",
        airline: "JL11",
        flightNumber: "JL11",
        date: "2024-03-15",
        seat: "353-38",
        confirmationCode: "NRT3538"
      },
      {
        id: "f2",
        route: "KIX \u2192 SFO",
        airline: "JL12",
        flightNumber: "JL12",
        date: "2024-03-16",
        seat: "12",
        confirmationCode: "KIX12"
      }
    ],
    lodgings: [
      {
        id: "l1",
        name: "Hotel Gracery Shinjuku",
        address: "Kabukicho, Tokyo",
        startDate: "2024-03-15",
        endDate: "2024-03-19",
        nights: 4,
        confirmationCode: "JP4519"
      },
      {
        id: "l2",
        name: "Ryokan Kyoto",
        address: "Gion, Kyoto",
        startDate: "2024-03-19",
        endDate: "2024-03-22",
        nights: 3,
        confirmationCode: "JP4519"
      }
    ],
    documents: [
      { id: "d1", title: "Passport", icon: "bi-passport" },
      { id: "d2", title: "Insurance", icon: "bi-shield-check" }
    ]
  },
  "italy-summer-tour": {
    ...mockTrips[1],
    notes: "Buy Florence museum pass by June 1st.",
    travelers: [{ id: "alex", name: "Alex Carter" }],
    events: [],
    flights: [],
    lodgings: [],
    documents: [{ id: "d3", title: "Passport", icon: "bi-passport" }]
  },
  "london-weekend": {
    ...mockTrips[2],
    notes: "Use contactless card for tube.",
    travelers: [{ id: "maya", name: "Maya Lee" }],
    events: [],
    flights: [],
    lodgings: [],
    documents: [{ id: "d4", title: "Passport", icon: "bi-passport" }]
  }
};


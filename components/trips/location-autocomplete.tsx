"use client";

import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "@/lib/google-maps-loader";

export interface LocationSelection {
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  googlePlaceId: string | null;
}

interface LocationAutocompleteProps {
  id: string;
  value: string;
  placeholder?: string;
  onTextChange: (value: string) => void;
  onPlaceSelect: (selection: LocationSelection) => void;
}

export function LocationAutocomplete({
  id,
  value,
  placeholder,
  onTextChange,
  onPlaceSelect
}: LocationAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<google.maps.places.PlaceAutocompleteElement | null>(null);
  const onTextChangeRef = useRef(onTextChange);
  const onPlaceSelectRef = useRef(onPlaceSelect);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onTextChangeRef.current = onTextChange;
    onPlaceSelectRef.current = onPlaceSelect;
  });

  useEffect(() => {
    let cancelled = false;

    loadGoogleMaps()
      .then(() => {
        if (cancelled || !containerRef.current) {
          return;
        }

        const element = new google.maps.places.PlaceAutocompleteElement();
        element.id = id;
        element.className = "form-control jp-place-autocomplete";
        element.style.colorScheme = "light";
        if (placeholder) {
          element.placeholder = placeholder;
        }

        element.addEventListener("input", () => {
          onTextChangeRef.current(element.value);
        });

        element.addEventListener("gmp-select", (event: Event) => {
          void (async () => {
            const { placePrediction } = event as google.maps.places.PlacePredictionSelectEvent;
            const place = placePrediction.toPlace();
            await place.fetchFields({ fields: ["displayName", "formattedAddress", "location", "id"] });

            const address = place.formattedAddress ?? place.displayName ?? "";
            onTextChangeRef.current(address);
            onPlaceSelectRef.current({
              name: place.displayName ?? "",
              address,
              latitude: place.location ? place.location.lat() : null,
              longitude: place.location ? place.location.lng() : null,
              googlePlaceId: place.id ?? null
            });
          })();
        });

        containerRef.current.appendChild(element);
        elementRef.current = element;
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load Google Maps.");
        }
      });

    return () => {
      cancelled = true;
      elementRef.current?.remove();
      elementRef.current = null;
    };
  }, [id, placeholder]);

  useEffect(() => {
    if (elementRef.current && elementRef.current.value !== value) {
      elementRef.current.value = value;
    }
  }, [value]);

  if (error) {
    return (
      <input
        id={id}
        className="form-control"
        value={value}
        placeholder={placeholder}
        onChange={(input) => onTextChange(input.target.value)}
      />
    );
  }

  return <div ref={containerRef} />;
}

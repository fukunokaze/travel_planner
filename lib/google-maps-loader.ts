"use client";

let loaderPromise: Promise<void> | null = null;

export function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser."));
  }

  if (window.google?.maps?.places?.PlaceAutocompleteElement) {
    return Promise.resolve();
  }

  if (loaderPromise) {
    return loaderPromise;
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return Promise.reject(new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not configured."));
  }

  loaderPromise = new Promise((resolve, reject) => {
    const callbackName = "__jpGoogleMapsLoaded";

    (window as typeof window & Record<string, () => void>)[callbackName] = () => {
      resolve();
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&loading=async&callback=${callbackName}`;
    script.async = true;
    script.onerror = () => {
      loaderPromise = null;
      reject(new Error("Failed to load the Google Maps script."));
    };

    document.head.appendChild(script);
  });

  return loaderPromise;
}

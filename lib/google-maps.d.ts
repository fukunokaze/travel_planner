declare namespace google.maps {
  class LatLng {
    lat(): number;
    lng(): number;
  }

  namespace places {
    interface Place {
      id: string | null;
      displayName: string | null;
      formattedAddress: string | null;
      location: google.maps.LatLng | null;
      fetchFields(options: { fields: string[] }): Promise<void>;
    }

    interface PlacePrediction {
      toPlace(): Place;
    }

    interface PlacePredictionSelectEvent extends Event {
      placePrediction: PlacePrediction;
    }

    class PlaceAutocompleteElement extends HTMLElement {
      constructor(options?: { includedRegionCodes?: string[] });
      value: string;
      placeholder: string;
      disabled: boolean;
    }
  }
}

interface Window {
  google?: typeof google;
}

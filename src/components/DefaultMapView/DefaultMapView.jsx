import { GoogleMap } from "@react-google-maps/api";
import { useMemo, useState } from "react";
import  PlacesAutoComplete  from "../PlacesAutoComplete/PlacesAutoComplete";

  function DefaultMapView() {
    const [locationData, setLocationData] = useState({});
  const center = useMemo(() => ({ lat: 18.52043, lng: 73.856743 }), []);
  return (
    <>
    <div className="places-container">
      <PlacesAutoComplete setLocationData={setLocationData} />
    </div>
    <p> {locationData.lat && locationData.lng ? (
          `Latitude: ${locationData.lat}, Longitude: ${locationData.lng}`
          
        ) : (
          console.log("placeId" + locationData.placeName)
        )}</p>
    <GoogleMap
      mapContainerClassName="map-container"
      center={center}
      zoom={10}
      ></GoogleMap>
     </>
  );
};

export {DefaultMapView};

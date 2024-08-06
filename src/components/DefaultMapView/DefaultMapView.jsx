import { GoogleMap } from "@react-google-maps/api";
import { useMemo, useState } from "react";
import  PlacesAutoComplete  from "../PlacesAutoComplete/PlacesAutoComplete";

  function DefaultMapView() {
    const [selectedPlace,setSelectedPlace] = useState({});
  const center = useMemo(() => ({ lat: 18.52043, lng: 73.856743 }), []);
  return (
    <>
    <div className="places-container">
      <PlacesAutoComplete setSelectedPlace={selectedPlace} />
    </div>
    
    <GoogleMap
      mapContainerClassName="map-container"
      center={center}
      zoom={10}
      ></GoogleMap>
     </>
  );
};

export {DefaultMapView};

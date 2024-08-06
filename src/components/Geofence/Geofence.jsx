import React from "react";
import { useState, useEffect, useRef } from "react";
import { route as defaultRoute } from "./data";
import { GoogleMap, Polygon, Polyline } from "@react-google-maps/api";
import "./Geofence.css"
import PlacesAutoComplete from "../PlacesAutoComplete/PlacesAutoComplete";

export const Geofence = () => {
  let color = ['#FF0000', '#4286f4', '#ffff00', '#ff00b2', '#bb00ff', '#00ffff', '#26ff00', '#00ff87'];
  const [route, setRoute] = useState(defaultRoute);

  const [polygonPath, setPolygonPath] = useState();
  const [center, setCenter] = useState({ lat: 18.518056173723338, lng: 73.85410993103704 });
  const [selectedPlace, setSelectedPlace] = useState();

  const mapRef = useRef(null);

  const polygonOptions = {
    strokeColor: color[1],
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color[0],
    fillOpacity: 0.35,
    editable: true,
    isFunctionalZoomEnabled: true
  };


  const renderCoordinate = (paths) => {
    const bounds = new window.google.maps.LatLngBounds();
    setRoute([]);
    let position = 0;
    paths.map((location) => {
      if (position % 10 === 0) {

        setRoute((prev) => [...prev, { "lat": location[1], "lng": location[0] }]);
        bounds.extend({ "lat": location[1], "lng": location[0] })
      }

      position++
      return true;
    });
    if (mapRef.current) {
      console.log("inside bound")
      mapRef.current.fitBounds(bounds);
    }
  }



  const renderToMaps = (selectedPlace) => {
    if (!selectedPlace) return

    const geojson = selectedPlace?.geojson;
    console.log("Inside renderTomaps selectedPlace: ", selectedPlace);

    setCenter({ lat: Number(selectedPlace?.lat), lng: Number(selectedPlace?.lon) })
    if (geojson.type === "MultiPolygon") {
      renderCoordinate(geojson.coordinates[0][0]);
    } else if (geojson.type === "Polygon") {
      renderCoordinate(geojson.coordinates[0]);
    } else {
      alert('option.geojson.type: MultiPolygon & Polygon');
    }
  }



  const loadPath = () => {

    const path = route;
    const bufferDistance = 0.00008;
    const x = path.map(
      (obj) =>
        new google.maps.LatLng(
          obj.lat + bufferDistance,
          obj.lng - bufferDistance
        )
    );
    path.reverse();

    const coordinates = [...x];
    const areaBoundary = coordinates.map((obj) => {
      return { lat: obj.lat(), lng: obj.lng() };
    });

    setPolygonPath(areaBoundary);

  }
  useEffect(() => {
    if (selectedPlace) {
      renderToMaps(selectedPlace)
    }
  }, [selectedPlace])
  useEffect(() => {

    loadPath()
  }, [route])


  return (
    <div>
  
      <PlacesAutoComplete setSelectedPlace={(data) => { setSelectedPlace(data) }} />
      <GoogleMap
        mapContainerClassName="map-container"
        center={center}
        zoom={17}
        onLoad={(map) => mapRef.current = map}
      >
        <Polyline path={route} />
        <Polygon path={polygonPath} options={polygonOptions} />
      </GoogleMap>
    </div>

  );
}


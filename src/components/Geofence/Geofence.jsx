import React from "react";
import { useState, useEffect, useRef } from "react";
import { route as defaultRoute } from "./data";
import { GoogleMap, Polygon, Polyline } from "@react-google-maps/api";
import "./Geofence.css"
import  PlacesAutoComplete  from "../PlacesAutoComplete/PlacesAutoComplete";

export const Geofence = () => {
  let color = ['#FF0000', '#4286f4', '#ffff00', '#ff00b2', '#bb00ff', '#00ffff', '#26ff00', '#00ff87'];
  const [route, setRoute] = useState(defaultRoute);

  const [polygonPath, setPolygonPath] = useState();
  const [center, setCenter] = useState({ lat: 18.518056173723338, lng: 73.85410993103704 });
  const [locationData, setLocationData] = useState(null);

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

  const _handleSearch = (locationData) => {
    console.log("latlng: ", locationData)

    const apiKey = 'b8568cb9afc64fad861a69edbddb2658';

    const geometry = 'geometry_1000';
    const place =  "ludhiana"
    
    // const url = `https://nominatim.openstreetmap.org/reverse?lat=${locationData?.lat}&lon=${locationData?.lon}&polygon_geojson=1&format=json`
    // const url = `https://nominatim.openstreetmap.org/search.php?q=st.%20john%27s&polygon_geojson=1&format=json` 
    // const url = `https://nominatim.openstreetmap.org/search.php?q=ludhiana&polygon_geojson=1&format=json` 
    const url = `https://nominatim.openstreetmap.org/search.php?q=${place}&polygon_geojson=1&format=json`; 

    // const url = `https://api.geoapify.com/v1/boundaries/part-of?lon=${locationData?.lon}&lat=${locationData?.lat}&geometry=${geometry}&apiKey=${apiKey}`;
    // https://api.geoapify.com/v1/boundaries/part-of?lon=12.789931425885811&lat=51.16772168907602&geometry=geometry_1000&apiKey=YOUR_API_KEY
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log("api", data)
        // const filteredLocationData = data?.features.filter((place)=> (place?.properties.place_id === locationData?.placeId))
        // console.log(locationData  , ": location data")
        // const filteredLocationData = data?.features.filter((place)=> (place?.properties.lat === locationData?.lat && place?.properties.lon))

        // console.log("filterLocation", filteredLocationData);
        // renderToMaps(filteredLocationData[0].geometry)
        const coordinatesData = data[0].geojson;
        console.log(coordinatesData)
        renderToMaps(coordinatesData);
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });

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
    // const mapRef = useRef<google.maps.Map | null>(null);



    const renderToMaps = (options) => {

      console.log(options, "optionsoptions");

      setCenter({ lat: Number(locationData?.lat), lng: Number(locationData?.lon) })
      if (options?.type === "MultiPolygon") {
        renderCoordinate(options?.coordinates[0][0]);
      } else if (options?.type === "Polygon") {
        renderCoordinate(options?.coordinates[0]);

      } else {
        alert('option.geojson.type: MultiPolygon & Polygon');
      }
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
    _handleSearch(locationData)
    loadPath()
  }, [locationData, route])


  return (
    <div>
      {/* <AsyncTypeahead
        className="TypeHead"
        align="justify"
        labelKey="display_name"
        onSearch={(query) => _handleSearch(query)}
        onChange={(query) => { renderToMaps(query) }}
        options={options}
        placeholder="Search city, Here"
        renderMenuItemChildren={(option, props, index) => (
          <div>
            <span>{option.display_name}</span>
          </div>
        )} /> */}
      <PlacesAutoComplete setLocationData={setLocationData} />
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


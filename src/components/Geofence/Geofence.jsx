import React from "react";
import { useState, useEffect, useRef } from "react";
import { route as defaultRoute } from "./data";
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { GoogleMap, Polygon, Polyline } from "@react-google-maps/api";
import "./Geofence.css"

export const Geofence = () => {
  let color = ['#FF0000', '#4286f4', '#ffff00', '#ff00b2', '#bb00ff', '#00ffff', '#26ff00', '#00ff87'];
  const [route, setRoute] = useState(defaultRoute);

  const [polygonPath, setPolygonPath] = useState();
  const [options, setOptions] = useState();
  const [center , setCenter] = useState({ lat: 18.518056173723338, lng: 73.85410993103704 });
  const [timeOut, setTimeOut] = useState(null);
 
  const mapRef = useRef(null);

  const polygonOptions = {
    strokeColor: color[1],
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color[0],
    fillOpacity: 0.35,
    editable: true,
    isFunctionalZoomEnabled:true
  };
  const renderCoordinate = (paths) => {
    const bounds = new window.google.maps.LatLngBounds();
    setRoute([]);
    let position = 0;
    paths.map((location) => {
      if (position % 10 === 0) {
       
        setRoute((prev) => [...prev, { "lat": location[1], "lng": location[0] }]);
        bounds.extend( { "lat": location[1], "lng": location[0] })
      }
     
      position++
      return true;
    });
    if(mapRef.current){
      console.log("inside bound")
    mapRef.current.fitBounds(bounds);
    }
  }
  // const mapRef = useRef<google.maps.Map | null>(null);

    
    
  const renderToMaps = (options) => {
   
    console.log(options,"optionsoptions");
    options.forEach((option) => {
      setCenter({lat: Number(option.lat) , lng:Number(option.lon) })
      if (option.geojson.type === "MultiPolygon") {
        renderCoordinate(option.geojson.coordinates[0][0]);
      } else if (option.geojson.type === "Polygon") {
        renderCoordinate(option.geojson.coordinates[0]);
     
      } else {
        alert('option.geojson.type: MultiPolygon & Polygon');
      }
    })
   
  }




  const _handleSearch = (query) => {
    if (!query) {
      return
    }
    if (timeOut) {
      clearTimeout(timeOut);
      setTimeOut(undefined);
    }
    const newTimeOut = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search.php?q=${query}&polygon_geojson=1&format=json`)
        .then(resp => resp.json())
        .then(data => {
          let filterGeoJsonType = data.filter(function (data) {
            return data.geojson.type === "MultiPolygon" || data.geojson.type === "Polygon"
          });
          setOptions(filterGeoJsonType);
        });
    }, 1000)
    setTimeOut(newTimeOut);
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
  useEffect(()=>{
   
    loadPath()
  },[route])


  return (
    <div>
      <AsyncTypeahead
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
        )} />
       <GoogleMap
        mapContainerClassName="map-container"
        center={center}
        zoom={17}
        onLoad={(map)=> mapRef.current = map}
      >
        <Polyline path={route} />
        <Polygon path={polygonPath} options={polygonOptions} />
      </GoogleMap> 
    </div>

  );
}


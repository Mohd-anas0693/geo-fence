
import React, { useState, useCallback } from 'react'
import "./PlacesAutoComplete.css"
import debounce from 'lodash/debounce'

function PlacesAutoComplete({setSelectedPlace}) {

  const [value, setValue] = useState("");
  // const [timeoutId, setTimeoutId] = useState();
  const [places, setPlaces] = useState([]);
  
  
  const debouncedHandleChange = useCallback(debounce((value) => {
    console.log("value", value);
    if(!value || value === "") return;
    
    const url = `https://nominatim.openstreetmap.org/search.php?q=${value}&polygon_geojson=1&format=json`
    fetch(url)
      .then(response => { 
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);

        }
        return response.json();
      })
      .then(data => {
        console.log("data", data)
        const searchedPlaces = data.filter((newPlace) => (newPlace?.geojson.type === "MultiPolygon" || newPlace?.geojson.type === "Polygon" ));
        console.log("search: ", searchedPlaces);
        setPlaces(searchedPlaces);
        console.log("api", data);
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }, 700), []);

  const handleChange = (e) => {
    setValue(e.target.value);
    debouncedHandleChange(e.target.value);
  };
  const  handleSelect =  (place_id)=>{
  if(places.length > 0  && place_id){
    const selectedPlace = places.find(place =>  place.place_id === place_id);
    if(selectedPlace){
      setSelectedPlace(selectedPlace);
    }
  }
  }
  return (
    <>
      <label className='lab' />
      <input value={value} placeholder="Enter Search" type='`text' onChange={handleChange} />
      <label />
      <ul>
        {places.length > 0 ? places.map((place) => (<option value={place.display_name} key={place.place_id} onClick={ ()=> handleSelect(place.place_id)  }>
          {place.display_name +  "placeid : " + place.place_id}
        </option>)) : <p>no Data found</p>}
      </ul>

    </>
  )
}

export default PlacesAutoComplete
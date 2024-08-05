import { GoogleMap } from "@react-google-maps/api";
import { useMemo, useState } from "react";
import usePlacesAutocomplete , {getGeocode, getLatLng} from "use-places-autocomplete";
import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,

} from "@reach/combobox"

  function DefaultMapView() {
    const [select, setSelected] = useState({});
  const center = useMemo(() => ({ lat: 18.52043, lng: 73.856743 }), []);
  return (
    <>
    <div className="places-container">
      <PlacesAutoComplete setSelected={setSelected} />
    </div>
    <p> {select.lat && select.lng ? (
          `Latitude: ${select.lat}, Longitude: ${select.lng}`
        ) : (
          'No location selected'
        )}</p>
    <GoogleMap
      mapContainerClassName="map-container"
      center={center}
      zoom={10}
      ></GoogleMap>
     </>
  );
};
const PlacesAutoComplete =({setSelected})=>{
  const {ready,value,setValue,suggestions:{status,data}, clearSuggestions} = usePlacesAutocomplete();
  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    const results = await  getGeocode({address});
    const {lat,lng} = await getLatLng(results[0]);
    console.log({lat,lng})
    setSelected({lat:lat,lng:lng})
  }
  return <>
  <Combobox onSelect={handleSelect}>
x    <ComboboxInput 
    value={value}
     onChange={(e)=> setValue(e.target.value)} 
     disabled={!ready} 
     className="combox-input" 
     placeholder="Search an address" />
      <ComboboxPopover>
        <ComboboxList>
        {status === "OK" && data.map(({place_id,description}) => (<ComboboxOption key={place_id} value={description}/>))}
        </ComboboxList>
      </ComboboxPopover>
  </Combobox>
  </>
}
export {DefaultMapView};

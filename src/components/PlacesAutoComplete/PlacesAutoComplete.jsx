import usePlacesAutocomplete , {getGeocode, getLatLng} from "use-places-autocomplete";
import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,

} from "@reach/combobox";

function  PlacesAutoComplete({setLocationData}){
  const {ready,value,setValue,suggestions:{status,data}, clearSuggestions} = usePlacesAutocomplete();
  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    const results = await  getGeocode({address});
    console.log("results" , results[0].geometry.location.lat())
    setLocationData()
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
export default PlacesAutoComplete;
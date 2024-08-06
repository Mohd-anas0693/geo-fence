const apiKey = 'b8568cb9afc64fad861a69edbddb2658';
const lon = -52.768681;
const lat = 47.542759;
const geometry = 'geometry_1000';
const url = `https://api.geoapify.com/v1/boundaries/part-of?lon=${lon}&lat=${lat}&geometry=${geometry}&apiKey=${apiKey}`;

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    console.log(data?.features[0].geometry);
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });
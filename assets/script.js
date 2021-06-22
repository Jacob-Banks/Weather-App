let key = "858ff639949c4324e1914d7e8c4fbe7e";
let lat = "";
let lon = "";
function currentForecast() {
  fetch("https:/api.openweathermap.org/data/2.5/weather?q=Ottawa&appid=" + key)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      lat = data.coord.lat;
      lon = data.coord.lon;
      getDaily();
    })
    .catch(function () {
      // catch any errors
    });
}

function getDaily() {
  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=current,minutely,hourly&units=metric&appid=" +
      key
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    })
    .catch(function () {
      // catch any errors
    });
}
weatherForecast();
//API key}

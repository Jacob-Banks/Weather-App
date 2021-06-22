const key = "858ff639949c4324e1914d7e8c4fbe7e";
let lat = "";
let lon = "";
let city = "";
let icon = "";
let day = "";
let saveCity = "";
function currentForecast(city) {
  fetch(
    "https:/api.openweathermap.org/data/2.5/weather/?q=" +
      city +
      "&appid=" +
      key
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      lat = data.coord.lat;
      lon = data.coord.lon;
      icon = data.weather[0].icon;
      day = new Date(data.dt * 1000).toLocaleDateString("en-US");
      $(".card-group").html(" ");
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

      $("#nowCity").html(
        `${city} ${day} <img src='http://openweathermap.org/img/w/${icon}.png'/>`
      );
      $("#temp").html(`Temp: ${data.daily[0].temp.day} C`);
      $("#wind").html(`wind: ${data.daily[0].wind_speed} KPH`);
      $("#humidity").html(`humidity: ${data.daily[0].humidity} %`);
      $("#uv").html(`uv: ${data.daily[0].uvi} C`);
      for (let i = 1; i < 6; i++) {
        icon = data.daily[i].weather[0].icon;
        day = new Date(data.daily[i].dt * 1000).toLocaleDateString("en-US");
        $(".card-group").append(`
        <div class="card text-light cardback mx-2">
            <div class="card-body">
                <h5 class="card-title">${day}</h5>
                <p class="card-text my-3"><img src='http://openweathermap.org/img/w/${icon}.png'/></p>
                <p class="card-text my-3 ">Temp: ${data.daily[i].temp.day} C</p>
                <p class="card-text my-3">wind: ${data.daily[i].wind_speed} KPH</p>
                <p class="card-text my-3">humidity: ${data.daily[0].humidity} %</p>
                
            </div>
        </div>`);
      }
    })
    .catch(function () {
      // catch any errors
    });
}

function fillSaveCities() {
  saveCity = JSON.parse(localStorage.getItem("cities"));
  if (saveCity == null) saveCity = [];

  //create and add li(s)aka scores
  $("#list").html(" ");
  for (let i = 0; i < saveCity.length; i++) {
    $("#list").append(
      `<li class="list-group-item list-group-item-secondary text-center my-2 font-weight-bold mt-3">
    ${saveCity[i]}
    </li>`
    );
  }
}

fillSaveCities();

$("#get-city").on("click", function () {
  city = $("#city").val();
  saveCity.push(city);
  localStorage.setItem("cities", JSON.stringify(saveCity));
  currentForecast(city);
  fillSaveCities();
  console.log(saveCity);
});

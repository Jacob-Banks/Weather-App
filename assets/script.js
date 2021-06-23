const key = "858ff639949c4324e1914d7e8c4fbe7e";
let lat = "";
let lon = "";
let city = "";
let icon = "";
let day = "";
let bg = "";
let saveCity = [];

function currentForecast(city) {
  fetch(
    "https:/api.openweathermap.org/data/2.5/weather/?q=" +
      city +
      "&appid=" +
      key
  ).then(function (response) {
    // request was successful
    if (response.ok) {
      response.json().then(function (data) {
        //get coordinates for daily forcast
        lat = data.coord.lat;
        lon = data.coord.lon;
        icon = data.weather[0].icon;
        // convert to human date
        day = new Date(data.dt * 1000).toLocaleDateString("en-US");
        // clear previous 5 day forecast
        $(".card-group").html(" ");

        getDaily(city);
      });
    } else {
      // if not successful,  remove array/storage from redirect to homepage
      saveCity.pop();
      localStorage.setItem("cities", JSON.stringify(saveCity));
      console.log(saveCity);

      alert("sorry we can't find what you're looking for");
      location.reload();
    }
  });
}

function getDaily(city) {
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
      //set uv background
      if (data.daily[0].uvi < 3) {
        bg = "green";
      }
      if (data.daily[0].uvi > 3) {
        bg = "yellow";
      }

      if (data.daily[0].uvi > 5) {
        bg = "orange";
      }

      if (data.daily[0].uvi > 7) {
        bg = "red";
      }

      if (data.daily[0].uvi > 10) {
        bg = "purpul";
      }

      // fill todays weather

      $("#nowCity").html(
        `${city} ${day} <img src='http://openweathermap.org/img/w/${icon}.png'/>`
      );
      // set todays temp
      $("#temp").html(`Temp: ${data.daily[0].temp.day} C`);
      // set wind
      $("#wind").html(`Wind: ${data.daily[0].wind_speed} KPH`);
      // set humidity
      $("#humidity").html(`Humidity: ${data.daily[0].humidity} %`);
      // set uv
      $("#uv").html(`UV Index: <span id="uvI">${data.daily[0].uvi}</span>`);

      // fill 5 day forecast
      $("#uvI").css("background-color", bg);
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
                <p class="card-text my-3">humidity: ${data.daily[i].humidity} %</p>                
            </div>
        </div>`);
      }
    })
    .catch(function () {
      // catch any errors
    });
}
// geet save citues from local
function fillSaveCities() {
  saveCity = JSON.parse(localStorage.getItem("cities"));
  if (saveCity == null) saveCity = [];

  //   clear list so
  $("#list").html(" ");
  //create and add li(s)aka cities
  for (let i = 0; i < saveCity.length; i++) {
    $("#list").append(
      `<li id="${i}"class="list-group-item list-group-item-secondary text-center my-2 font-weight-bold mt-3">
    ${saveCity[i]}
    </li>`
    );
  }
}
// fill cities on load
fillSaveCities();
// default city
currentForecast("paris");
//get list city click
$(".list-group-item-secondary").on("click", function () {
  aCity = $(this).html().trim();
  currentForecast(aCity);
});
// capture button click

$("#get-city").on("click", function () {
  //get value from input field
  city = $("#city").val();
  // if city has been used dont put in storage
  if (saveCity.includes(city)) {
    currentForecast(city);
  } else {
    // put city into storage display new city
    saveCity.push(city);
    localStorage.setItem("cities", JSON.stringify(saveCity));
    currentForecast(city);
  }
  //fill list
  fillSaveCities();
  console.log(saveCity);
});

let form = document.getElementById("form");
function handleForm(event) {
  event.preventDefault();
  city = $("#city").val();
  if (saveCity.includes(city)) {
    currentForecast(city);
  } else {
    // put city into storage display new city
    saveCity.push(city);
    localStorage.setItem("cities", JSON.stringify(saveCity));
    currentForecast(city);
  }
  //fill list
  fillSaveCities();
  console.log(saveCity);
}
form.addEventListener("submit", handleForm);

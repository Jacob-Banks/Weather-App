const key = "858ff639949c4324e1914d7e8c4fbe7e";
let lat = "";
let lon = "";
let city = "";
let icon = "";
let day = "";
let bg = "";
let saveCity = [];
let form = document.getElementById("form");

// get selected cities current weatherr data
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
      // if not successful,  remove item from array/storage and redirect to homepage
      saveCity.shift();
      //length control
      if (saveCity.length > 10) {
        saveCity.pop;
      }
      // send to storage
      localStorage.setItem("cities", JSON.stringify(saveCity));

      alert("sorry we can't find what you're looking for");
      location.reload();
    }
  });
}

// display current day forecast and 5 day forecast
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
      $("#uvI").css("background-color", bg);

      // fill 5 day forecast
      for (let i = 1; i < 6; i++) {
        //get icon
        icon = data.daily[i].weather[0].icon;
        //get human date not seconds from 1970
        day = new Date(data.daily[i].dt * 1000).toLocaleDateString("en-US");
        $(".card-group").append(`
        <div class="card text-light cardback mx-2">
            <div class="card-body">
                <h5 class="card-title">${day}</h5>
                <p class="card-text my-3 font-weight-bold"><img src='http://openweathermap.org/img/w/${icon}.png'/></p>
                <p class="card-text my-3 font-weight-bold">Temp: ${data.daily[i].temp.day} C</p>
                <p class="card-text my-3 font-weight-bold">Wind: ${data.daily[i].wind_speed} KPH</p>
                <p class="card-text my-3 font-weight-bold">Humidity: ${data.daily[i].humidity} %</p>                
            </div>
        </div>`);
      }
    })
    .catch(function () {
      // catch any errors
    });
}

// get save cities from local and fill ul under search with previous city searches
function fillSaveCities() {
  saveCity = JSON.parse(localStorage.getItem("cities"));
  if (saveCity == null) saveCity = [];

  //   clear list to prevent appending to current li
  $("#list").html(" ");
  //create and add li(s)aka cities
  for (let i = 0; i < saveCity.length; i++) {
    $("#list").append(
      `<li id="${i}"class="list-group-item list-group-item-secondary text-center my-2 font-weight-bold mt-3">
    ${saveCity[i]}
    </li>`
    );
  }
  //attach event listener on saved city li, launch that forecast
  $(".list-group-item-secondary").on("click", function () {
    aCity = $(this).html().trim();
    currentForecast(aCity);
  });
}

function handleForm(event) {
  //stop enter key from refreshing page
  event.preventDefault();
  // assign text input to var
  city = $("#city").val();
  // make it have proper caps
  titleCase(city);
  // if saved city search contains this city display forecasst
  if (saveCity.includes(city)) {
    currentForecast(city);
  } else {
    // put city into storage display forecasst
    saveCity.unshift(city);
    localStorage.setItem("cities", JSON.stringify(saveCity));
    currentForecast(city);
  }
  //update saved city search list
  fillSaveCities();
}

//  make entries first letters uppercase
function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return (city = splitStr.join(" "));
}
/////////////////////////////////
///                           ///
///      Functions end        ///
///                           ///
/////////////////////////////////

// fill cities on load
fillSaveCities();
// default city
currentForecast("Paris");

// capture submit button click

$("#get-city").on("click", function () {
  //get value from input field
  city = $("#city").val();
  titleCase(city);
  // if city has been used dont put in storage display forecasst
  if (saveCity.includes(city)) {
    currentForecast(city);
  } else {
    // put city into storage display new city display forecasst
    saveCity.unshift(city);
    localStorage.setItem("cities", JSON.stringify(saveCity));
    currentForecast(city);
  }
  //update searched city list
  fillSaveCities();
});

form.addEventListener("submit", handleForm);

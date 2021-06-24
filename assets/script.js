const key = "&appid=858ff639949c4324e1914d7e8c4fbe7e"; // my openweather key
const apiCity = "https:/api.openweathermap.org/data/2.5/weather/?q="; // go to city forecast
const apiCoord = "https://api.openweathermap.org/data/2.5/onecall?"; // go to 7 day forecast by coords
let lat, lon, city, icon, day, bg;
let saveCity = [];
let form = document.getElementById("form");

// get selected cities current weatherr data
function currentForecast(city) {
  fetch(apiCity + city + key).then(function (response) {
    // request was successful
    if (response.ok) {
      response.json().then(function (data) {
        //get coordinates for daily forcast
        console.log(data);
        lat = data.coord.lat;
        lon = data.coord.lon;
        icon = data.weather[0].icon;

        // clear previous 5 day forecast
        $(".card-group").html(" ");
        //launch 5day forcast
        getDaily(city);
      });
    } else {
      // if not successful,  remove item from array/storage and redirect to homepage
      saveCity.shift();
      // send to storage
      localStorage.setItem("cities", JSON.stringify(saveCity));
      // let user know of failure
      alert("sorry we can't find what you're looking for");
      location.reload();
    }
  });
}
// display current day forecast and 5 day forecast
function getDaily(city) {
  fetch(apiCoord + "&lat=" + lat + "&lon=" + lon + "&units=metric" + key)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //set uv background
      if (data.current.uvi < 3) {
        bg = "green";
      }
      if (data.current.uvi > 3) {
        bg = "yellow";
        $("#uvI").css("color", "black"); //couldnt read
      }
      if (data.current.uvi > 5) {
        bg = "orange";
        $("#uvI").css("color", "white");
      }
      if (data.current.uvi > 7) {
        bg = "red";
      }
      if (data.current.uvi > 10) {
        bg = "purple";
      }
      // get icon
      icon = data.current.weather[0].icon;
      //get date
      day = new Date().toLocaleDateString("en-US", {
        timeZone: `${data.timezone}`,
      });
      // fill current weather
      $("#nowCity").html(
        `${city} ${day} <img src='http://openweathermap.org/img/w/${icon}.png'/>`
      );
      // set todays temp
      $("#temp").html(`Temp: ${data.current.temp} C`);
      // set wind
      $("#wind").html(`Wind: ${data.current.wind_speed} KPH`);
      // set humidity
      $("#humidity").html(`Humidity: ${data.current.humidity} %`);
      // set uv
      $("#uv").html(`UV Index: <span id="uvI">${data.current.uvi}</span>`);
      $("#uvI").css("background-color", bg);

      // fill 5 day forecast
      for (let i = 1; i < 6; i++) {
        //get icon
        icon = data.daily[i].weather[0].icon;
        //get human date not seconds from 1970
        day = new Date(data.daily[i].dt * 1000).toLocaleDateString("en-US", {
          timeZone: `${data.timezone}`,
        });
        //fill 5 day cards
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
      // catch errors
      alert("sry pls make sure you have a internet connection ");
      window.reload();
    });
}

// get save cities from local and fill ul under search with previous city searches
function fillSaveCities() {
  saveCity = JSON.parse(localStorage.getItem("cities"));
  if (saveCity == null) saveCity = [];
  //limit length
  if (saveCity.length > 10) {
    saveCity.pop();
  }
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
    city = $(this).html().trim();
    currentForecast(city);
  });
}

function handleForm(event) {
  //stop enter key from refreshing page
  event.preventDefault();
  // assign text input to var
  city = $("#city").val();
  // make it have proper caps
  titleCase(city);
  // if saved city list contains this city display forecasst
  if (saveCity.includes(city)) {
    currentForecast(city);
  } else {
    // put city into storage display forecasst add to city list
    saveCity.unshift(city);
    localStorage.setItem("cities", JSON.stringify(saveCity));
    currentForecast(city);
  }
  //update saved city search list
  fillSaveCities();
}

//  make entries first letters uppercase
function titleCase(str) {
  // mAKE LOWER CASE look for spaces split array
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // Assign it back to the array with first letter in caps
    splitStr[i] =
      //
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

// default city lauch users city forecast
$.ajax({
  url: "https://geolocation-db.com/jsonp",
  jsonpCallback: "callback",
  dataType: "jsonp",
  success: function (location) {
    city = location.city;
    lat = location.latitude;
    lon = location.longitude;
    getDaily(city);
  }, // if cant find user location
  error: function () {
    currentForecast("Paris");
  },
});

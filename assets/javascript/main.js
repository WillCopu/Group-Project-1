// Initialize Firebase
var config = {
  apiKey1: "AIzaSyA9yjY7N1vw0qzYUcPt-59j0VBIwzdh0Wk",
  authDomain: "group-1-2bbc2.firebaseapp.com",
  databaseURL: "https://group-1-2bbc2.firebaseio.com",
  projectId: "group-1-2bbc2",
  storageBucket: "",
  messagingSenderId: "597724055602"
};
firebase.initializeApp(config);

$("#submit").on("click", function() {
  var userInput = $("#cityInput")
    .val()
    .trim();
  console.log(userInput);

  // This is our API keys
  var APIKey1 = "&APPID=43c7b0d44b7655fca26cc7c25917a267";
  var APIKey2 = "EG1HKMAR4NVCHEYDK1UE4OGRFJ35FJCJDKSQZMN0AKJ32S1G";
  var clientID = "AMBFJBBKSIVAOZFW020NJ2KTVH153HVJYIKKYJISKNSEKAN5";

  // Here we are building the URL we need to query the database for OpenWeatherMaps
  var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${userInput},USA${APIKey1}`;
  var queryURL2 = `https://api.foursquare.com/v2/venues/explore?near=${userInput}&limit=10&venuePhotos=1&section=topPicks&client_id=${clientID}&client_secret=${APIKey2}&v=20180721`; 
  // We then created an AJAX call
 

  // <div class="row">
  //               <div class="col-md-12 text-center">
  //                   <div id="pic"></div>
  //                   <p>Venue 1: <span id="venue"></span></p>
  //                   <p>Location: <span id="location"></span></p>
  //                   <p>Category: <span id="category"></span></p>
                    
                    
  //               </div>
  //           </div>



  $.ajax({
    url: queryURL2,
    method: "GET"
  }).then(function(results) {
    console.log(queryURL2);
    console.log(results.response.groups[0].items[0].venue.name);
    console.log(results);
    let items = results.response.groups[0].items
    for (let i = 0; i < items.length; i++) {
    //dynamically creates the html with our ajax response
    let venue = items[i].venue;
  
    
    let $row = $("<div>").addClass("row venue");
    let $col = $("<div>").addClass("col-md-12 text-center").attr("id", `venue${i}`);
    let $name = $("<p>").text(`Venue ${i + 1}: ${venue.name}`);
    let $location = $("<p>").text(`Location: ${venue.location.address}`);
    let $category = $("<p>").text(`Category: ${venue.categories[0].name}`);
    
    





  
   

    //fetching pictures for each venue with another ajax call inside an ajax call
    $col.append($name,$location,$category).appendTo($row);
    $("#topPicks").append($row);

    
    $.ajax({
      url: `https://api.foursquare.com/v2/venues/${venue.id}/photos?client_id=${clientID}&client_secret=${APIKey2}&v=20180721`,
      method: "GET"
    }).then(function(picRes) {
      console.log("results", picRes);
      let photo = picRes.response.photos.items[0];
      let  $pic = $("<div>").html(`<img src="${photo.prefix}200x200${photo.suffix}">`);
      $(`#venue${i}`).prepend($pic);
      console.log($(`#venue[${i}]`));
      
      
    });
   
      
    
  }
    
  });

  //ajax call for weather API
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(queryURL);
    console.log(response.list[0].dt_txt);
    console.log(moment(response.list[0].dt_txt).format("l"));
    console.log(response);
    //filling in the blanks of the different weather blocks
 
    //dates
    $("#date1").text(moment(response.list[0].dt_txt).format("l"));
    $("#date2").text(moment(response.list[8].dt_txt).format("l"));
    $("#date3").text(moment(response.list[16].dt_txt).format("l"));
    $("#date4").text(moment(response.list[24].dt_txt).format("l"));
    $("#date5").text(moment(response.list[32].dt_txt).format("l"));

    //city
    $(".city").text("Weather for: "+ response.city.name);

    //weather icon
    $("#weatherIcon1").html("<img src='http://openweathermap.org/img/w/"+response.list[0].weather[0].icon+".png'>");
    $("#weatherIcon2").html("<img src='http://openweathermap.org/img/w/"+response.list[8].weather[0].icon+".png'>");
    $("#weatherIcon3").html("<img src='http://openweathermap.org/img/w/"+response.list[16].weather[0].icon+".png'>");
    $("#weatherIcon4").html("<img src='http://openweathermap.org/img/w/"+response.list[24].weather[0].icon+".png'>");
    $("#weatherIcon5").html("<img src='http://openweathermap.org/img/w/"+response.list[32].weather[0].icon+".png'>");

    //weather description
    $("#weatherDescription1").text(response.list[0].weather[0].description);
    $("#weatherDescription2").text(response.list[8].weather[0].description);
    $("#weatherDescription3").text(response.list[16].weather[0].description);
    $("#weatherDescription4").text(response.list[24].weather[0].description);
    $("#weatherDescription5").text(response.list[32].weather[0].description);

    //temperatures
    $("#tempMax1").html(Math.round((((response.list[0].main.temp_max)-273.15)*1.8)+32)+"&deg;");
    $("#tempMax2").html(Math.round((((response.list[8].main.temp_max)-273.15)*1.8)+32)+"&deg;");
    $("#tempMax3").html(Math.round((((response.list[16].main.temp_max)-273.15)*1.8)+32)+"&deg;");
    $("#tempMax4").html(Math.round((((response.list[24].main.temp_max)-273.15)*1.8)+32)+"&deg;");
    $("#tempMax5").html(Math.round((((response.list[32].main.temp_max)-273.15)*1.8)+32)+"&deg;");

    $(".timeNow").text(moment().format('LT'));
    //humidity
    $("#humidity1").html(response.list[0].main.humidity+"%");
    $("#humidity2").html(response.list[8].main.humidity+"%");
    $("#humidity3").html(response.list[16].main.humidity+"%");
    $("#humidity4").html(response.list[24].main.humidity+"%");
    $("#humidity5").html(response.list[32].main.humidity+"%");

  });

  //turning on the div to display the weather on click of the submit button
  $("#weatherFore").css("display", "block");
});

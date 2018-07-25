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

var database = firebase.database();
let userInput;
let city;

const runSearch = () => {
  // This is our API keys
  var APIKey1 = "&APPID=43c7b0d44b7655fca26cc7c25917a267";
  var APIKey2 = "PZHOYO5FFJN53C3NX0P3TMB35JTSTPYQOBLVYQ4AOF5QHUEP";
  var clientID = "NEUHRRZ0QLEXZHYYO1BQ40TCAYG42QWPUK2YLV3KE4AR4QGI";

  // Here we are building the URL we need to query the database for OpenWeatherMaps
  var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${userInput},USA${APIKey1}`;
  var queryURL2 = `https://api.foursquare.com/v2/venues/explore?near=${userInput}&limit=10&venuePhotos=1&section=topPicks&client_id=${clientID}&client_secret=${APIKey2}&v=20180721`; 
 
  //This is out ajax call for foursquare
  $.ajax({
    url: queryURL2,
    method: "GET"
  }).then(function(results) {
    console.log(queryURL2);
    console.log(results.response.groups[0].items[0].venue.name);
    console.log(results);
    //This appends the header
    $("#city-4sq").html("Whats hot in " + results.response.headerLocation + "!");
    console.log(results.response.headerLocation)

    let items = results.response.groups[0].items
    for (let i = 0; i < items.length; i++) {
        //dynamically creates the html with our ajax response
        let venue = items[i].venue;
      
        let $row = $("<div>").addClass("row venue");
        let $col = $("<div>").addClass("col-md-12 text-center").attr("id", `venue${i}`);
        let $name = $("<p>").text(`Venue ${i + 1}: ${venue.name}`);
        let $location = $("<p>").text(`Location: ${venue.location.address}`);
        let $category = $("<p>").text(`Category: ${venue.categories[0].name}`);

        //This appends all the html elements we just created above in one simple chain into the topPicks div in our html
        $col.append($name,$location,$category).appendTo($row);
        $("#topPicks").append($row);
        
        //fetching pictures for each venue with another ajax call inside an ajax call
        $.ajax({
          url: `https://api.foursquare.com/v2/venues/${venue.id}/photos?client_id=${clientID}&client_secret=${APIKey2}&v=20180721`,
          method: "GET"
        }).then(function(picRes) {
          console.log("results", picRes);
          let photo = picRes.response.photos.items;
          for (let t = 0; t < photo.length; t++) {
            
            let  $pic = $("<div>").html(`<img src="${photo[t].prefix}200x200${photo[t].suffix}">`);
            //This will append our photos to the div col with the id attr of venue{i}
            // we had to give each class an id to append things in the right order because the second ajax call for the photos
            // does not happen at the same time as the first ajax call for the venue information
            $(`#venue${i}`).append($pic);
            console.log($(`#venue${i}`));
        
          }
        }); 
    }  
  });

 //This is our openWeatherMaps call
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

//This is the end of our on-click function, everything is created inside of this
}; // and this is the end of our function that we wrap everything in


$("#submit").on("click", function() {
  userInput = $("#cityInput").val().trim();
  //city = $("#cityInput").val().trim();
  console.log(userInput);
  //This clears out the search bar on-click
  $("#cityInput").val("");
  //This clears the previous foursquare results before the next search renders
  $("#topPicks").empty();
  //This will make our heart appear whenever the submit button is clicked
  $(".fa-heart").css("display","unset");
  runSearch();
});



  
//runSearch();// This calls our function to run the search

$(".fa-heart").on("click", function(){
  $('[data-toggle="popover"]').popover();
  setTimeout(function(){$(`.popover-body`).empty(); }, 2000);

  let city = userInput;
  //alert(city);
  database.ref(`/city`).push({
   city, 
  }); 

});

database.ref("/city").on("child_added", function(snapshot){
  let sv = snapshot.val();
  if (sv.city) {
    let listItem =`<button  class="dropdown-item places" type="button">${sv.city}</button>`;
    $(".dropdown-menu").prepend(listItem);
  }
  // else {
  //   alert("You have not selected any favorites!");
  // }
// console.log(sv.city);
});

$("#clear").on("click", function(){
 
  database.ref("/city").remove();
  $(".dropdown-menu .places").remove();
});


$(".dropdown-menu").on("click", ".dropdown-item", function(){
      choice = $(this).text();
      userInput = choice;
      console.log(userInput);
      runSearch();
});

// $("#dropdownMenu2").on('click', function(){
//   database.ref("/city").on("child_added", function(snapshot){
//     let sv = snapshot.val();
//     console.log(sv.city);
//     if(sv === null) {
//       alert('test');
//     }
//   });
// });






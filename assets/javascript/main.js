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
//Setting our global variables
var database = firebase.database();
let userInput;
let city;
let map;
let cities = [];

// This is the function that intializes are googlemaps
function initMap() {
  // The location of Uluru
  var uluru = {lat: -25.344, lng: 131.036};
  // The map, centered at Uluru
  map = new google.maps.Map(
      document.getElementById('map'), {zoom: 14, center: uluru});
  // The marker, positioned at Uluru
  // var marker = new google.maps.Marker({position: uluru, map: map});
}

//This sets our ajax calls as a function
const runSearch = () => {
    // This is our API keys
    var APIKey1 = "&APPID=43c7b0d44b7655fca26cc7c25917a267";
    var APIKey2 = "R0H5WG3X5Y1Q2VQMWNSFQKJ5BRLRWQGLM4RJW1VOATNEUP3Z";
    var clientID = "LAOWDLGTC2JPNIGWRITYXRY0YU4NJR3CLWJVW2WANTBYDZLU";
    
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
      //This sets the general location of are map IE "dallas"
      map.setCenter(results.response.geocode.center);
      
      //This appends the header
      $("#city-4sq").html("Whats hot in " + results.response.headerLocation + "!");
      console.log(results.response.headerLocation)
      //This creates the html we need for our map-view icon
      let $mapIcon = `<i id="mapView" class="fa fa-map-signs" aria-hidden="true">Map View</i>`
      //This will append the map icon to top picks before we append any other html, notice we do this outside of the forLoop so that this only happens once
      $("#topPicks").append($mapIcon);
      //This creates a variable that just makes getting to the foursquare ajax call response info easier
      let items = results.response.groups[0].items
      //Here we create a forLoop that lets us cycle through all the info in the items[] array from the 4sq Ajax response
      for (let i = 0; i < items.length; i++) {
      
        //another variable that grabs the venue off each item[] array as the forLoop cycles... this pretains to the homepage list
        let venue = items[i].venue;
        //This creates the marker for each venue as it runs through the forLoop.. this pretains to the map
        let venueMarker = new google.maps.Marker({position: {lat: venue.location.lat, lng: venue.location.lng}, map});
        //Everything below is creating the vertical column of results and is not related to the marker or map
        let $row = $("<div>").addClass("row venue");
        let $col = $("<div>").addClass("col-md-12 text-center").attr("id", `venue${i}`);
        let $name = $("<p>").text(`Venue ${i + 1}: ${venue.name}`);
        let $location = $("<p>").text(`Location: ${venue.location.address}`);
        let $category = $("<p>").text(`Category: ${venue.categories[0].name}`);

        //This appends all the html elements we just created above in one simple chain into the topPicks div in our html... homepage list
        $col.append($name,$location,$category).appendTo($row);
        $("#topPicks").append($row);
        
        //fetching pictures for each venue with another ajax call inside the first ajax call, we needed the venue ID from the first ajax call to run the second ajax call
        $.ajax({
          url: `https://api.foursquare.com/v2/venues/${venue.id}/photos?client_id=${clientID}&client_secret=${APIKey2}&v=20180721`,
          method: "GET"
        }).then(function(picRes) {
          console.log("results", picRes);
          //Once again here we have a variable to condense the response path of the ajax call to the needed info.. 
          let photo = picRes.response.photos.items;
          //This is creating all our html from our forLoop except for our picture.. Note which forLoop this line is in.. contentString pretains to map
          let contentString = `<p>${venue.name}</p><p>${venue.location.address}</p><p>${venue.categories[0].name}</p>`
          //This is the second forLoop pretaining to the photo response, we are running this to grab multiple pictures within the response
          //notice the var t in this forLoop, this is because var i is being used in the first ajax forLoop which is still in scope
          for (let t = 0; t < photo.length; t++) {
            
            
            //This creates the html for the photos used in the marker map content and adds it to our other html content inside var contentString..pretains to map
            contentString += `<img src="${photo[t].prefix}200x200${photo[t].suffix}">`

            
            //This is the html for the pic that will be used in the normal html container...pretains to homepage list
            let $pic = $("<div>").html(`<img src="${photo[t].prefix}200x200${photo[t].suffix}">`);
            
            
            //This will append our photos to the div col with the id attr of venue{i}
            // we had to give each class an id to append things in the right order because the second ajax call for the photos
            // does not happen at the same time as the first ajax call for the venue information
            $(`#venue${i}`).append($pic);
            console.log($(`#venue${i}`));
        
          }
          // Here is where we add all the html created in contentString into our popover of our marker..pretains to map
          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });
          // This is the on-click listener of the marker that will display content...pretains to map
          venueMarker.addListener('click', function() {
            infowindow.open(map, venueMarker);
          });
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


}; // and this is the end of our runSearch function for our ajax calls that we wrap everything in

//When clicking submit this will take our global userInput variable and plug it into our ajax function
$("#submit").on("click", function() {
  userInput = $("#cityInput").val().trim(); 
  console.log(userInput);
  //This clears out the search bar on-click
  $("#cityInput").val("");
  //This clears the previous foursquare results before the next search renders
  $("#topPicks").empty();
  //This will make our heart appear whenever the submit button is clicked
  $(".fa-heart").css("display","unset");
  //This is where we call the API/AJAX function to run
  runSearch();
});
//This calls the popover on the heart icon on click
$('[data-toggle="popover"]').popover();
//This is the  fav icon functionality
$(".fa-heart").on("click", function(){
  //this will push the userInput into our fireBase database
  let city = userInput;
  database.ref(`/city`).push({ // only push city in if not already in array
   city, 
  }); 
});
//This takes the saved info from firebase and dynamically appends it to our dropdown menu in realtime
database.ref("/city").on("child_added", function(snapshot){
  let sv = snapshot.val();
  // This will check our cities array (global variable) and if cities does not include sv.city it will run the next lines, This prevents repeat cities being set in the listItem dropdown
  if (sv.city && !cities.includes(sv.city)) { 
    //this is the dynamic creation of a dropdown item
    let listItem =`<button  class="dropdown-item places" type="button">${sv.city}</button>`;
    $(".dropdown-menu").prepend(listItem);
    cities.push(sv.city);// We created a global variable called cities and we push sv.city into that array; line 203 checks this 
  }
});
//This represents the dropdown item with the ID of clear, on-click  it will remove any appended cities and clear out firebase
$("#clear").on("click", function(){
  database.ref("/city").remove();
  $(".dropdown-menu .places").remove();
});
//This is how to select the dynamically appended dropdown-items.. take note of how we have an advanced Jquery selector  methodology here.. without this selector process you would not be able to select a listItem
$(".dropdown-menu").on("click", ".dropdown-item", function(){
      //This will take the text off of the list item and store it in a variable, next we will update our global variable UserInput 
      choice = $(this).text();
      userInput = choice;
      console.log(userInput);
      //This will now rerun our AJAX/API call with the val of the text of our list item
      runSearch();
});
//This is the onclick function for the map icon that show the map and hides the rest of the web app
$("#topPicks").on("click", "#mapView" , function(){
  $("#map").fadeIn("3000");
  $("#jumbo").fadeOut("3000");
  $("#close").fadeIn("3000");
});
// This is the onclick function for the clear button that removes the map and brings back the web app
//****TODO this button sometimes displays out of view field need to fix */
$("#close").on("click", function(){
  $("#map").fadeOut("3000");
  $("#jumbo").css("display","block");
  $("#close").fadeOut("3000");
});







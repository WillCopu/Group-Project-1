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
  var queryURL2 = `https://api.foursquare.com/v2/venues/explore?near=${userInput}&limit=10&section=topPicks&client_id=${clientID}&client_secret=${APIKey2}&v=20180721`; 
  // We then created an AJAX call


  $.ajax({
    url: queryURL2,
    method: "GET"
  }).then(function(results) {
    console.log(queryURL2);
    console.log(results.response.groups[0].items[0].venue.name);
  });

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(queryURL);
    console.log(response.list[0].dt_txt);
    console.log(moment(response.list[0].dt_txt ).format('l'));
  })




});

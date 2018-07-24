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
  //This clears out the search bar on-click
  $("#cityInput").val("");
  //This clears the previous foursquare results before the next search renders
  $("#topPicks").empty();

  // This is our API keys
  var APIKey1 = "&APPID=43c7b0d44b7655fca26cc7c25917a267";
  var APIKey2 = "EG1HKMAR4NVCHEYDK1UE4OGRFJ35FJCJDKSQZMN0AKJ32S1G";
  var clientID = "AMBFJBBKSIVAOZFW020NJ2KTVH153HVJYIKKYJISKNSEKAN5";

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
    console.log(moment(response.list[0].dt_txt ).format('l'));
    console.log(response);
  })
 



});//This is the end of our on-click function, everything is created inside of this







//     //fetching pictures for each venue with another ajax call inside an ajax call
//     $.ajax({
//       url: `https://api.foursquare.com/v2/venues/${venue.id}/photos?client_id=${clientID}&client_secret=${APIKey2}&v=20180721`,
//       method: "GET"
//     }).then(function(picRes) {
//       console.log("results", picRes);
//       let photo = picRes.response.photos.items[0];
//       let  $pic = $("<div>").html(`<img src="${photo.prefix}200x200${photo.suffix}">`);
//       //This will append our photos to the div col with the id attr of venue{i}
//       // we had to give each class an id to append things in the right order because the second ajax call for the photos
//       // does not happen at the same time as the first ajax call for the venue information
//       $(`#venue${i}`).append($pic);
//       console.log($(`#venue${i}`));
//     }); 
// }

// });
// //This is our openWeatherMaps call
// $.ajax({
// url: queryURL,
// method: "GET"
// }).then(function(response) {
// console.log(queryURL);
// console.log(response.list[0].dt_txt);
// console.log(moment(response.list[0].dt_txt ).format('l'));
// console.log(response);
// })




// });//This is the end of our on-click function, everything is created inside of this



// 1 CommentCollapse 

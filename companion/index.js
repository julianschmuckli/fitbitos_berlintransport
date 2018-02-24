import { geolocation } from "geolocation";
import * as messaging from "messaging";

var index = 1;

console.log("App started");

var GPSoptions = {
  enableHighAccuracy: false,
  maximumAge: 60000
};

function locationError(error) {
  console.log("Error fetching location");
  sendResponse({error:true,message:"no_location"});
}

function getStations(position) {
  var latitude, longitude;
  
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  
  console.log("Location: "+latitude+", "+longitude);
  var url = "https://2.vbb.transport.rest/stations/nearby?latitude="+latitude+"&longitude="+longitude;
  console.log("Loading data from "+url);
  fetch(url).then(function (response) {
      response.text()
      .then(function(data) {
        var data = JSON.parse(data);
        var searched_index = 0;
        for(var i = 0;i<data.length;i++){
          if(data[i]["id"]!=undefined){
             searched_index++;
          }
          if(data[i]["id"]!=undefined && searched_index >= index){
            var url2 = "https://2.vbb.transport.rest/stations/"+data[i]["id"]+"/departures?when=now&results=4";
            console.log(url2);
            fetch(url2)
            .then(function (response2) {
                response2.text()
                .then(function(data2) {
                  //console.log("Hallo:"+data2);
                  var data2 = JSON.parse(data2);
                  var data_response = {
                    name: data[i]["name"],
                    to:[],
                    departures:[],
                    number:[],
                    operators:[]
                  }
                  for(var ia=0;ia < 4;ia++){
                    //console.log(ia+": "+data2["stationboard"][ia]["to"]);
                    try{
                    data_response.to[ia] = data2[ia]["direction"];
                    data_response.departures[ia] = Date.parse(data2[ia]["when"])/1000;
                    data_response.number[ia] = data2[ia]["line"]["name"];
                    data_response.operators[ia] = data2[ia]["line"]["operator"]["name"];
                    }catch(e){

                    }
                  }

                  sendResponse(data_response);
                });
            }).catch(function (err) {
              console.log("Error fetching data from internet: " + err);
            });
            break;
          }
        }
      });
  })
  .catch(function (err) {
    console.log("Error fetching: " + err);
  });
}

function sendResponse(response){
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    console.log("Sending response");
    console.log(JSON.stringify(response));
    messaging.peerSocket.send(response);
  } else {
    console.log("Error: Connection is not open");
  }
}

messaging.peerSocket.onopen = function() {
  console.log("Socket open");
  geolocation.getCurrentPosition(getStations, locationError, GPSoptions);
}

// Listen for messages from the device
messaging.peerSocket.onmessage = function(evt) {
  if(evt.data.key=="changeStationDown"){
    index++;
    geolocation.getCurrentPosition(getStations, locationError, GPSoptions);
  }else if(evt.data.key=="changeStationUp"){
    index--;
    geolocation.getCurrentPosition(getStations, locationError, GPSoptions);
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}
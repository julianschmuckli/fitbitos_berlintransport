import document from "document";
import * as messaging from "messaging";
import { vibration } from "haptics";
import { geolocation } from "geolocation";
import { locale } from "user-settings";

console.log("App Started");

var message_received = false;
var displayInMinutes = false;
var language = locale.language;

var index = 1;
var GPSoptions = {
  enableHighAccuracy: true,
  maximumAge: 60000
};

let name = document.getElementById("name");
let stationboard = document.getElementById("stationboard");
let scrollview = document.getElementById('scrollview');

let time_one__background_number = document.getElementById("time_one-background_number");
let time_one__number = document.getElementById("time_one-number");
let time_one__destination = document.getElementById("time_one-destination");
let time_one__platform = document.getElementById("time_one-platform");
let time_one__time = document.getElementById("time_one-time");

let time_two__background_number = document.getElementById("time_two-background_number");
let time_two__number = document.getElementById("time_two-number");
let time_two__destination = document.getElementById("time_two-destination");
let time_two__platform = document.getElementById("time_two-platform");
let time_two__time = document.getElementById("time_two-time");

let time_three__background_number = document.getElementById("time_three-background_number");
let time_three__number = document.getElementById("time_three-number");
let time_three__destination = document.getElementById("time_three-destination");
let time_three__platform = document.getElementById("time_three-platform");
let time_three__time = document.getElementById("time_three-time");

let time_four__background_number = document.getElementById("time_four-background_number");
let time_four__number = document.getElementById("time_four-number");
let time_four__destination = document.getElementById("time_four-destination");
let time_four__platform = document.getElementById("time_four-platform");
let time_four__time = document.getElementById("time_four-time");

let distance_between_time_and_details = time_four__time.x;

translateScreen("Lädt...", "", "Loading...", "");
scrollview.height = 150;

messaging.peerSocket.onopen = function() {
  console.log("Started");
  getStations();
}

messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  stationboard.text = "Fehler. Erneut versuchen."
  console.log("Connection error: " + err.code + " - " + err.message);
}

function getStations() {  
  translateScreen("Bitte warten...", "Station in deiner Nähe wird abgefragt...\n\nBitte habe etwas Geduld.", "Please wait...", "Retrieving the timetable of a station near you. Please have patience.");
  scrollview.height = 150;
}

var data;
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data!=undefined) {
    message_received = true;
    if(evt.data.error){
      if(evt.data.message=="no_location"){        
        translateScreen("Kein Standort", "Möglicherweise ist dein Standort auf deinem Smartphone deaktiviert oder nicht empfangbar.",
                        "No location", "Perhaps the GPS on your smartphone is deactivated.");
        
        scrollview.height = 150;
      }
    }else{
      data = evt.data;

      var data_name = (evt.data.name).split(", ")[1]+", "+(evt.data.name).split(", ")[0];
      if(data_name.indexOf("undefined") !== -1){
        data_name = evt.data.name;
      }
      name.text = data_name;
      name.onclick = function(e){
        changeTimeDisplay();
      }
      
      //Reset screen
      stationboard.style.display = "none";
      
      time_one__background_number.style.display = "none";
      time_one__number.style.display = "none";
      time_one__destination.style.display = "none";
      time_one__platform.style.display = "none";
      time_one__time.style.display = "none";
      
      time_two__background_number.style.display = "none";
      time_two__number.style.display = "none";
      time_two__destination.style.display = "none";
      time_two__platform.style.display = "none";
      time_two__time.style.display = "none";
      
      time_three__background_number.style.display = "none";
      time_three__number.style.display = "none";
      time_three__destination.style.display = "none";
      time_three__platform.style.display = "none";
      time_three__time.style.display = "none";
      
      time_four__background_number.style.display = "none";
      time_four__number.style.display = "none";
      time_four__destination.style.display = "none";
      time_four__platform.style.display = "none";
      time_four__time.style.display = "none";

      var data_result="";
      for(var i = 0;i<evt.data.to.length;i++){
        if(i==0){
          time_one__background_number.style.display = "inline";
          time_one__number.style.display = "inline";
          time_one__destination.style.display = "inline";
          time_one__platform.style.display = "inline";
          time_one__time.style.display = "inline";
        }
        if(i==1){
          time_two__background_number.style.display = "inline";
          time_two__number.style.display = "inline";
          time_two__destination.style.display = "inline";
          time_two__platform.style.display = "inline";
          time_two__time.style.display = "inline";
        }
        if(i==2){
          time_three__background_number.style.display = "inline";
          time_three__number.style.display = "inline";
          time_three__destination.style.display = "inline";
          time_three__platform.style.display = "inline";
          time_three__time.style.display = "inline";
        }
        if(i==3){
          time_four__background_number.style.display = "inline";
          time_four__number.style.display = "inline";
          time_four__destination.style.display = "inline";
          time_four__platform.style.display = "inline";
          time_four__time.style.display = "inline";
        }
      }
      
      /* Time 1 */
      var colors = getColors(evt.data.operators[0], evt.data.number[0]);
      
      time_one__number.style.fill = colors.line_color_font;
      time_one__background_number.style.fill = colors.line_color;
      
      time_one__number.text = evt.data.number[0];
      
      time_one__destination.text = evt.data.to[0];
      time_one__time.text = getTime(evt.data.departures[0])
      
      
      /* Time 2 */
      
      var colors = getColors(evt.data.operators[1], evt.data.number[1]);
      
      time_two__number.style.fill = colors.line_color_font;
      time_two__background_number.style.fill = colors.line_color;
      
      time_two__number.text = evt.data.number[1];
      
      time_two__destination.text = evt.data.to[1];
      time_two__time.text = getTime(evt.data.departures[1])

      
      /* Time 3 */
      
      var colors = getColors(evt.data.operators[2], evt.data.number[2]);
      
      time_three__number.style.fill = colors.line_color_font;
      time_three__background_number.style.fill = colors.line_color;
      
      time_three__number.text = evt.data.number[2];
      
      time_three__destination.text = evt.data.to[2];
      time_three__time.text = getTime(evt.data.departures[2])
      
      /* Time 4 */
      
      var colors = getColors(evt.data.operators[3], evt.data.number[3]);
      
      time_four__number.style.fill = colors.line_color_font;
      time_four__background_number.style.fill = colors.line_color;
      
      time_four__number.text = evt.data.number[3];
      
      time_four__destination.text = evt.data.to[3];
      time_four__time.text = getTime(evt.data.departures[3]);

      scrollview.height = 400;
      vibration.start("confirmation-max");
      
      //Change station
      document.onkeypress = function(e) {
        if(e.key=="down"){
          if(index<=8){
            translateScreen("Nächste Station...", "", "Next station...", "");
            
            index++;
            messaging.peerSocket.send({key:"changeStationDown"});
          }
        }else if(e.key=="up"){
          if(index>1){
            translateScreen("Vorherige Station...", "", "Previous station...", "");
            
            index--;
            messaging.peerSocket.send({key:"changeStationUp"});
          }
        }
      }
    }
  }
}

function translateScreen(name_text_de, content_text_de, name_text_en, content_text_en){
  switch(language){
    case 'de-de':
    case 'de-DE':
      name.text = name_text_de;
      stationboard.text = content_text_de;
      break;
    default:
      name.text = name_text_en;
      stationboard.text = content_text_en;
      break;
  }
}

function changeTimeDisplay(){
  if(displayInMinutes){
    time_one__time.x = time_one__time.x - 10;
    time_two__time.x = time_two__time.x - 10;
    time_three__time.x = time_three__time.x - 10;
    time_four__time.x = time_four__time.x - 10;
    
    time_one__time.text = getMinutes(data.departures[0]);
    time_two__time.text = getMinutes(data.departures[1]);
    time_three__time.text = getMinutes(data.departures[2]);
    time_four__time.text = getMinutes(data.departures[3]);
    displayInMinutes = false;
  }else{
    time_one__time.x = distance_between_time_and_details;
    time_two__time.x = distance_between_time_and_details;
    time_three__time.x = distance_between_time_and_details;
    time_four__time.x = distance_between_time_and_details;
    
    time_one__time.text = getTime(data.departures[0]);
    time_two__time.text = getTime(data.departures[1]);
    time_three__time.text = getTime(data.departures[2]);
    time_four__time.text = getTime(data.departures[3]);
    displayInMinutes = true;
  }
}

setTimeout(function(){
  if(!message_received){
    translateScreen("Keine Verbindung", "Zurzeit kann keine Verbindung mit dem Smartphone hergestellt werden.",
                    "No connection", "It seems that you don't have a connection to your phone.");
    
    scrollview.height = 150;
    vibration.start("nudge-max");
  }
}, 10000);

function getTime(timestamp){
  var date = new Date(timestamp*1000);
  // Hours part from the timestamp
  var hours = pad(date.getHours(),2);
  // Minutes part from the timestamp
  var minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  var seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  return hours + ":" + minutes.substr(-2);
}

function getMinutes(timestamp){
  var current_time = new Date();
  var time = new Date(timestamp*1000);
  
  var timeDiff = Math.abs(time.getTime() - current_time.getTime());
  var diffMinutes = Math.ceil(timeDiff / (1000 * 60));
  var diffHours = Math.ceil(timeDiff / (1000 * 60 * 60));
  if(diffMinutes<60) {
    return diffMinutes + " Min.";
  }else{
    return diffHours + " Std.";
  }
}

function getColors(operator, number){
  var colors;
  try{
    var new_number = number.split(" ");
    switch(new_number[0]){
      case "Bus":
        colors = {line_color:"#A5037C",line_color_font:"#FFF"}
        break;
      case "Tram":
        colors = {line_color:"#E2001A",line_color_font:"#FFF"}
        break;
      default:
        console.log("----------");
        console.log("Unknown number: "+number);
        console.log("----------");
        break;
    }
    if(colors!=undefined){
      return colors;
    }
  }catch(e){}
  switch(operator){
    case 'S-Bahn Berlin GmbH':
      colors = {line_color:"#0C9157",line_color_font:"#FFF"}
      break;
    case 'Barnimer Busgesellschaft mbH':
      colors = {line_color:"#A5037C",line_color_font:"#FFF"}
      break;
    default:
      console.log("----------");
      console.log("Unknown operator: "+operator);
      console.log("----------");
      colors = {line_color:"#fff",line_color_font:"#000"};
      break;
  }
  return colors;
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
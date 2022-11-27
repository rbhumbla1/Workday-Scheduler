var containerEl = $('#mainContainer'); //main container handle
var currDateTime = $('#currentDay'); // to store current date and time
var saveBtn = $('.btn'); //save button handle
var eventList = []; //to store the list of event which a user adds in the scheduler
var currentHour = 0; //current hour tracker

// Wrapper jQuery function to ensure that  the code isn't run until the browser has 
// finished rendering all the elements in the html.
$(function () {
  //add current date & time in header
  currDateTime.text(dayjs().format('dddd, MMMM D'));

  // listener function for click events on the save button.
  containerEl.on('click', function (event) { 

    var element = event.target;

    //to capture event when the save button or save icon is clicked
    if (element.matches('button') || element.matches('i')) {

      //find the row
      var row = "#hour-" + element.id;

      //find the parent div of the row
      var parent = $(row);

      //get the value from text area which is second child of div
      var event = parent.children().eq(1).val();

      if (event.trim() === "")
        return;

      //creat an object to store the row and event created in local storage
      var entry = {
        hour: element.id,
        event: event.trim(),
      };

      //add the latest entry to the eventList
      eventList[eventList.length] = entry;

      //write eventList to local storage
      localStorage.setItem("eventList", JSON.stringify(eventList));
    }

  });


  //This timer here will  change past, current and future colors after each hour
  var timerInterval = setInterval(function () {

    var hour = dayjs().hour;
    
    if(currentHour === hour){
      console.log(currentHour, hour);
      currentHour = hour;
      location.reload();
    }

  }, 1000);

  //Function to retrieve the calendar events from local storage
  function getStoredSchedule() {

    var storedList = JSON.parse(localStorage.getItem("eventList"));
    if (storedList !== null) {
      eventList = storedList;
    }
    return;
  }

  //Function to retrieve event from event list for a given row in scheduler
  function populateEvents(row) {

    for (var i = 0; i < eventList.length; i++) {
      if (parseInt(eventList[i].hour) === row) {
        return eventList[i].event;
      }
    }
    return "";
  }

  //function to create HTML dynamically.  This function will create each row in scheduler and 
  //add code to apply the past, present, or future class to each time block by comparing the id to the current hour.
  function addWorkHours() {
    //get current hour
    currentHour = dayjs().get('hour');

    var time = 0;
    var amPM = "AM";

    //add 8 hour slots to the container
    for (var i = 9; i < 18; i++) {

      time = i;

      //caluculate the display time e.g 1am/pm instead of 13am/pm 
      if (i > 12) {
        amPM = "PM";
        time = i - 12;
      } else if (i === 12) { 
        amPM = "PM";
      }

      //add div element to HTML to display time
      var mainDiv = $('<div>')
      mainDiv.attr('id', 'hour-' + i);
      mainDiv.attr('class', 'row time-block');

      //Check past, present, future based on current hour and add appropriate class to the main div
      if (i < currentHour)
        mainDiv.addClass('past');
      else if (i === currentHour)
        mainDiv.addClass('present');
      else
        mainDiv.addClass('future');

      //add a div to display time for a row in the schdulter
      mainDiv.append('<div class="col-2 col-md-1 hour text-center py-3">' + time + amPM + '</div>');
      //add textarea to diaply event added by the user
      mainDiv.append('<textarea class=\"col-8 col-md-10 description\" rows=\"3\"> </textarea>');
      //add a button and a save icon to save the entry by the user
      mainDiv.append('<button class=\"btn saveBtn col-2 col-md-1\" aria-label=\"save\"><i class=\"fas fa-save\" aria-hidden=\"true\"></i></button>');

      //adding id sttribute to the button and icon to be used for saving and then retrieving the row entry from thelocal storage
      mainDiv.children('button').attr('id', i);
      mainDiv.children('button').children('i').attr('id', i);
    
      //checkif some entry for the row exists in thelocal storage.  If so then populate the text are with it
      var storedEvent = populateEvents(i);
      
      if (storedEvent !== "")
        mainDiv.children('textarea').append(storedEvent);

      //append the hour div to main container
      containerEl.append(mainDiv);
    }
  }

  function init() {
    //Get stored scores
    getStoredSchedule();

    //Add rows to scheduler.  If ther are events stored in the local storage for any hour, they will be retrieved and displayed.
    addWorkHours();
  }

  init();
  
});

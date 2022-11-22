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
      var row = "#hour-";

      if (element.id > 12)
        row += (element.id - 12);
      else
        row += element.id;
      console.log(row);
      var parent = $(row);
      var event = parent.children().eq(1).val();

      if (event.trim() === "")
        return;

      var entry = {
        hour: element.id,
        event: event.trim(),
      };

      //add the latest userScore to the ScoreList
      eventList[eventList.length] = entry;

      //weite scoreList to local storage
      localStorage.setItem("eventList", JSON.stringify(eventList));
    }

  });

  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //WIll set a timer here for each hour to change past, current and future colors
  var timerInterval = setInterval(function () {

    currentHour = dayjs().hour;
    //addWorkHours();
    location.reload();

  }, 3600000);

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
      console.log(i, eventList[i].hour, eventList[i].event, row);
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

      //we need the time to match current hour so calculating 
      if (i > 12) {
        amPM = "PM";
        time = i - 12;
      } else if (i === 12) {
        amPM = "PM";
      }


      var mainDiv = $('<div>')
      mainDiv.attr('id', 'hour-' + time);
      mainDiv.attr('class', 'row time-block');
      //add if statement to check past, present, future
      if (i < currentHour)
        mainDiv.addClass('past');
      else if (i === currentHour)
        mainDiv.addClass('present');
      else
        mainDiv.addClass('future');

      mainDiv.append('<div class="col-2 col-md-1 hour text-center py-3">' + time + amPM + '</div>');
      mainDiv.append('<textarea class=\"col-8 col-md-10 description\" rows=\"3\"> </textarea>');
      mainDiv.append('<button class=\"btn saveBtn col-2 col-md-1\" aria-label=\"save\"><i class=\"fas fa-save\" aria-hidden=\"true\"></i></button>');

      mainDiv.children('button').attr('id', i);
      mainDiv.children('button').children('i').attr('id', i);
      mainDiv.children('textarea').attr('color', 'black');

      var storedEvent = populateEvents(i);
      console.log("storedevent at " + i + " = " + storedEvent);
      if (storedEvent !== "")
        mainDiv.children('textarea').append(storedEvent);

      //append the hour div to main container
      containerEl.append(mainDiv);
    }
  }

  function init() {
    //get stored scores
    getStoredSchedule();
    //add rows to calender
    addWorkHours();
  }

  init();

  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  
});

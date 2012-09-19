/****************************************************************
Author: Amy Lim
Purpose: To create a monthly, weekday, and day calendar in a 
	formatted table.
Last updated: August 25, 2011
Notes: Still need to add functionality to calendar so that it can
	read data from a database and display events on the calendar.
****************************************************************/
var displayDate = new Date();
var month = new Array("January", "February", "March", 
					  "April", "May", "June", 
					  "July", "August", "September", 
					  "October", "November", "December");
var daysInMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
var weekday = new Array("Sunday", "Monday", "Tuesday",
						"Wednesday", "Thursday", "Friday", "Saturday");
var MONTH_MODE = 0;
var WEEK_MODE = 1;
var DAY_MODE = 2;
var mode = 0;

var load = [loadMonthCalendar, loadWeekCalendar, loadDayCalendar];
var setNext = [setNextMonth, setNextWeek, setNextDate];
var setPrev = [setPrevMonth, setPrevWeek, setPrevDate];

function setMode(m) {
	load[mode = m]();
}

function loadMonthCalendar() {
	document.getElementById("calendar").innerHTML = monthCalendar();
	console.log(displayDate);
}

function loadWeekCalendar() {
	document.getElementById("calendar").innerHTML = weekCalendar();
	console.log(displayDate);
}

function loadDayCalendar() {
	document.getElementById("calendar").innerHTML = dayCalendar();
	console.log(displayDate);
}

function resetDisplayDate() {
	displayDate = new Date();
}

//must set manually since there are some errors when setting with
//displayDate.setMonth(displayDate.getMonth() + 1);
//some months might get skipped if the date is on the last day of month
//or on an invalid date
function setNextMonth() {
	var next = displayDate.getMonth() + 1;
	if(next == 12) {
		next = 0;
		displayDate.setFullYear(displayDate.getFullYear() + 1);
	}
	//if(displayDate.getDate() > daysInMonth[next])
	//	displayDate.setDate(daysInMonth[next]);
	displayDate.setDate(1);
	displayDate.setMonth(next);
}

function setPrevMonth() {
	var prev = displayDate.getMonth() - 1;
	if(prev == -1) {
		prev = 11;
		displayDate.setFullYear(displayDate.getFullYear() - 1);
	}
	//if(displayDate.getDate() > daysInMonth[prev])
	//	displayDate.setDate(daysInMonth[prev]);
	displayDate.setDate(1);
	displayDate.setMonth(prev);
}

function setNextWeek() {
	displayDate.setDate(displayDate.getDate() + 7);
}

function setPrevWeek() {
	displayDate.setDate(displayDate.getDate() - 7);
}

function setNextDate() {
	displayDate.setDate(displayDate.getDate() + 1);
}

function setPrevDate() {
	displayDate.setDate(displayDate.getDate() - 1);
}

function goToDate(date) {
	displayDate.setDate(date);
	mode = DAY_MODE;
	load[mode]();
}

function monthCalendar() {
	var currentMonth = displayDate.getMonth();
	var daysInCurrentMonth = (currentMonth == 1 && displayDate.getFullYear()%4 == 0) 
							? 29 : daysInMonth[currentMonth];
	var prevMonth = (currentMonth == 0) ? 11 : currentMonth - 1;
	var daysInPrevMonth = (prevMonth == 1 && displayDate.getFullYear()%4 == 0) 
							? 29 : daysInMonth[prevMonth];
	
	//information for the first day of the current month
	var monthBegin = new Date(displayDate);
	monthBegin.setDate(1);
	var weekdayMonthBegin = monthBegin.getDay();
	
	//setting the column widths
	var tableCode = "";
	for(i = 0; i < 7; i++) {
		tableCode += "<colgroup width='13%'></colgroup>";
	}
	
	//header of the monthly calendar
	tableCode += "<tr><th colspan='7'>" + month[currentMonth] + " " + displayDate.getFullYear() + "</th></tr>";
	
	//header for days of the week
	tableCode += "<tr>";
	for(i = 0; i < 7; i++)
		tableCode += "<td class='month-weekday-header'>" + weekday[i] + "</td>";
	tableCode += "</tr>";
	
	//adds the last days of the previous month
	var weekdayCount = 0;
	tableCode += "<tr>";
	for(i = daysInPrevMonth - weekdayMonthBegin + 1; i <= daysInPrevMonth; i++) {
		tableCode += "<td class='unfocus'>" + i + "</td>";
		weekdayCount++;
	}
	
	var focusDate = displayDate.getDate();
	var bgover = "this.style.background=\'#eef\';";
	var bgout = "this.style.background=\'#fff\';";
	//adds days of current month
	for(i = 1; i <= daysInCurrentMonth; i++) {
		if(i != focusDate)
			tableCode += "<td class='changeDate' onclick='goToDate(" + i + ");'>" + i + "</td>";
		else
			tableCode += "<td class='focusDate changeDate' onclick='goToDate(" + i + ");'>" + i + "</td>";
		weekdayCount++;
		if(weekdayCount == 7) {
			tableCode += "</tr><tr>";
			weekdayCount = 0;
		}
	}
	
	//adds the first few days of the next month
	if(weekdayCount != 0) {
		for(i = 1; weekdayCount < 7; i++) {
			tableCode += "<td class='unfocus'>" + i + "</td>";
			weekdayCount++;
		}
		tableCode += "</tr>";
	}
	
	return tableCode;
}

function weekCalendar() {
	//style the columns for the days of the week
	var tableCode = "<colgroup width='9%' class='timeColumn'></colgroup>";
	var focusDate = displayDate.getDay();
	for(i = 0; i < 7; i++) {
		if(i != focusDate) 	
			tableCode += "<colgroup width='13%' class='eventColumn'></colgroup>";
		else
			tableCode += "<colgroup width='13%' class='focusDate'></colgroup>";
	}
	
	//adds the header for the week with the day of week and date
	var weekdayIter = new Date(displayDate);
	weekdayIter.setDate(weekdayIter.getDate() - weekdayIter.getDay());
	tableCode += "<tr><th style='background-color:#fff'></th>";
	for(i = 0; i < 7; i++) {
		tableCode += "<th class='changeDate' onclick='goToDate(" + weekdayIter.getDate() + ");'>" + weekday[i] + "\n" +
					(weekdayIter.getMonth()+1) + "/" + weekdayIter.getDate() + "/" + weekdayIter.getFullYear() + "</th>";
		weekdayIter.setDate(weekdayIter.getDate() + 1);
	}
	tableCode += "</tr>";
	
	//adds the time slots for the days
	for(i = 0; i < 24; i++) {
		tableCode += "<tr><td>" + convert24to12(i) + "</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>"
	}
	return tableCode;
}

function dayCalendar() {
	//style the columns
	var tableCode = "<colgroup width='20%' class='timeColumn'></colgroup>" +
				    "<colgroup width='80%' class='eventColumn'></colgroup>";
	
	//display the date
	tableCode += "<tr><th colspan='2'>" + weekday[displayDate.getDay()] + ", " +
				 month[displayDate.getMonth()] + " " + displayDate.getDate() + ", " + displayDate.getFullYear() + "</th></tr>";
				 
	//adds the time slots for the day
	for(i = 0; i < 24; i++) {
		tableCode += "<tr><td>" + convert24to12(i) + "</td><td></td></tr>"
	}
	return tableCode;
}

function convert24to12(hour) {
	var hr = "";
	if(hour == 0)
		hr = "12 AM";
	else if(hour < 12)
		hr = hour + " AM";
	else if(hour == 12)
		hr = hour + " PM";
	else
		hr = hour-12 + " PM";
	return hr;
}

function keyAction(event) {
	//if the left arrow key is pressed, go to the previous calendar unit
	if(event.keyCode == 37) {
		setPrev[mode]();
		load[mode]();
	//if the right arrow key is pressed, go to the next calendar unit
	} else if(event.keyCode == 39) {
		setNext[mode]();
		load[mode]();
	}
}
/*Banan Shatnawi*/

//valid time and date
var dateInput = document.getElementById("rev_date");
var timeInput = document.getElementById("rev_time");

function format(num) {
    if (num < 10) {
        return "0" + num;
    }
    return "" + num;
}

var now = new Date();
var year = now.getFullYear();
var month = format(now.getMonth() + 1);
var day = format(now.getDate());
var todaydate = year + "-" + month + "-" + day;

var hours = format(now.getHours());
var minutes = format(now.getMinutes());
var currentTime = hours + ":" + minutes;

dateInput.min = todaydate;
timeInput.min = currentTime;

dateInput.value = todaydate;
timeInput.value = currentTime;

//continue button event
document.getElementById("continue-btn").onclick = function () {
    var date = dateInput.value;
    var time = timeInput.value;
    var guests = document.getElementById("num_guest").value;

    if (date === "" || time === "" || guests === "" || guests < 1) {
        document.getElementById("msg").innerHTML = "Please fill in all fields and enter at least 1 guest.";
        return;
    }

    if (date < todaydate) {
        document.getElementById("msg").innerHTML = "Please choose today or a future date.";
        return;
    }

    if (date === todaydate && time < currentTime) {
        document.getElementById("msg").innerHTML = "Please choose a time from now onward.";
        return;
    }

    document.getElementById("msg").innerHTML = "";

    var page = "login.html";
    if (document.getElementById("preorder_yes").checked) {
        page = "menu.html";
    }

    var confirmed = window.confirm(
        "Reservation Details:\n" +
        "Date: " + date + "\n" +
        "Time: " + time + "\n" +
        "Guests: " + guests + "\n" +
        "Redirecting to: " + page
    );

    if (!confirmed) {
        document.getElementById("msg").innerHTML = "Edit your details and click Continue again.";
        return;
    }

    window.location = page;
};
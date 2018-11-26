const month = document.getElementById("month");
const calendar = document.getElementById("days");
const checkIn = document.getElementById("checkIn");
const checkInInput = document.getElementById("checkInInput");
const checkOut = document.getElementById("checkOut");
const checkOutInput = document.getElementById("checkOutInput");
const stayLength = document.getElementById("stayLength");
const stayLengthInput = document.getElementById("stayLengthInput");
const bookButton = document.getElementById("bookButton");
const guestName = document.getElementById("guestName");
const divider = document.getElementById("stay__date--divider");
const stayCost = document.getElementById("stayCost");
// const bookingEndPoint = "http://localhost:5000/bookings";
const bookingEndPoint = "https://vivlia.herokuapp.com/bookings";
const apikey = "zxos77ua8qiebuo9tp2zrwe2xztwbl6";
const apisecret = "6lc45v4627i2sl54bdzuhn3fau5n9n";
const roomId = "5ab05b97475c20001467188f";

const selectedDays = [];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const booking = {};

// gets todays date and creates a date object used for browsing the calendar
const dateTime = new Date(
  Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1, 14, 0, 0, 0),
);
const browseDateTime = new Date(
  Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1, 14, 0, 0, 0),
);

// adds click event listener to the calendar day cells
let dayElements = document.querySelectorAll(".day");
dayElements.forEach(day => {
  day.addEventListener("click", selectDay);
});

// renders the calendar on page load
renderCalendar(dateTime);
// getBookings();

// sets the month at the top of the calendar
function setMonth(date) {
  month.innerHTML = months[date.getMonth()] + " " + date.getFullYear();
}

// gets the number of days in the current month
function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

// renders the calendar for the selected month
function renderCalendar(date) {
  const renderDate = new Date(browseDateTime.toString());
  const days = getDaysInMonth(date.getMonth(), date.getFullYear());
  month.innerHTML = months[date.getMonth()] + " " + date.getFullYear();
  const cells = Array.from(new Array(days), (val, index) => index + 1);
  const dayCells = cells.map(cell => {
    renderDate.setDate(cell);
    return `
            <div id="${renderDate.getTime()}" class="day">
              <div class="date">${cell}</div>
            </div>
          `;
  });
  dayCells[0] = `<div id="${browseDateTime.getTime()}" class="day" style="grid-column: ${date.getDay() +
    1} / ${date.getDay() + 2}"><div class="date">1</div></div>`;
  calendar.innerHTML = dayCells.join("");
  updateDays();
}

function clearCalendar(date) {
  checkIn.innerHTML = "";
  checkOut.innerHTML = "";
  stayLength.innerHTML = "";
  stayCost.innerHTML = "";
  divider.style.opacity = 0;
  bookButton.style.opacity = 0;
  guestName.style.opacity = 0;
  selectedDays.pop();
  selectedDays.pop();
  dayElements.forEach(day => {
    day.classList.remove("selected__day");
    day.classList.remove("between__day");
  });
  booking.checkInDate = undefined;
  booking.checkInTime = undefined;
  booking.checkOutDate = undefined;
  booking.checkOutTime = undefined;
}

// adds listeners and adds classes after re-rendering the calendar
function updateDays() {
  dayElements = document.querySelectorAll(".day");
  dayElements.forEach(day => {
    day.addEventListener("click", selectDay);
  });
  if (selectedDays.length > 0) {
    selectedDays.forEach(day => {
      const foundDay = document.getElementById(day);
      if (foundDay) {
        foundDay.classList.toggle("selected__day");
      }
    });
    if (selectedDays.length === 2) {
      fillMids();
    }
  }
  // getBookings();
}

// changes the month forward and backward
function changeMonth(direction) {
  if (direction === "forward") {
    if (browseDateTime.getMonth() < 11) {
      browseDateTime.setMonth(browseDateTime.getMonth() + 1);
    } else {
      browseDateTime.setMonth(0);
      browseDateTime.setFullYear(browseDateTime.getFullYear() + 1);
    }
    renderCalendar(browseDateTime);
  } else {
    if (
      dateTime.getMonth() === browseDateTime.getMonth() &&
      dateTime.getFullYear() === browseDateTime.getFullYear()
    ) {
    } else if (browseDateTime.getMonth() > 0) {
      browseDateTime.setMonth(browseDateTime.getMonth() - 1);
    } else {
      browseDateTime.setMonth(11);
      browseDateTime.setFullYear(browseDateTime.getFullYear() - 1);
    }
    renderCalendar(browseDateTime);
  }
}

// fills in days between 2 selected dates
function fillMids() {
  const dayList = Array.from(dayElements, dayElement => dayElement.id);
  const mids = dayList.filter(
    day => day > selectedDays[0] && day < selectedDays[1],
  );
  try {
    mids.forEach(mid => {
      const bDay = document.getElementById(mid);
      if (bDay.classList.contains("booked__day")) {
        throw Error;
      } else {
        document.getElementById(mid).classList.toggle("between__day");
      }
    });
  } catch (error) {
    clearCalendar(browseDateTime);
    return console.log("some of those nights are booked!");
  }
  const dayOne = new Date();
  dayOne.setTime(selectedDays[0]);
  dayOne.setHours(15);
  const dayTwo = new Date();
  dayTwo.setTime(selectedDays[1]);
  dayTwo.setHours(11);
  const diffDays = Math.round(
    Math.abs((dayOne.getTime() - dayTwo.getTime()) / 86400000),
  );
  booking.lengthOfStay = diffDays;
  const cost = diffDays * 150;
  stayLength.innerHTML =
    // "<strong>Length of Stay:</strong> " + diffDays + " Nights";
    "$150 x " + diffDays + " nights";
  stayCost.innerHTML = "$" + cost;
  return true;
}

// highlights selected days, and fills in days in middle of stay
function selectDay(e) {
  const selectedDay = e.currentTarget.id;
  if (
    selectedDays.length === 2 ||
    selectedDay < selectedDays[0] ||
    selectedDay === selectedDays[0]
  ) {
    clearCalendar(browseDateTime);
    e.currentTarget.classList.toggle("selected__day");
    selectedDays.push(selectedDay);
    const checkInDate = new Date();
    checkInDate.setTime(selectedDay);
    checkInDate.setHours(15);
    booking.checkInDate = new Date().setTime(selectedDay);
    booking.checkInTime = parseInt(selectedDay);
    checkIn.innerHTML =
      // "<strong>Check In:</strong> " + checkInDate.toDateString();
      checkInDate.toDateString();
    divider.style.opacity = 0;
    bookButton.style.opacity = 0;
    guestName.style.opacity = 0;
  } else if (selectedDays.length === 1) {
    selectedDays.push(selectedDay);
    if (fillMids()) {
      e.currentTarget.classList.toggle("selected__day");
      const checkOutDate = new Date();
      checkOutDate.setTime(selectedDay);
      checkOutDate.setHours(11);
      booking.checkOutDate = new Date().setTime(selectedDay);
      booking.checkOutTime = parseInt(selectedDay);
      checkOut.innerHTML =
        // "<strong>Check Out:</strong> " + checkOutDate.toDateString();
        checkOutDate.toDateString();
      divider.style.opacity = 1;
      bookButton.style.opacity = 1;
      guestName.style.opacity = 1;
      bookButton.addEventListener("click", book);
    }
  } else {
    e.currentTarget.classList.toggle("selected__day");
    selectedDays.push(selectedDay);
    booking.checkInDate = new Date().setTime(selectedDay);
    booking.checkInTime = parseInt(selectedDay);
    const checkInDate = new Date();
    checkInDate.setTime(selectedDay);
    checkInDate.setHours(15);
    checkIn.innerHTML =
      // "<strong>Check In:</strong> " + checkInDate.toDateString();
      checkInDate.toDateString();
  }
}

// REST STUFF

// gets all bookings from the server
async function getBookings() {
  const data = await (await fetch(bookingEndPoint, {
    headers: {
      "content-type": "application/json",
      apikey: apikey,
      apisecret: apisecret,
    },
    method: "GET",
  })).json();
  blockDays(data.foundBookings);
}

async function blockDays(bookings) {
  await bookings.forEach(booking => {
    const checkInBooking = document.getElementById(booking.checkInTime);
    const checkOutBooking = document.getElementById(booking.checkOutTime);
    if (checkInBooking) {
      checkInBooking.classList.add("booked__day");
    }
    if (checkOutBooking) {
      checkOutBooking.classList.add("booked__day");
    }
    const dayList = Array.from(dayElements, dayElement => dayElement.id);
    const mids = dayList.filter(
      day => day > booking.checkInTime && day < booking.checkOutTime,
    );
    mids.forEach(mid => {
      document.getElementById(mid).classList.add("booked__day");
    });
  });
}

async function book(checkIn, checkOut, name, lengthOfStay) {
  if (!guestName.value) {
    guestName.classList.toggle("error__input");
    setTimeout(() => {
      guestName.classList.toggle("error__input");
    }, 200);
    setTimeout(() => {
      guestName.classList.toggle("error__input");
    }, 400);
    return setTimeout(() => {
      guestName.classList.toggle("error__input");
    }, 600);
  }
  booking.guestName = guestName.value;
  booking.room = roomId;
  console.log("booking!", booking);
  if (
    !booking.checkInDate ||
    !booking.checkInTime ||
    !booking.checkOutDate ||
    !booking.checkOutTime ||
    !booking.guestName ||
    !booking.lengthOfStay
  ) {
    clearCalendar(browseDateTime);
    // return getBookings();
  } else {
    const response = await (await fetch(bookingEndPoint, {
      body: JSON.stringify(booking),
      headers: {
        "content-type": "application/json",
        apikey: apikey,
        apisecret: apisecret,
      },
      method: "POST",
    })).json();
    if (response.success) {
      guestName.value = "";
      clearCalendar(browseDateTime);
      // getBookings();
    }
    console.log(response);
  }
}

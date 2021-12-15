const client = require("../Client")
const CircuitBreaker = require('opossum');

const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000 // After 30 seconds, try again.
};

const responsePath = "frontend/bookings"

module.exports = bookingsHandler = (t, m) => {
    client.emit(t, t, m)
};


const parseDate = (day) => {
  //'10:00-16:00'
  const times = day.split("-");
  const start = times[0].split(":");
  const end = times[1].split(":");
  return {
    start: {
      hour: start[0],
      minute: start[1],
    },
    end: {
      hour: end[0],
      minute: end[1],
    },
  };
};

const getAllBookingsForDay = (msg, booked) => {
  bookedTimes = [];
  booked.forEach((e) => bookedTimes.push(e.time.start));
  const theDay = msg.clinic.openinghours[msg.date.dayName.toLowerCase()];
  const available = [];
  const day = parseDate(theDay);
  const start = parseInt(day.start.hour);
  const end = parseInt(day.end.hour);
  for (let i = start; i <= end; i++) {
    let hasHour = false;
    let hasThirty = false;
    let hasZeroZero = false;
    bookedTimes.forEach((e) => {
      if (e.hour === i) {
        hasHour = true;
        if (e.minute === 0) {
          hasZeroZero = true;
        }
        if (e.minute === 30) {
          hasThirty = true;
        }
      }
    });
    if (!hasZeroZero) {
      available.push({
        clinic: msg.clinic,
        patient: {},
        date: msg.date,
        time: {
          start: { hour: i, minute: 00 },
          end: { hour: i, minute: 30 },
        },
      });
    }
    if (!hasThirty) {
      available.push({
        clinic: msg.clinic,
        patient: {},
        date: msg.date,
        time: {
          start: { hour: i, minute: 30 },
          end: { hour: i + 1, minute: 00 },
        },
      });
    }
  }
  return available;
};

client.on("available", (t, m) => {
    const msg = JSON.parse(m);
    const { message, booked } = msg
    const clinicName = message.clinic.name;

    const bookedAppointments = booked.filter((booking) => {
      const sameName = booking.clinic.name === clinicName;
      const sameYear = message.date.year === booking.date.year;
      const sameDay = message.date.day === booking.date.day;
      const sameMonth = message.date.month === booking.date.month;
      const sameDate = sameDay && sameMonth && sameYear;
      if (sameName && sameDate) return booking;
    });
    const available = getAllBookingsForDay(message, bookedAppointments);
  client.publish(`${responsePath}/${t}`, JSON.stringify(available));
  //client.publish(`${responsePath}/${t}`, m);
});


client.on("confirm", (t, m) => {
  const breaker = new CircuitBreaker(client.publish(`${responsePath}/${t}`, m), options);
  const result = breaker.fire(t, m)
  .then(res => res)
  .catch(console.error)
  //client.publish(`${responsePath}/${t}`, m);
});

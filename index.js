var cal = new CalHeatMap();

const timeSinceAlarmDiv = document.getElementById('time-since-alarm');

const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7Tea-FqnCUv6fB1_6YC6tUp6ORnfYoypWLFpjnesO86BcjDIgZoLowAlyql9757mnbN41MB_nfV8y/pub?gid=0&single=true&output=csv');

const csv = await response.text();

// convert text to unix line breaks
const lines = csv.replace(/\r/g, '');

const periods = {
  monday: {
    0: '9:00',
    1: '9:57',
    2: '10:46',
    3: '11:40',
    4: '12:23',
    5: '13:09',
    6: '13:58',
    7: '14:47',
  },
  else: {
    0: '7:23',
    1: '8:27',
    2: '9:31',
    3: '10:40',
    4: '12:24',
    5: '13:28',
    6: '14:32',
    7: '15:36',
  }
}

// function timestampPeriod(inputDate,period) {
//   const date = new Date(`${inputDate}`);
//   if (period == undefined) {
//     const timestamp = date.getTime()/1000;

//     console.log(`period undefined, returning timestamp ${timestamp}`);

//     return timestamp;
//   }

//   console.log(`date ${inputDate}, period ${period}`);

//   // check if date is a monday
//   if (date.getDay() == 1) {
//     const startTime = periods.monday[period];

//     console.log(inputDate + ' ' + startTime);

//     // add time of day to date
//     const startDate = moment(inputDate + ' ' + startTime, 'MM/DD/YYYY HH:mm').toDate();

//     const timestamp = startDate.getTime()/1000;

//     return timestamp;
//   } else {
//     const startTime = periods.else[period];
//     console.log(inputDate + ' ' + startTime);
//     // add time of day to date
//     const startDate = moment(inputDate + ' ' + startTime, 'MM/DD/YYYY HH:mm').toDate();
//     console.log(startDate);

//     const timestamp = startDate.getTime()/1000;

//     return timestamp;
//   }
// }

const data = {};

// convert csv to json with {date: period}
const alarms = lines.split('\n').slice(1).map(line => {
  const [date, period, time] = line.split(',');
  console.log(`${date} ${period} ${time}`);
  const timestamp = moment(`${date} ${time}`, 'MM/DD/YYYY HH:mm').toDate().getTime()/1000;
  data[timestamp] = ++data[timestamp] || 1;
  return { date, timestamp, period };
});

console.log('data', data);
console.log('alarms', alarms);

function durationAsString(start, end) {
  const duration = moment.duration(moment(end).diff(moment(start)));

  //Get Days
  const days = Math.floor(duration.asDays()); // .asDays returns float but we are interested in full days only
  const daysFormatted = days ? `${days}d ` : ''; // if no full days then do not display it at all

  //Get Hours
  const hours = duration.hours();
  const hoursFormatted = `${hours}h `;

  //Get Minutes
  const minutes = duration.minutes();
  const minutesFormatted = `${minutes}m`;

  return [daysFormatted, hoursFormatted, minutesFormatted].join('');
}

function updateData() {
  console.log('updating data');

  const lastAlarm = new Date(alarms[alarms.length - 1].timestamp * 1000);

  timeSinceAlarmDiv.innerHTML = `Last alarm was ${durationAsString(lastAlarm,new Date())} ago<br>Total Alarms: ${alarms.length}`;
};

updateData();

setInterval(updateData, 60 * 1000);

// const monthsSinceAugust = moment().diff(moment('08/01/2021', 'MM/DD/YYYY'), 'months') + 1;

cal.init({
  domain: "month",
  subDomain: "x_day",
  start: new Date(`2021-08-16T00:00:00-0800`), // start of school year
  subDomainTextFormat: "%d",
  itemName: ["alarm", "alarms"],
  cellSize: 20,
  domainGutter: 12,
  legend: [1,2,3],
  legendVerticalPosition: "top",
  data: data,
  range: 11,
  previousSelector: "#previous",
  nextSelector: "#next"
});
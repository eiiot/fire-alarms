var cal = new CalHeatMap();

const timeSinceAlarmDiv = document.getElementById('time-since-alarm');

const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7Tea-FqnCUv6fB1_6YC6tUp6ORnfYoypWLFpjnesO86BcjDIgZoLowAlyql9757mnbN41MB_nfV8y/pub?gid=0&single=true&output=csv');

const csv = await response.text();

// convert text to unix line breaks
const lines = csv.replace(/\r/g, '');

// convert csv to json with {date: period}
const alarms = lines.split('\n').slice(1).map(line => {
  const [date, period] = line.split(',');
  const periodNum = Number(period);
  return { date, periodNum };
});

const data = {};

alarms.forEach(alarm => {
  const date = new Date(`${alarm.date}`);
  const timestamp = date.getTime()/1000;
  data[timestamp] = ++data[timestamp] || 1;
});

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

  const lastAlarm = new Date(`${alarms[alarms.length - 1].date}`);

  timeSinceAlarmDiv.innerHTML = `Last alarm was ${durationAsString(lastAlarm,new Date())} ago`;
};

updateData();

setInterval(updateData, 1000);


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
  range: 9
});
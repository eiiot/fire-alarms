const fs = require('fs');

// read alarms.json

const alarms = JSON.parse(fs.readFileSync('./alarms.json', 'utf8'));

// convert "month/day/year" to "unix timestamp"

const data = {};

alarms.forEach(alarm => {
  console.log(alarm.date);
  const date = new Date(`${alarm.date}`);
  const timestamp = date.getTime()/1000;
  data[timestamp] = data[timestamp]++ || 1;
});

// write data to file

fs.writeFileSync('./data.json', JSON.stringify(data));
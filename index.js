const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));

let url = 'https://www.nytimes.com/games/strands';
let url2 = 'https://www.nytimes.com/svc/strands/v2/';

// 2024-09-05.json

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/data', async (req, res) => {
  let data;
  const clientTimezone = req.query.timezone;

  const currentDate = new Date().toLocaleDateString('en-CA', {
    timeZone: clientTimezone,
  });

  const dynamicUrl = `${url2}${currentDate}.json`;

  let jsonResponse;
  try {
    const response = await fetch(dynamicUrl);
    jsonResponse = await response.json();
  } catch (error) {
    console.error('Error fetching JSON data:', error);
    return res.status(500).json({ error: 'Failed to fetch JSON data' });
  }

  const { themeWords, spangram, startingBoard, clue } = jsonResponse;

  // Format the data into an array of arrays with 8 arrays of 6 numbers
  let formattedButtonValues = [];
  for (let i = 0; i < startingBoard.length; i++) {
    formattedButtonValues.push(startingBoard[i].split(''));
  }

  res.set('Access-Control-Allow-Origin', '*');
  res.json({
    clue,
    buttonValues: formattedButtonValues,
    spangram,
    themeWords,
  });
});

app.listen(process.env.PORT || 3000, () =>
  console.log('Server running on port 3000')
);

module.exports = app;

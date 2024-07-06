const puppeteer = require('puppeteer');
const NodeCache = require('node-cache');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
// Create a new cache instance
const myCache = new NodeCache({ stdTTL: 24 * 60 * 60, checkperiod: 120 });

let url = 'https://www.nytimes.com/games/strands';

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/data', async (req, res) => {
  let data = myCache.get('data');
  const clientTimezone = req.query.timezone;

  if (data === undefined) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', `--timezone=${clientTimezone}`],
    });
    const page = await browser.newPage();
    await page.goto(url);

    // Click the play button
    await page.click('button.Feo8La_playButton');

    // Wait for the necessary element to be loaded
    await page.waitForSelector('button.pRjvKq_item');

    // Scrape the data
    data = await page.evaluate(() => {
      const buttons = Array.from(
        document.querySelectorAll('button.pRjvKq_item')
      );
      const buttonValues = buttons.map((button) => button.innerText);
      const clue = document.querySelector('h1.umfyna_clue').innerText;
      return { buttonValues, clue };
    });

    myCache.set('data', data);

    await browser.close();
  }

  // Format the data into an array of arrays with 8 arrays of 6 numbers
  let formattedButtonValues = [];
  for (let i = 0; i < data.buttonValues.length; i += 6) {
    formattedButtonValues.push(data.buttonValues.slice(i, i + 6));
  }
  res.set('Access-Control-Allow-Origin', '*');
  res.json({ clue: data.clue, buttonValues: formattedButtonValues });
});

app.listen(process.env.PORT || 3000, () =>
  console.log('Server running on port 3000')
);

module.exports = app;

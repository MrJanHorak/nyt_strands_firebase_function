const axios = require('axios');
const puppeteer = require('puppeteer');

let url = 'https://www.nytimes.com/games/strands';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Click the play button
  await page.click('button.Feo8La_playButton'); // replace 'button.playButton' with the correct selector for the play button

  // Wait for the necessary element to be loaded
  await page.waitForSelector('button.pRjvKq_item'); // replace 'button.pRjvKq_item' with the correct selector for the element you want to scrape

  // Scrape the data
  const buttonValues = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button.pRjvKq_item')); // replace 'button.pRjvKq_item' with the correct selector for the element you want to scrape
    return buttons.map(button => button.innerText);
  });

  console.log(buttonValues);

  await browser.close();
})();
// linkedin_scraper/index.js
const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const profiles = [
    { url: 'https://linkedin.com/in/sample1', Industry: "Tech", Designation: "CEO", Location: "USA", is_high_quality: 1 },
    { url: 'https://linkedin.com/in/sample2', Industry: "Marketing", Designation: "CMO", Location: "UK", is_high_quality: 0 },
  ];

  const data = profiles.map(p => ({
    Industry: p.Industry,
    Designation: p.Designation,
    Location: p.Location,
    is_high_quality: p.is_high_quality
  }));

  fs.writeFileSync("data/linkedin_profiles.csv", "Industry,Designation,Location,is_high_quality\n" +
    data.map(d => `${d.Industry},${d.Designation},${d.Location},${d.is_high_quality}`).join("\n"));

  await browser.close();
})();

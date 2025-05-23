const puppeteer = require('puppeteer');

(async () => {
    const keyword = process.argv[2];
    const location = process.argv[3];
    const connection = process.argv[4];

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}&network=["${connection}"]`;

    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    const profiles = await page.evaluate(() => {
        const profileNodes = document.querySelectorAll('.reusable-search__result-container');
        const profileData = [];

        profileNodes.forEach(node => {
            const name = node.querySelector('.entity-result__title-text')?.innerText || '';
            const about = node.querySelector('.entity-result__primary-subtitle')?.innerText || '';
            const image = node.querySelector('img')?.src || '';
            const linkedin = node.querySelector('a')?.href || '';

            profileData.push({ name, about, image, linkedin });
        });

        return profileData;
    });

    await browser.close();
    console.log(JSON.stringify(profiles));
})();

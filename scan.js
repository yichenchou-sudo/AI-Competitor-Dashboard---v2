const fs = require('fs');
const puppeteer = require('puppeteer');

const [,, url, identifier] = process.argv;

if (!url || !identifier) {
    console.error('Usage: node scan.js <url> <identifier>');
    process.exit(1);
}

async function scan(url, id) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const html = await page.content();
    const filePath = `snapshots/${id}.html`;

    if (!fs.existsSync('snapshots')) fs.mkdirSync('snapshots');

    if (fs.existsSync(filePath)) {
        const oldHtml = fs.readFileSync(filePath, 'utf-8');
        if (oldHtml !== html) {
            console.log(`🟡 CHANGE DETECTED at ${url}`);
        } else {
            console.log(`✅ NO CHANGE at ${url}`);
        }
    } else {
        console.log(`📥 FIRST SCAN - saving snapshot for ${url}`);
    }

    fs.writeFileSync(filePath, html);
    await browser.close();
}

scan(url, identifier);

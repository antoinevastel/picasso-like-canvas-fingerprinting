const assert = require('assert');
const puppeteer = require('puppeteer');
const fs = require('fs');

describe('Picasso canvas fingerprinting', function() {
    this.timeout(10000);
    it('Picasso value should be consistent', async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const picassoCode = fs.readFileSync('./src/canvas.js', 'utf8');
        await page.addScriptTag({content: picassoCode});

        const res = await page.evaluate(() => {
            const params = {
                area: {
                    width: 300,
                    height: 300,
                },
                offsetParameter: 2001000001,
                fontSizeFactor: 1.5,
                multiplier: 15000,
                maxShadowBlur: 50,
            };
            const numShapes = 5;
            const initialSeed = Math.floor(100*Math.random());

            const canvasValue = picassoCanvas(
                numShapes, initialSeed, params
            );

            return canvasValue;
        })

        await browser.close();
        assert.equal(typeof res, 'string');
        assert.equal(res.length > 15, true);
    });
});
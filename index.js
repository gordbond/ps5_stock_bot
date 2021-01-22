const puppeteer = require("puppeteer");
const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();
var channel; 





client.login(config.BOT_TOKEN);



var page = null;
var browser = null;

puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true
}).then(async browser => {
    //log('hi! this program will check if PS5 is available on sites every 30 seconds')
    setInterval(async () => ps5AvailabilityResult(browser), 30000)
    await ps5AvailabilityResult(browser)
})
.catch((error) => {
    console.log(error)
})

async function ps5AvailabilityResult(browser) {
    //log('------------------------')
    const page = await browser.newPage()
    page.setViewport({
        width: 1280,
        height: 800,
        isMobile: false,
    });
    
    //log(`BestBuy - ${await checkIfAvailableonWalMart(page) ? chalk.green('AVAILABLE') : chalk.red('UNAVAILABLE') }`)
    //var messageFromBestBuy = `BestBuy - ${await checkIfAvailableAtWalMart(page) ? 'AVAILABLE' : 'UNAVAILABLE'}`;
    channel = client.channels.cache.get(config.CHANNEL_ID);
    //Send message if available at BestBuy
    if (await checkIfAvailableAtBestBuy(page))
    {
        channel.send("PS5 Available at Best Buy! --> https://www.bestbuy.ca/en-ca/product/playstation-5-digital-edition-console-online-only/14962184");
    }
    if (await checkIfAvailableAtTheSource(page)) 
    {
        channel.send("PS5 Available at The Source! -->  https://www.thesource.ca/en-ca/gaming/playstation/ps5/playstation%c2%ae5-digital-edition-console/p/108090498");
    }

    
    

}
/**
 * Best Buy Availability Checker
 * @param {*} page 
 */
async function checkIfAvailableAtBestBuy(page) {
    const pageUrl = 'https://www.bestbuy.ca/en-ca/product/playstation-5-digital-edition-console-online-only/14962184';
    const buttonElement = '.disabled_XY3i_'
    //prevent captcha issues apparently  
    page.setJavaScriptEnabled(false) 
    await page.goto(pageUrl)
    //True if disabled button class present
    const ps5Available = await page.$(buttonElement)
    //If disabled class is not present that means the but is enabled and therefore available
    return ps5Available ? false : true
    //return ps5Available ? true : false
}

/**
 * The Source Availability Checker
 * @param {} page 
 */
async function checkIfAvailableAtTheSource(page) {
    const pageUrl = 'https://www.thesource.ca/en-ca/gaming/playstation/ps5/playstation%c2%ae5-digital-edition-console/p/108090498';
    const buttonElement = 'disabled-button'
    //prevent captcha issues apparently  
    page.setJavaScriptEnabled(false)
    await page.goto(pageUrl)
    //True if disabled button class present
    const ps5Available = await page.$(buttonElement)
    //If disabled class is not present that means the but is enabled and therefore available
    return buttonAvailable ? false : true
    //return ps5Available ? true : false
}



    
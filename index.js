// const puppeteer = require("puppeteer");
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


const Discord = require("discord.js");
const config = require("./config.json");
require('dotenv').config();
//const channel; 
const client = new Discord.Client();

client.login(process.env.BOT_TOKEN);
//var page = null;
//const browser;

puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true
}).then(async browser => {
    console.log('Bot started...Checking PS5 stock')
    setInterval(async () => ps5AvailabilityResult(browser), 30000)
    await ps5AvailabilityResult(browser)
   
})
.catch((error) => {
    console.log(error)
})

async function ps5AvailabilityResult(browser) {
    const page1 = await browser.newPage()
    const page2 = await browser.newPage()
    page1.setViewport({
        width: 1280,
        height: 800,
        isMobile: false,
    });
    page2.setViewport({
        width: 1280,
        height: 800,
        isMobile: false,
    });
    
    const channel = client.channels.cache.get(config.CHANNEL_ID);
    
    // Send message if available at BestBuy
    if (await checkIfAvailableAtBestBuy(page1))
    {
        channel.send("PS5 Available at Best Buy! --> https://www.bestbuy.ca/en-ca/product/playstation-5-digital-edition-console-online-only/14962184");
    }else{
        console.log("Best Buy PS5 - unavailable.")
    }
    //Send message if available at The Source
    if (await checkIfAvailableAtTheSource(page2)) 
    {
        channel.send("PS5 Available at The Source! -->  https://www.thesource.ca/en-ca/gaming/playstation/ps5/playstation%c2%ae5-digital-edition-console/p/108090498");
        
    }else{
        console.log("The Source PS5 - unavailable.")
    }
    page1.close();
    page2.close();

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
    const disabledTagIsPresent = await page.$(buttonElement)
    //If disabled tag is present there are no ps5s available
    return disabledTagIsPresent ? false : true
    //JUST FOR DEBUGGING
    //return disabledTagIsPresent ? true : false
}

/**
 * The Source Availability Checker
 * THE SOURCE CHECKS FOR HEADLESS
 * @param {} page 
 */
async function checkIfAvailableAtTheSource(page) {
    const pageUrl = 'https://www.thesource.ca/en-ca/gaming/playstation/ps5/playstation%c2%ae5-digital-edition-console/p/108090498';
    const buttonElement = '.disabled-button'
    const outOfStockElement = ".outOfStock"
    //prevent captcha issues apparently  
    page.setJavaScriptEnabled(false)
    await page.goto(pageUrl)
    
    
    const disabledTagIsPresent = await page.$(buttonElement);
    const outOfStockTagIsPresent = await page.$(outOfStockElement);

    if( !outOfStockTagIsPresent && !disabledTagIsPresent){
        return true;
    }else{
        return false;
    }
    //return disabledTagIsPresent ? false : true
    //Just for debugging
    //return disabledTagIsPresent ? true : false
   
}



    //log(`BestBuy - ${await checkIfAvailableonWalMart(page) ? chalk.green('AVAILABLE') : chalk.red('UNAVAILABLE') }`)
    // var messageFromBestBuy = `BestBuy - ${await checkIfAvailableAtBestBuy(page) ? 'AVAILABLE' : 'UNAVAILABLE'}`;
    // channel.send(messageFromBestBuy);
    //channel.send("Test");
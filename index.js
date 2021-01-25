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
    const page1 = await browser.newPage();
    const page2 = await browser.newPage();
    const page3 = await browser.newPage();
    //const page4 = await browser.newPage();

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
    page3.setViewport({
        width: 1280,
        height: 800,
        isMobile: false,
    });
    // page4.setViewport({
    //     width: 1280,
    //     height: 800,
    //     isMobile: false,
    // });
    
    const channel = client.channels.cache.get(config.CHANNEL_ID);
    
    // Send message if available at BestBuy
    if (await checkIfAvailableAtBestBuy(page1))
    {
        console.log("Best Buy PS5 AVAILABLE");
        //channel.send("PS5 Available at Best Buy! --> https://www.bestbuy.ca/en-ca/product/playstation-5-digital-edition-console-online-only/14962184");
    }else{
        console.log("Best Buy PS5 - unavailable.")
    }
    //Send message if available at The Source
    // if (await checkIfAvailableAtTheSource(page2)) 
    // {
    //     //channel.send("PS5 Available at The Source! -->  https://www.thesource.ca/en-ca/gaming/playstation/ps5/playstation%c2%ae5-digital-edition-console/p/108090498");
    //     console.log("The Source PS5 AVAILABLE");
    // }else{
    //     console.log("The Source PS5 - unavailable.")
    // }
    //Send message if available at The Source
    if (await checkIfAvailableAtWalmart(page3)) {
        //channel.send("PS5 Available at Walmart! --> https://www.walmart.ca/en/video-games/playstation-5/ps5-consoles/N-9857");
        console.log("Walmart PS5 AVAILABLE");
    } else {
        console.log("Walmart PS5 - unavailable.")
    }
    page1.close();
    page2.close();
    page3.close();
    //page4.close();

}
/**
 * Best Buy Availability Checker
 * @param {*} page 
 */
async function checkIfAvailableAtBestBuy(page) {
   
    //Best Buy PS5 URL
    const pageUrl = 'https://www.bestbuy.ca/en-ca/product/playstation-5-digital-edition-console-online-only/14962184';
    
    //Disabled button selector
    const buttonElement = '.disabled_XY3i_'
    
    //prevent captcha issues apparently  
    page.setJavaScriptEnabled(false) 

    //Go to Best Buy PS5 URL
    await page.goto(pageUrl)
    
    await page.waitForSelector(buttonElement);

    //True if disabled button class present
    const disabledTagIsPresent = await page.$(buttonElement)
    
    //If disabled tag is present there are no ps5s available
    if(disabledTagIsPresent){
        return false;
    }else{
        return true;
    }
    
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

    const pageNotAvailableElement = ".error-page-content"

    //prevent captcha issues apparently  
    page.setJavaScriptEnabled(false)

    await page.goto(pageUrl)

    const pageNotAvailable = await page.$(pageNotAvailableElement);

    if (pageNotAvailable) {
        console.log("ERROR PAGE")
        return false;
    }
    
    const disabledTagIsPresent = await page.$(buttonElement);

    const outOfStockTagIsPresent = await page.$(outOfStockElement);

    if( !outOfStockTagIsPresent && !disabledTagIsPresent){
        return true;
    }else{
        console.log("NO PS5")
        return false;
    }
   
}


async function checkIfAvailableAtAmazon(page) {
    const pageUrl = 'https://www.amazon.ca/Playstation-3005721-PlayStation-Digital-Edition/dp/B08GS1N24H/ref=sr_1_4?crid=2ICAJIPRBBOFY&dchild=1&keywords=ps5+digital+edition&qid=1611600707&s=videogames&sprefix=ps5+dig%2Cvideogames%2C158&sr=1-4';
    
    const outOfStockText = ".outOfStock"
    //prevent captcha issues apparently  
    page.setJavaScriptEnabled(false)

    await page.goto(pageUrl)

    const outOfStockTextIsPresent = await page.$(outOfStockText);

    if (!outOfStockTextIsPresent) {
        return true;
    } else {
        return false;
    }

}

/**
 * Checks to see if Walmart has any PS5s in stock
 * Checks to see if we are redirected to the out of stock page - if not send alert
 * @param {*} page 
 */
async function checkIfAvailableAtWalmart(page) {
    const pageUrl ="https://www.walmart.ca/en/video-games/playstation-5/ps5-consoles/N-9857";
    
    const outOfStockRedirectUrl = "https://www.walmart.ca/en/ps5-xbox-xs-out-of-stock";
   
    //prevent captcha issues apparently  
    page.setJavaScriptEnabled(false)

    await page.goto(pageUrl);

    const currentUrl = await page.url(); 

    if (currentUrl === outOfStockRedirectUrl){
        return false;
    }else{
        return true;
    }


}

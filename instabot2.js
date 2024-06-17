//*This code was maded by Adam, Use npm i to make sure compatibility to this code
//Puppeteer Based

const puppeteer = require("puppeteer")
const fs = require("fs")
const OpenAI =require("openai")
const openai = new OpenAI({
    apiKey: 'openai-api-key',
})
async function standBy(){
const browser = await puppeteer.launch({args: ['--start-maximized'],headless: true,executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"})
const page = await browser.newPage()
await page.setDefaultTimeout(0)
await page.setViewport({
    width: 960,
    height: 480
});
async function logCookies(){
    await page.goto("https://www.instagram.com")
    await page.waitForTimeout(5000)
    const username = await page.$x("/html/body/div[2]/div/div/div[2]/div/div/div[1]/section/main/article/div[2]/div[1]/div[2]/form/div/div[1]/div/label/input")
    await username[0].type("username") //ur usename
    await page.waitForTimeout(3000)
    const password = await page.$x("/html/body/div[2]/div/div/div[2]/div/div/div[1]/section/main/article/div[2]/div[1]/div[2]/form/div/div[2]/div/label/input")
    await password[0].type("password") //ur password
    await page.waitForTimeout(3000)
    const button = await page.$x("/html/body/div[2]/div/div/div[2]/div/div/div[1]/section/main/article/div[2]/div[1]/div[2]/form/div/div[3]/button")
    await button[0].click()
    await page.waitForTimeout(50000)
    const cookies = await page.cookies();
    fs.writeFileSync("cookies.json", JSON.stringify(cookies, null, 2));
}
if(!fs.existsSync("cookies.json")){
await logCookies()
}
const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'));
  await page.setCookie(...cookies);
await page.goto("https://instagram.com/direct/inbox")
await page.waitForTimeout(15000)
console.log("Ready monitoring...")
async function getElementText(){
const output = await page.$x("/html/body/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/div/div/div/div[1]/div/div[1]/div/div[2]/div/div/div/div/div[2]/div/div[1]/div/div/div/div/div[2]/div/div[3]/div/span[1]/span")
    if (output.length > 0) {
        const textContent = await page.evaluate(element => element.textContent, output[0]);
        return textContent
    } else {
        console.log("Element not found");
    }
}
let usernames = ""
async function clickUsername(){
    const firstButton = await page.$x("/html/body/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/div/div/div/div[1]/div/div[1]/div/div[2]/div/div/div/div/div[2]/div/div[1]/div/div")
await firstButton[0].click()
}
async function reply(message){
    const urlpage = await page.url()
    let urlNow = urlpage.split("https://www.instagram.com/direct/t/")[1]
    usernames = urlNow
    console.log(`dari ${urlNow} Pesan ${await getElementText()}`)
if(urlNow = usernames){
    await page.waitForTimeout(5000)
    const box = await page.$x("/html/body/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/div/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div[1]/p")
    await box[0].type(message)
    await page.waitForTimeout(15000)
    const send = await page.$x("/html/body/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/div/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div[2]/div/div/div[3]")
    await send[0].click()
}else{
console.log("username Changing..")
await clickUsername()
usernames = urlNow
await page.waitForTimeout(5000)
const box = await page.$x("/html/body/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/div/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div[1]/p")
await box[0].type(message)
await page.waitForTimeout(15000)
}
}
let previousValue = await getElementText();
    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
const checkForChanges = async () => {
    while (true) {
        const currentValue = await getElementText();
        if (currentValue !== previousValue) {
            console.log(currentValue);
            if(!currentValue.startsWith("Active")&&!currentValue.startsWith("You:")){
                const ai = "ai"
if(currentValue.startsWith(ai)){
    const query = currentValue.slice(ai.length).trim()
    if(query){
    const chatcompletions = await openai.chat.completions.create({
        messages: [{ role: "user", content: `${query}` }],
        model: "gpt-3.5-turbo",
    });
    await reply(chatcompletions.choices[0].message.content)
    }
}
            }
            }
    
await checkForChanges();
        }
}
}
standBy()
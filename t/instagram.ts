import puppeteer from 'puppeteer'
import * as fs from 'node:fs'
import { Selector } from './functions'
import { IInsta } from './types'

export class Instagram implements IInsta {
  private page: puppeteer.Page;
  constructor(public options?: object, public cookie_path?: string){
  }
  private async getPage(): Promise<void>{
    try{
      let browser = await puppeteer.launch(this.options);
      this.page = await browser.newPage()
      await this.page.setRequestInterception(true);
      this.page.on('request', (req) => {
        if(req.resourceType() == 'image') req.abort()
        else req.continue()
      })
      process.on('close', async() => {
        await browser.close()
      })
    }catch(err){
      throw err;
    }
  }
  public async login(username: string, password: string, code?: string): Promise<puppeteer.Page>{
    await this.getPage()
    if (!this.cookie_path){
      await this.page.goto('https://www.instagram.com/accounts/login/');
      await this.page.waitForSelector(Selector.username);
      await this.page.type(Selector.username, username);
      await this.page.type(Selector.password, password);
      await this.page.click(Selector.submit);
      await this.page.waitForTimeout(5000);
      await this.page.setViewport({ width: 720, height: 1280 });
      let [verify] = await this.page.$x(Selector.code);
      if(verify){
        console.log('Verify code detected')
        await verify.click()
        await this.page.waitForSelector(Selector.verify);
        if (code){
          await this.page.type(Selector.verify, code);
          await this.page.click(Selector.submitCode);
        }
        await this.page.waitForTimeout(2000);
      }
      let [saveInfo] = await this.page.$x(Selector.info);
      if(saveInfo){
        await saveInfo.click()
      }
      let cookies = await this.page.cookies();
      fs.writeFileSync('instagram_cookies.json', JSON.stringify(cookies))
      console.log('Login suscess')
    } else {
      console.log('Login with cookie')
      let cookies = JSON.parse(fs.readFileSync(this.cookie_path).toString())
      cookies.forEach(async(i) => {
        await this.page.setCookie(i)
      })
      await this.page.goto('https://www.instagram.com/', {
        timeout: 0
      })
    }
    await this.page.waitForTimeout(2000);
    await this.page.screenshot({ path: 'login_insta.png' });
    return this.page

  }
}
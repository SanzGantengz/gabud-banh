import puppeteer from 'puppeteer';
export declare class Instagram implements IInsta {
    options?: object;
    private page;
    constructor(options?: object);
    private getPage;
    login(username: string, password: string, code?: string): Promise<puppeteer.Page>;
}

export interface IInsta {
  login(username: string, password: string, code?: string): Promise<puppeteer.Page>;
}
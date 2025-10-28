import { setWorldConstructor } from '@cucumber/cucumber';
import { Browser, Page, chromium } from '@playwright/test';

class CustomWorld {
  browser!: Browser;
  page!: Page;

  async init() {
    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage();
  }

  async close() {
    await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);
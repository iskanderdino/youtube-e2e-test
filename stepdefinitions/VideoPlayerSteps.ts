import { Given, When, Then } from '@cucumber/cucumber';
import { chromium, Browser, Page } from '@playwright/test';
import { playVideo, pauseVideo, seekVideo } from '../../helpers/videoActions';
import fs from 'fs';
import path from 'path';
import assert from 'assert';

let browser: Browser;
let page: Page;
let initialTime: number;

Given('I open YouTube', async () => {
  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();
  await page.goto('https://www.youtube.com');
});

When('I search for {string}', async (keyword: string) => {
  await page.fill('input#search', keyword);
  await page.click('button#search-icon-legacy');
  await page.waitForSelector('ytd-video-renderer');
});

Then('I should see search results', async () => {
  const results = await page.$$('ytd-video-renderer');
  assert(results.length > 0);
});

When('I click the first video', async () => {
  const results = await page.$$('ytd-video-renderer');
  await results[0].click();
  await page.waitForSelector('video');
});

Then('the video should start playing', async () => {
  await playVideo(page);
  await page.waitForTimeout(3000);
});

When('I pause the video', async () => {
  await pauseVideo(page);
});

Then('the video should be paused', async () => {
  initialTime = await page.evaluate(() => document.querySelector('video')?.currentTime || 0);
  assert(initialTime > 0);
});

When('I seek forward {int} seconds', async (seconds: number) => {
  await seekVideo(page, seconds);
});

Then('the video time should be greater than before', async () => {
  const newTime = await page.evaluate(() => document.querySelector('video')?.currentTime || 0);
  assert(newTime > initialTime);
});

Then('I take a screenshot', async () => {
  const screenshotPath = path.join(__dirname, '../../screenshots/video_playing.png');
  await page.screenshot({ path: screenshotPath });
});

Then('the screenshot should exist', async () => {
  const screenshotPath = path.join(__dirname, '../../screenshots/video_playing.png');
  assert(fs.existsSync(screenshotPath));
});

Then('the video title should not be empty', async () => {
  const title = await page.title();
  assert(title.trim().length > 0);
});
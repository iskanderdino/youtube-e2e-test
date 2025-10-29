/**
 * Video Player Step Definitions for Cucumber tests
 * This file contains the step definitions for YouTube video playback testing
 * using Playwright for browser automation and Cucumber for BDD testing
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { YouTubePage } from '../../pages/YoutubePage';
import { playVideo, pauseVideo, seekVideo, skipAdsIfPresent } from '../../helpers/videoActions';
import {GLOBAL_TIMEOUT} from '../../config';
import fs from 'fs';
import path from 'path';
import assert from 'assert';

let yt: YouTubePage;
let initialTime: number;

Given('I open YouTube', { timeout: GLOBAL_TIMEOUT}, async function () {
  yt = new YouTubePage(this.page);
  await yt.goto();
});

Then('the search box should be visible', async () => {
  const isVisible = await yt.isSearchBoxVisible();
  assert(isVisible, 'Search box should be visible');
});

When('I search for {string}', { timeout: 30000 }, async (keyword: string) => {
  await yt.search(keyword);
});

Then('I should see search results', async () => {
  const results = (await yt.getSearchResults()).count;
  assert(results.length > 0);
});

When('I click the first video', { timeout: GLOBAL_TIMEOUT }, async () => {
  await yt.clickFirstVideo();
});

Then('the video should start playing', async function () {
  await playVideo(yt);
  await this.page.waitForTimeout(3000);
});

When('I pause the video', { timeout: 15000 }, async function () {
  await pauseVideo(yt);
});

Then('the video should be paused', async () => {
  const paused = await yt.isPaused();
  assert(paused, 'Video should be paused');
  initialTime = await yt.getCurrentTime();
});

When('I seek forward {int} seconds', async function (seconds: number) {
  await seekVideo(yt, seconds);
});

Then('the video time should be greater than before', async () => {
  const newTime = await yt.getCurrentTime();
  assert(newTime > initialTime);
});

Then('I take a screenshot', async function () {
  const screenshotPath = path.join(__dirname, '../../screenshots/video_playing.png');
  await yt.takeScreenshot(screenshotPath);
});

Then('the screenshot should exist in the screenshots folder', async function () {
  const screenshotPath = path.join(__dirname, '../../screenshots/video_playing.png');
  assert(fs.existsSync(screenshotPath));
});

Then('the video title should not be empty', async () => {
  const title = await yt.getTitle();
  assert(title.trim().length > 0);
});

Then('the video title should be empty', async () => {
  const title = await yt.getTitle();
  assert(title.trim().length === 0);
});

Then('I skip ads if present', { timeout: GLOBAL_TIMEOUT }, async function () {
  await skipAdsIfPresent(yt);
});

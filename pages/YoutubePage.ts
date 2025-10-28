/**
 * YouTube Page Object Model
 * This class encapsulates all interactions with the YouTube website
 * using Playwright's Page object for browser automation
 */

import { Page } from '@playwright/test';

export class YouTubePage {
  constructor(private page: Page) {}

  // Page Object Locators
  private searchTextBox = this.page.locator('input[placeholder="Search"]');
  private searchButton = this.page.locator('button#search-icon-legacy');
  private videoPlayer = this.page.locator('.html5-video-player');
  private playPauseButton = this.page.locator('.ytp-play-button');
  private videoElement = this.page.locator('video');

  async isSearchBoxVisible(): Promise<boolean> {
    return await this.searchTextBox.isVisible();
  }

  async goto() {
    await this.page.goto('https://www.youtube.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.page.waitForLoadState('networkidle');
  }

  async search(keyword: string) {
    // Fill the search input field with the keyword
    await this.searchTextBox.fill(keyword);
    // Press Enter to submit the search
    await this.searchTextBox.press('Enter');
    // Wait for search results to load
    await this.page.waitForSelector('ytd-video-renderer', { timeout: 60000 });
  }

  async getSearchResults() {
    return await this.page.$$('ytd-video-renderer');
  }

  async clickFirstVideo() {
    const results = await this.getSearchResults();
    await results[0].click();
    await this.page.waitForSelector('video', { timeout: 30000 });
  }

  async getVideoElement() {
    return await this.page.$('video');
  }

  async getCurrentTime(): Promise<number> {
    return await this.page.evaluate(() => document.querySelector('video')?.currentTime || 0);
  }

  async isPaused(): Promise<boolean> {
    return await this.page.evaluate(() => document.querySelector('video')?.paused || false);
  }

  async getPlaybackRate(): Promise<number> {
    return await this.page.evaluate(() => document.querySelector('video')?.playbackRate || 1);
  }

  async setPlaybackRate(rate: number) {
    await this.page.evaluate((r) => {
      const video = document.querySelector('video');
      if (video) video.playbackRate = r;
    }, rate);
  }

  async toggleCaptions() {
    const button = await this.page.$('button[aria-label*="Subtitles"]');
    if (button) await button.click();
  }

  async takeScreenshot(filePath: string) {
    await this.page.screenshot({ path: filePath });
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async skipAdsIfPresent() {
    // Delegate to the helper function for reusability
    const { skipAdsIfPresent } = await import('../helpers/videoActions');
    await skipAdsIfPresent(this.page);
  }
}
/**
 * YouTube Page Object Model
 * This class encapsulates all interactions with the YouTube website
 * using Playwright's Page object for browser automation
 */

import { Page, Locator } from '@playwright/test';
import { YOUTUBE_URL, GLOBAL_TIMEOUT } from '../config';

export class VideoResult {
  constructor(private element: Locator) {}

  public title = this.element.locator('#video-title');

  async clickTitle() {
    await this.title.click();
  }
}

export class YouTubePage {
  constructor(public page: Page) {}

  // Page Object Locators
  public searchTextBox = this.page.locator('input[placeholder="Search"]');
  public searchButton = this.page.locator('button#search-icon-legacy');
  public videoPlayer = this.page.locator('#movie_player');
  public playPauseButton = this.page.locator('.ytp-play-button');
  public videoElement = this.page.locator('#movie_player video');
  public searchResultContainers = this.page.locator('ytd-video-renderer');

  async isSearchBoxVisible(): Promise<boolean> {
    return await this.searchTextBox.isVisible();
  }

  async goto() {
    await this.page.goto(YOUTUBE_URL, { waitUntil: 'domcontentloaded', timeout: GLOBAL_TIMEOUT });
    await this.page.waitForLoadState('networkidle');
  }

  async search(keyword: string) {
    // Fill the search input field with the keyword
    await this.searchTextBox.fill(keyword);
    // Press Enter to submit the search
    await this.searchTextBox.press('Enter');
    // Wait for search results to load
    await this.searchResultContainers.first().waitFor({timeout: 6000});
  }

  async getSearchResults() {
    return await this.searchResultContainers;
  }

  async clickFirstVideo() {
    const firstResult = new VideoResult(this.searchResultContainers.first());
+   await firstResult.clickTitle();
    await this.videoElement.waitFor({ timeout: GLOBAL_TIMEOUT });
  }

  async getVideoElement() {
    return await this.videoElement;
  }

  async getCurrentTime(): Promise<number> {
    return await this.videoElement.evaluate((video: HTMLVideoElement) => video.currentTime || 0);
  }

  async isPaused(): Promise<boolean> {
    return await this.videoElement.evaluate((video: HTMLVideoElement) => video.paused || false);
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
    await skipAdsIfPresent(this);
  }
}
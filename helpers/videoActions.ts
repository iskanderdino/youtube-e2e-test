/**
 * Video Action Helpers
 * This module contains helper functions for interacting with YouTube video elements
 * using Playwright's Page object. These functions handle play, pause, and seek operations.
 */

import { Page } from '@playwright/test';

/**
 * Plays the video if it's currently paused
 * @param page - Playwright Page instance
 */
export async function playVideo(page: Page) {
  const isPaused = await page.evaluate(() => {
    const video = document.querySelector('video');
    return video ? video.paused : false;
  });
  if (isPaused) {
    await page.click('.ytp-play-button');
    console.log('▶️ Video started');
  } else {
    console.log('▶️ Video is already playing');
  }
}

/**
 * Pauses the video if it's currently playing
 * @param page - Playwright Page instance
 */
export async function pauseVideo(page: Page) {
  const isPaused = await page.evaluate(() => {
    const video = document.querySelector('video');
    return video ? video.paused : false;
  });
  if (!isPaused) {
    // Hover over the video to show controls
    await page.hover('.html5-video-player');
    await page.locator('.ytp-play-button').click();
    // Wait for the video to be paused
    await page.waitForFunction(() => {
      const video = document.querySelector('video');
      return video ? video.paused : false;
    }, { timeout: 5000 });
    console.log('⏸️ Video paused');
  } else {
    console.log('⏸️ Video is already paused');
  }
}

/**
 * Seeks the video forward by the specified number of seconds
 * @param page - Playwright Page instance
 * @param seconds - Number of seconds to seek forward
 */
export async function seekVideo(page: Page, seconds: number) {
  await page.evaluate((s) => {
    const video = document.querySelector('video');
    if (video) video.currentTime += s;
  }, seconds);
  console.log(`⏩ Skipped ahead ${seconds} seconds`);
}

/**
 * Skips ads if present on the YouTube video player
 * @param page - Playwright Page instance
 */
export async function skipAdsIfPresent(page: Page) {
  try {
    // Wait a bit for potential ad to load
    await page.waitForTimeout(3000);

    // Check for ad presence using locators
    const adLocators = [
      page.locator('.ytp-ad-player-overlay'),
      page.locator('.ytp-ad-text'),
      page.locator('.ytp-ad-preview-text'),
      page.locator('.ytp-ad-module'),
      page.locator('.ytp-ad-overlay'),
      page.locator('.ytp-ad-player-overlay-instream-info'),
      page.locator('.ytp-ad-skip-button-modern')
    ];

    let adDetected = false;
    for (const locator of adLocators) {
      if (await locator.isVisible({ timeout: 2000 }).catch(() => false)) {
        adDetected = true;
        break;
      }
    }

    // Also check for ad text in body
    const adText = await page.locator('body').textContent();
    if (adText && (adText.includes('Ad') || adText.includes('Advertisement') || adText.includes('Skip'))) {
      adDetected = true;
    }

    if (adDetected) {
      console.log('📺 Ad detected, attempting to skip...');

      // Try multiple skip button selectors with polling
      const skipSelectors = [
        '.ytp-ad-skip-button',
        '.ytp-ad-skip-button-modern',
        'button[aria-label*="Skip"]',
        'button:has-text("Skip")',
        'button:has-text("Skip Ad")',
        '.ytp-skip-ad-button',
        '[class*="skip"][class*="button"]',
        'button[class*="ad-skip"]'
      ];

      let skipped = false;
      const maxAttempts = 20; // Poll for up to 20 seconds
      for (let attempt = 0; attempt < maxAttempts && !skipped; attempt++) {
        for (const selector of skipSelectors) {
          try {
            const skipButton = page.locator(selector);
            if (await skipButton.isVisible({ timeout: 100 }).catch(() => false)) {
              // Wait a bit more to ensure it's fully loaded
              await page.waitForTimeout(500);
              // Hover to ensure it's interactable
              await skipButton.hover({ timeout: 1000 });
              // Click the button
              await skipButton.click({ timeout: 2000 });
              console.log('⏭️ Skipped ad successfully');
              skipped = true;
              break;
            }
          } catch (e) {
            // Continue to next selector
            continue;
          }
        }
        if (!skipped) {
          await page.waitForTimeout(1000); // Wait 1 second before next attempt
        }
      }

      if (!skipped) {
        console.log('⚠️ Skip button not found or not clickable, ad may be non-skippable');
      }
    } else {
      console.log('✅ No ad present');
    }
  } catch (error) {
    console.log('✅ No ad to skip or ad handling failed gracefully');
  }
}

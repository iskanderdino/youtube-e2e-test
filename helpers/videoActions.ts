/**
 * Video Action Helpers
 * This module contains helper functions for interacting with YouTube video elements
 * using the YouTubePage object. These functions handle play, pause, and seek operations.
 */

import { GLOBAL_TIMEOUT } from '../config';
import { YouTubePage } from '../pages/YoutubePage';

/**
 * Plays the video if it's currently paused
 * @param youtubePage - YouTubePage instance
 */
export async function playVideo(youtubePage: YouTubePage) {
  const isPaused = await youtubePage.page.evaluate(() => {
    const video = document.querySelector('video');
    return video ? video.paused : false;
  });
  if (isPaused) {
    await youtubePage.playPauseButton.click();
    console.log('▶️ Video started');
  } else {
    console.log('▶️ Video is already playing');
  }
}

/**
 * Pauses the video if it's currently playing
 * @param youtubePage - YouTubePage instance
 */
export async function pauseVideo(youtubePage: YouTubePage) {
  const isPaused = await youtubePage.page.evaluate(() => {
    const video = document.querySelector('video');
    return video ? video.paused : false;
  });
  if (!isPaused) {
    // Hover over the video to show controls
    await youtubePage.videoPlayer.hover();
    await youtubePage.playPauseButton.click();
    // Wait for the video to be paused
    await youtubePage.page.waitForFunction(() => {
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
 * @param youtubePage - YouTubePage instance
 * @param seconds - Number of seconds to seek forward
 */
export async function seekVideo(youtubePage: YouTubePage, seconds: number) {
  await youtubePage.page.evaluate((s: number) => {
    const video = document.querySelector('video');
    if (video) video.currentTime += s;
  }, seconds);
  console.log(`⏩ Skipped ahead ${seconds} seconds`);
}

/**
 * Skips ads if present on the YouTube video player
 * @param youtubePage - YouTubePage instance
 */
export async function skipAdsIfPresent(youtubePage: YouTubePage) {
  try {
    // Wait a bit for potential ad to load
    await youtubePage.page.waitForTimeout(3000);

    // Check for ad presence using locators
    const adLocators = [
      youtubePage.page.locator('.ytp-ad-player-overlay'),
      youtubePage.page.locator('.ytp-ad-text'),
      youtubePage.page.locator('.ytp-ad-preview-text'),
      youtubePage.page.locator('.ytp-ad-module'),
      youtubePage.page.locator('.ytp-ad-overlay'),
      youtubePage.page.locator('.ytp-ad-player-overlay-instream-info'),
      youtubePage.page.locator('.ytp-ad-skip-button-modern')
    ];

    // Check if ad is visible when video starts, set adDetected to true if it does
    let adDetected = false;
    for (const locator of adLocators) {
      if (await locator.isVisible({ timeout: 2000 }).catch(() => false)) {
        adDetected = true;
        break;
      }
    }

    // Also check for ad text in body
    const adText = await youtubePage.page.locator('body').textContent();
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
            const skipButton = youtubePage.page.locator(selector);
            if (await skipButton.isVisible({ timeout: 100 }).catch(() => false)) {
              // Wait a bit more to ensure it's fully loaded
              await youtubePage.page.waitForTimeout(500);
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
          await youtubePage.page.waitForTimeout(1000); // Wait 1 second before next attempt
        }
      }

      if (!skipped) {
        console.log('⚠️ Skip button not found, assuming short ad (<10s), waiting for ad to complete...');
        // Wait for ad to disappear (up to 30 seconds for safety)
        await youtubePage.page.waitForFunction(() => {
          const adElements = document.querySelectorAll('.ytp-ad-player-overlay, .ytp-ad-text, .ytp-ad-preview-text, .ytp-ad-module, .ytp-ad-overlay, .ytp-ad-player-overlay-instream-info');
          return Array.from(adElements).every(el => !(el as HTMLElement).offsetParent);
        }, { timeout: GLOBAL_TIMEOUT }).catch(() => {
          console.log('⚠️ Ad did not disappear within timeout, proceeding...');
        });
        console.log('✅ Ad completed');
      }
    } else {
      console.log('✅ No ad present');
    }
  } catch (error) {
    console.log('✅ No ad to skip or ad handling failed gracefully');
  }
}

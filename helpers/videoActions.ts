import { Page } from '@playwright/test';

export async function playVideo(page: Page) {
  await page.click('button[aria-label="Play"]');
  console.log('▶️ Video started');
}

export async function pauseVideo(page: Page) {
  await page.click('button[aria-label="Pause"]');
  console.log('⏸️ Video paused');
}

export async function seekVideo(page: Page, seconds: number) {
  await page.evaluate((s) => {
    const video = document.querySelector('video');
    if (video) video.currentTime += s;
  }, seconds);
  console.log(`⏩ Skipped ahead ${seconds} seconds`);
}
import { Before, After } from '@cucumber/cucumber';
import fs from 'fs';
import path from 'path';

Before(async function () {
  await this.init();
});

After(async function (scenario) {
  if (scenario.result?.status === 'FAILED') {
    const name = scenario.pickle.name.replace(/\s+/g, '_');
    const screenshotPath = path.join(__dirname, '../../screenshots', `${name}.png`);
    await this.page.screenshot({ path: screenshotPath });
    // Note: this.attach is not available in Cucumber v10, screenshots are saved to file instead
  }
  await this.close();
});

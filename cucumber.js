/**
 * Cucumber Configuration
 * This file configures Cucumber.js for running BDD tests with TypeScript support
 * and custom timeout settings for YouTube E2E tests
 */

module.exports = {
  // Default command line arguments for Cucumber
  default: [
    '--require-module ts-node/register --require features/stepdefinitions/**/*.ts features/**/*.feature',
    '--require-module ts-node/regis',
    '--format @cucumber/html-formatter',
  ],    
  // Global timeout for all steps (30 seconds to handle YouTube loading)
  timeout: 30000,
  
};

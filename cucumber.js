/**
 * Cucumber Configuration
 * This file configures Cucumber.js for running BDD tests with TypeScript support
 * and custom timeout settings for YouTube E2E tests
 */

module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'features/support/**/*.ts',
      'features/stepdefinitions/**/*.ts'
    ],
    format: ['json:reports/cucumber-report.json'],
    paths: ['features/**/*.feature'],
    timeout: 30000
  },
};

const reporter = require('multiple-cucumber-html-reporter');

console.log('Generating report...');

reporter.generate({
  jsonDir: 'reports',
  reportPath: 'reports/html',
  reportName: 'QA Automation Report',
  pageTitle: 'YouTube E2E Test Results',   
  metadata: {
    browser: {
      name: 'chromium',
      version: 'latest'
    },
    device: 'Local test machine',
    platform: {
      name: process.platform,
      version: process.version
    }
  },
  customData: {
    title: 'Run Info',
    data: [
      { label: 'Project', value: 'YouTube E2E Test' },
      { label: 'Release', value: '1.0.0' },
      { label: 'Executed By', value: 'Iskander Diño' },
      { label: 'Execution Start Time', value: new Date().toLocaleString() },
      { label: 'Execution End Time', value: new Date().toLocaleString() }
    ]
  },
  screenshotsDirectory: 'screenshots', // 👈 This is key
  automaticallyAddScreenshots: true
});
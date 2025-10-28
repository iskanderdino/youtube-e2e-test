import reporter from 'multiple-cucumber-html-reporter';

reporter.generate({
  jsonDir: 'reports',
  reportPath: 'reports/html',
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
      { label: 'Execution Start Time', value: new Date().toLocaleString() },
      { label: 'Execution End Time', value: new Date().toLocaleString() }
    ]
  }
});
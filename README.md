# YouTube E2E Test Suite

This project uses **Playwright** and **Cucumber** to run end-to-end tests on YouTube video playback functionality. The test suite validates core video player features including search, playback controls, seeking, and screenshot capture.

## ✅ Features Tested

- **Search functionality**: Searching for videos and displaying results
- **Video playback**: Play/pause controls with state validation
- **Seek/skip**: Forward seeking by specified time intervals
- **Screenshot capture**: Taking and validating screenshots of video content
- **Title validation**: Ensuring video titles are properly loaded

## 🏗️ Project Structure

```
youtube-e2e-test/
├── features/                    # Cucumber feature files
│   └── YoutubeTests.feature     # Main test scenarios
├── stepdefinitions/             # Step definition implementations
│   └── VideoPlayerSteps.ts      # Step definitions for video tests
├── pages/                       # Page Object Model classes
│   └── YoutubePage.ts           # YouTube page interactions
├── helpers/                     # Helper functions and utilities
│   └── videoActions.ts          # Video control helper functions
├── screenshots/                 # Screenshot storage directory
├── test-results/                # Test execution results
├── cucumber.js                  # Cucumber configuration
├── package.json                 # Project dependencies and scripts
└── README.md                    # This file
```

## 🚀 Setup

### Prerequisites
- **Node.js Installation**: Download from https://nodejs.org/en/download/
  - Windows: Download the MSI file
  - macOS: Download the PKG file

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/youtube-e2e-test.git
cd youtube-e2e-test

# Install dependencies
npm install
npm install @cucumber/cucumber
npm install playwright
npm install --save-dev @cucumber/html-formatter
npm install --save-dev multiple-cucumber-html-reporter

# Install Playwright browsers
npx playwright install
```

### Run All Tests
```bash
npm run test:e2e
```
**NOTE:** this will also automatically generate report after test execution is completed

### Run Tests with Specific Tags
```bash
npx cucumber-js --tags "@e2e"
```

### Run Tests in Headless Mode
Modify the browser launch in `stepdefinitions/VideoPlayerSteps.ts` to set `headless: true`.

## 📋 Test Scenarios

The main test scenario covers:
1. Opening YouTube homepage
2. Searching for "QA automation" videos
3. Clicking the first video result
4. Playing the video
5. Pausing the video
6. Seeking forward 10 seconds
7. Taking a screenshot
8. Validating screenshot existence and video title

## 🛠️ Configuration

- **Cucumber timeout**: 30 seconds (configured in `cucumber.js`)
- **Browser**: Chromium (non-headless for visual verification)
- **Test framework**: Cucumber with TypeScript support
- **Assertions**: Node.js built-in assert module

## 📁 Key Files

- `features/YoutubeTests.feature`: BDD test scenarios
- `stepdefinitions/VideoPlayerSteps.ts`: Step implementations
- `pages/YoutubePage.ts`: Page Object Model for YouTube interactions
- `helpers/videoActions.ts`: Video control helper functions
- `cucumber.js`: Test runner configuration
- `reports`: generated reports will be saved here

## 🔧 PLUGIN INSTALLATION IN VSCODE (Required for Cucumber Framework)
- Cucumber by Cucumber
- Cucumber (Gherking) Full Support by Alexander Krechik
- ESLint-Fix by Lyngai

## Issues / TODO
- Skip button not found or not clickable, ad may be non-skippable
- Attach screenshot in html report

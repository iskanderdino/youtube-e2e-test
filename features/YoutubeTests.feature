# E2E test tag for end-to-end testing
@e2e @regression
Feature: YouTube video playback
  # This feature tests the basic video playback functionality on YouTube
  # including search, play, pause, seek, and screenshot capture
  Background:
    Given I open YouTube
    Then the search box should be visible

  Scenario: Verify if user is able to Search and play the first video on the Search Result
    When I search for "QA automation"
    Then I should see search results
    When I click the first video
    Then I skip ads if present
    And the video should start playing
    When I pause the video
    Then the video should be paused
    When I seek forward 5 seconds
    Then the video time should be greater than before
    When I take a screenshot
    Then the screenshot should exist in the screenshots folder
    #And the video title should not be empty

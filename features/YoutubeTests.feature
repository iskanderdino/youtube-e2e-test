@e2e    
Feature: YouTube video playback

  Scenario: Search and play a video
    Given I open YouTube
    When I search for "QA automation"
    Then I should see search results
    When I click the first video
    Then the video should start playing
    When I pause the video
    Then the video should be paused
    When I seek forward 10 seconds
    Then the video time should be greater than before
    Then I take a screenshot
    And the screenshot should exist
    And the video title should not be empty
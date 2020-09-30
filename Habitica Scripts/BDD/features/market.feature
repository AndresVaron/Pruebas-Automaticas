Feature: Try buy a reward
    As an logged user I want try buy a reward in habitica website

Scenario: Buy rewards fail with insufficient gold

  Given I am a user logged in habitica website
    When I go to market side
    And I select a reward
    And I try to buy
    Then I expect to see the same screen


Scenario: Buy rewards success

  Given I am a user logged in habitica website
    When I go to market side
    And I select a reward
    And I try to buy
    Then I expect to see the main screen
Feature: Create, edit and delete a Reward
    As an logged user I want to create, edit and delete a reward in habitica website

Scenario Outline: Create rewards success with right inputs

  Given I am a user logged in habitica website
    When I go to tasks side
    And I fill rewards info with <reward> and type enter to create
    Then I expect to see reward ticket with <title>

    Examples:
      | reward     | title        |
      | Reward BDD | "Reward BDD" |


Scenario Outline: Edit reward success with right inputs

  Given I am a user logged in habitica website
    When I go to tasks side
    And I open a reward ticket
    And I fill reward ticket with <reward>, <notes>, <cost> and <tag>
    And I save the changes 
    Then I expect to see reward ticket with <title>

    Examples:
      | reward     | notes                 | cost | tag  | title        |
      | Editandolo | Las notas del editado | 3    | Work | "Editandolo" |

Scenario Outline: Delete reward task success

  Given I am a user logged in habitica website
    When I go to tasks side
    And I open a reward ticket
    And I delete the ticket 
    Then I expect to see ticket alert with <message>

    Examples:
      | message                                        |
      | "Are you sure you want to delete this Reward?" |
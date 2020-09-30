Feature: Create, edit and delete a Daily task
    As an logged user I want to create, edit and delete a Daily task in habitica website

Scenario Outline: Create dailies success with right inputs

  Given I am a user logged in habitica website
    When I go to tasks side
    And I fill dailies info with <daily> and type enter to create
    Then I expect to see daily ticket with <title>

    Examples:
      | daily      | title        |
      | Daily BDD  | "Daily BDD"  |


Scenario Outline: Edit daily task success with right inputs

  Given I am a user logged in habitica website
    When I go to tasks side
    And I open a daily ticket
    And I fill daily ticket with <daily>, <notes>, <difficulty>, <tag> and <repets>
    And I save the changes 
    Then I expect to see daily ticket with <title>

    Examples:
      | daily      | notes                 | difficulty | tag  | repets  | title        |
      | Editandolo | Las notas del editado | Trivial    | Work | Daily   | "Editandolo" |

Scenario Outline: Delete daily task success

  Given I am a user logged in habitica website
    When I go to tasks side
    And I open a daily ticket
    And I delete the ticket 
    Then I expect to see ticket alert with <message>

    Examples:
      | message                                       |
      | "Are you sure you want to delete this Daily?" |
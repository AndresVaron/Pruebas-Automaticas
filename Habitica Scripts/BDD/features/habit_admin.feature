Feature: Create, edit and delete an habit
    As an logged user I want to create, edit and delete an habit in habitica website

Scenario Outline: Create habit success with right inputs

  Given I am a user logged in habitica website
    When I go to tasks side
    And I fill habit info with <habit> and type enter to create
    Then I expect to see habit ticket with <title>

    Examples:
      | habit      | title        |
      | Habito BDD | "Habito BDD" |


Scenario Outline: Edit habit success with right inputs

  Given I am a user logged in habitica website
    When I go to tasks side
    And I open an habit ticket
    And I fill habit ticket with <habit>, <notes>, <difficulty>, <tag> and <reset>
    And I save the changes 
    Then I expect to see habit ticket with <title>

    Examples:
      | habit      | notes                 | difficulty | tag  | reset  | title        |
      | Editandolo | Las notas del editado | Trivial    | Work | Weekly | "Editandolo" |

Scenario Outline: Delete habit success

  Given I am a user logged in habitica website
    When I go to tasks side
    And I open an habit ticket
    And I delete the ticket 
    Then I expect to see ticket alert with <message>

    Examples:
      | message                                       |
      | "Are you sure you want to delete this Habit?" |
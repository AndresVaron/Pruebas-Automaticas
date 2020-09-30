Feature: Create, edit and delete a ToDo task
    As an logged user I want to create, edit and delete a ToDo task in habitica website

Scenario Outline: Create dailies success with right inputs

  Given I am a user logged in habitica website
    When I go to tasks side
    And I fill ToDo info with <todo> and type enter to create
    Then I expect to see ToDo ticket with <title>

    Examples:
      | todo       | title        |
      | ToDo BDD   | "ToDo BDD"   |


Scenario Outline: Edit ToDo task success with right inputs

  Given I am a user logged in habitica website
    When I go to tasks side
    And I open a ToDo ticket
    And I fill ToDo ticket with <todo>, <notes>, <difficulty> and <tag>
    And I save the changes 
    Then I expect to see ToDo ticket with <title>

    Examples:
      | todo       | notes                 | difficulty | tag  | title        |
      | Editandolo | Las notas del editado | Trivial    | Work | "Editandolo" |

Scenario Outline: Delete ToDo task success

  Given I am a user logged in habitica website
    When I go to tasks side
    And I open a ToDo ticket
    And I delete the ticket 
    Then I expect to see ticket alert with <message>

    Examples:
      | message                                       |
      | "Are you sure you want to delete this To Do?" |
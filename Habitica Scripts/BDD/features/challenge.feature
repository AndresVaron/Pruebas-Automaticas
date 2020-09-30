Feature: Create a challange
    As an logged user I want to create a challenge in habitica website in order to create a challenge

Scenario Outline: Create challenge failed with wrong inputs

  Given I am a user logged in habitica website
    When I go to challenge side
    And I go to create challenge button
    And I fill challenge info with <name>, <shortname>, <summary>, <challengedesc>, <addto>, <categories> and <prize>
    And I try create challenge
    Then I expect to see challenge alert <error>

    Examples:
      | name    | shortname | summary                    | challengedesc   | addto             | categories   | prize | error                                                |
      |         |           |                            |                 |                   |              |       | "Name is required"                                   |
      |         | test      | Esta es la prueba cucumber | Sin descripción | Public Challenges | academics    | 20    | "Name is required"                                   |
      | pruebas |           | Esta es la prueba cucumber | Sin descripción | Public Challenges | academics    | 20    | "Tag name is too short"                              |
      | pruebas | test      |                            | Sin descripción | Public Challenges | academics    | 20    | "Summary is required"                                |
      | pruebas | test      | Esta es la prueba cucumber |                 | Public Challenges | academics    | 20    | "Description is required"                            |
      | pruebas | test      | Esta es la prueba cucumber | Sin descripción |                   | academics    | 20    | "Location of challenge is required ('Add to')"       |
      | pruebas | test      | Esta es la prueba cucumber | Sin descripción | Public Challenges |              | 20    | "One or more categories must be selected"            |

Scenario Outline: Create challenge success with right inputs

  Given I am a user logged in habitica website
    When I go to challenge side
    And I go to create challenge button
    And I fill challenge info with <name>, <shortname>, <summary>, <challengedesc>, <addto>, <categories> and <prize>
    And I try create challenge
    Then I expect to see challenge alert <error>

    Examples:
      | name    | shortname | summary                    | challengedesc   | addto             | categories   | prize | error                                                |
      | pruebas | test      | Esta es la prueba cucumber | Sin descripción | Public Challenges | academics    | 20    | "You can't afford this prize."                       |
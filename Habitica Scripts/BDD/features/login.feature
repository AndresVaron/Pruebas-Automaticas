Feature: Login into habitica
    As an user I want to authenticate myself within habitica website in order to rate teachers

Scenario Outline: Login failed with wrong inputs

  Given I go to habitica home screen
    When I open the login screen
    And I fill with <email> and <password>
    And I try to login
    Then I expect to see <error>

    Examples:
      | email            | password | error                                                             |
      |                  |          | "Missing username or email."                                       |
      | miso@gmail.com   |    1234  | "Uh-oh - your email address / username or password is incorrect." |


Scenario Outline: Login success with right inputs

  Given I go to habitica home screen
    When I open the login screen
    And I fill with <email> and <password>
    And I try to login
    Then I expect to see tasks button

    Examples:
      | email    | password         |
      | pa_test  | fake@email.com   |



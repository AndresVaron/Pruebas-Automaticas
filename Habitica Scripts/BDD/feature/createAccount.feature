Feature: Create account into habitica
    As an user I want to create myself account within habitica website

Scenario Outline: Crate account failed with wrong inputs

  Given I go to habitica home screen
    When I check the signup form
    And I fill account info with <username>, <email>, <password> and <confirmpass>
    And I try to register
    Then I expect to see signup <error>

    Examples:
      | username  | email            | password | confirmpass | error                                                |
      |           |                  |          |             | "Missing username. Missing email. Missing password." |
      | pa_test   | miso@gmail.com   | Prueba12 | Prueba12    | "Username already taken."                            |
      | pa_test1  | miso@gmail.com   | Prueba1  |             | "Password must be 8 characters or more."             |
      | pa_test1  | miso@gmail.com   | Prueba12 | Prueba13    | "Password confirmation doesn't match password."      |
      |           | miso@gmail.com   | Prueba12 | Prueba12    | "Missing username."                                  |
      | pa_test1  |                  | Prueba12 | Prueba12    | "Missing email."                                     |
      | pa_test1  | miso@gmail.com   |          |             | "Missing password."                                  |



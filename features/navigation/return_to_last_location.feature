Feature: Exit an application
    As the user of a TAL application
    I want to be able to exit an application
    In order to use my device to do something else

Scenario: Return to point of launch
    Given I am using a TAL application
    And I ask that application to exit
    Then the device returns to where it was before the application launched
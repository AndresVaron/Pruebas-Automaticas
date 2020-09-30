var {When} = require('cucumber');
var {Then} = require('cucumber');
var {expect} = require('chai');

When('I open the login screen', () => {
  $('a=Login').waitForExist(5000);
  $('a=Login').waitForDisplayed(5000);
  $('a=Login').click();
});

When('I try to login', () => {
  $('button[type="submit"').click();
});

When(/^I fill with (.*) and (.*)$/ , (user, password) => {

 var userInput = $('#usernameInput');
 userInput.click();
 userInput.keys(user);

 var passwordInput = $('#passwordInput');
 passwordInput.click();
 passwordInput.keys(password)
});

Then('I expect to see {string}', error => {
  $('.text.col-12').waitForDisplayed(5000);
  var alertText = browser.$('.text.col-12').getText();
  expect(alertText).to.include(error);
});

Then('I expect to see tasks button', () => {
	$('a=Tasks').waitForExist(5000)
});
var {Given} = require('cucumber');
var {When} = require('cucumber');
var {Then} = require('cucumber');
var {expect} = require('chai');

When('I check the signup form', () =>{
  $('.form').waitForExist(5000);
});

Then('I expect to see signup {string}', error => {
  if ($('button[type="submit"').isEnabled()){
    $('.text.col-12').waitForDisplayed(5000);
    var alertText = browser.$('.text.col-12').getText();
    expect(alertText).to.include(error);
  }
  else{
    var inputError = browser.$('.input-error').getText();
    expect(inputError).to.include(error);
  }

});

When(/^I fill account info with (.*), (.*), (.*) and (.*)$/ , (username, email, password, confirmpass) => {
 var formSignUp = $('.form');

 var usernameInput = formSignUp.$('#usernameInput');
 usernameInput.click();
 usernameInput.keys(username);

 var mailInput = formSignUp.$('input[type="email"]');
 mailInput.click();
 mailInput.keys(email);
 
 var passwordInput = formSignUp.$('input[placeholder="Password"]');
 passwordInput.click();
 passwordInput.keys(password)

 var confirmpasswordInput = formSignUp.$('input[placeholder="Confirm Password"]');
 confirmpasswordInput.click();
 confirmpasswordInput.keys(confirmpass)

});

When('I try to register', () => {
  var formSignUp = $('.form');
  formSignUp.$('button[type="submit"').click();
});

Then('I expect to see get started button', () => {
  $('button=Get Started!').waitForDisplayed(5000);
});
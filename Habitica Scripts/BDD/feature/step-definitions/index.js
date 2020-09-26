var {Given} = require('cucumber');
var {When} = require('cucumber');
var {Then} = require('cucumber');
var {expect} = require('chai');

Given('I go to habitica home screen', () => {
  browser.url('/');
});

When('I open the login screen', () => {
  $('a=Login').waitForExist(5000);
  $('a=Login').waitForDisplayed(5000);
  $('a=Login').click();
});

When('I check the signup form', () =>{
  $('.form').waitForExist(5000);
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

Then('I expect to see tasks button', () => {
	$('a=Tasks').waitForExist(5000)
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

 Then(/^I expect to see success or repet account (.*)$/ , (email) => {
   if (email == "miso@gmail.com"){
   		$(".sweet-alert ").waitForDisplayed(1000);
	   	var alertText = browser.$('.lead').getText();
   		expect(alertText).to.include("Error: Ya existe un usuario registrado con el correo 'miso@gmail.com'");
   }
   else{
   		$(".sweet-alert ").waitForDisplayed(1000);
	   	var alertText = browser.$('.sweet-alert ').getText();
   		expect(alertText).to.include("Registro exitoso!");
   }
 });
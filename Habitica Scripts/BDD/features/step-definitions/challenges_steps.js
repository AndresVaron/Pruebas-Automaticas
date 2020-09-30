var {Given} = require('cucumber');
var {When} = require('cucumber');
var {Then} = require('cucumber');
var {expect} = require('chai');

When('I go to challenge side', () => {
  $('a=Challenges').waitForExist(5000);
  $('a=Challenges').waitForDisplayed(5000);
  $('a=Challenges').click();
});

When('I go to create challenge button', () => {
  $('.create-challenge-button').click();
  browser.pause(3000);
});

When(/^I fill challenge info with (.*), (.*), (.*), (.*), (.*), (.*) and (.*)$/ , (name, shortname, summary, challengedesc, addto, categories, prize) => {
 var challengeForm = $('.form');

 var nameInput = challengeForm.$('input[placeholder="What is your Challenge name?"]');
 nameInput.click();
 nameInput.keys(name);

 var shortNameInput = challengeForm.$('input[placeholder="What short tag should be used to identify your Challenge?"]');
 shortNameInput.click();
 shortNameInput.keys(shortname);
 // var summaryInput = challengeForm.$('input[placeholder="Write a short description advertising your Challenge to other Habiticans. What is the main purpose of your Challenge and why should people join it? Try to include useful keywords in the description so that Habiticans can easily find it when they search!"]');
 // var summaryInput = challengeForm.$$('textarea')[0];
 var summaryInput = challengeForm.$('.summary-textarea');
 summaryInput.click();
 summaryInput.keys(summary);

 var descInput = challengeForm.$('.description-textarea');
 descInput.click();
 descInput.keys(challengedesc);

 if(addto != ""){
 	var addSelect = challengeForm.$('select[class="form-control"]');
	addSelect.click();
	addSelect.$(`option=${addto}`).click();
 }

 if(categories != ""){
	var categoriesInput = challengeForm.$('span=None');
	categoriesInput.click();
	var categoryCheck = $(`#challenge-modal-cat-${categories}`);
	categoryCheck.click({ force: true });
	var closeButton = $('button=Close');
	closeButton.click({ force: true });
 }

 if(prize != ""){
	var prizeInput = challengeForm.$('input[type="number"]');
	prizeInput.click();
	prizeInput.keys(prize);
 }
});

When('I try create challenge', () => {
	$('button=Add Challenge Tasks').click();
	browser.pause(1000);
});

Then('I expect to see challenge alert {string}', (error) => {
	if (browser.isAlertOpen()){
		var alertText = browser.getAlertText();
		expect(alertText).to.include(error);
		browser.acceptAlert();
		browser.pause(1000);
		$('.close').click();
		browser.pause(1000);
	}
});
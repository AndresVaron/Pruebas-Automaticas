var {Given} = require('cucumber');
var {When} = require('cucumber');
var {Then} = require('cucumber');
var {expect} = require('chai');

When(/^I fill dailies info with (.*) and type enter to create$/ , (dailyname) => {
 var habitInput = $('textarea[placeholder="Add a Daily"]');
 habitInput.click();
 habitInput.keys(dailyname);
 habitInput.keys('\uE007');
});

When('I open a daily ticket', () =>{
	$('.daily > .tasks-list > .sortable-tasks > :nth-child(1) > .task > :nth-child(1) > .task-content').click();
	browser.pause(2000);
});

When(/^I fill daily ticket with (.*), (.*), (.*), (.*) and (.*)$/ , (daily, notes, difficulty, tag, repeat) => {
	var dailyInput = $('input[placeholder="Add a title"]');
	dailyInput.click();
	dailyInput.keys(daily);

	var notesInput = $('textarea[placeholder="Add notes"]');
	notesInput.click();
	notesInput.keys(notes);

	if(difficulty != ""){
		var difficultySelect = $('.difficulty-select');
		difficultySelect.click();
		browser.pause(1000);
		difficultySelect.$(`span=${difficulty}`).click();
	}

	if(tag != ""){
		var tagSelect = $('.multi-list');
		tagSelect.click();
		browser.pause(1000);
		$(`p=${tag}`).click();
		browser.pause(1000);
		$('label=Repeats').click({force: true});
	}

	if(repeat != ""){
		var resetSelect = $('.array-select');
		resetSelect.click();
		browser.pause(1000);
		resetSelect.$(`span=${repeat}`).click();
	}
});

Then('I expect to see daily ticket with {string}', title => {
	var habitTicket = $('.daily > .tasks-list > .sortable-tasks > .task-wrapper > .task > :nth-child(1) > .task-content > .task-clickable-area > .d-flex > .task-title > p').getText();
	expect(habitTicket).to.include(title);
});
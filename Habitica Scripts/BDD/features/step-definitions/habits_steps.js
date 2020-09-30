var {Given} = require('cucumber');
var {When} = require('cucumber');
var {Then} = require('cucumber');
var {expect} = require('chai');

When(/^I fill habit info with (.*) and type enter to create$/ , (habitname) => {
 var habitInput = $('textarea[placeholder="Add a Habit"]');
 habitInput.click();
 habitInput.keys(habitname);
 habitInput.keys('\uE007');
});

When('I open an habit ticket', () =>{
	$('.habit > .tasks-list > .sortable-tasks > .task-wrapper > .task > :nth-child(1) > .task-content > .task-clickable-area').click();
	browser.pause(2000);
});

When(/^I fill habit ticket with (.*), (.*), (.*), (.*) and (.*)$/ , (habit, notes, difficulty, tag, reset) => {
	var habitInput = $('input[placeholder="Add a title"]');
	habitInput.click();
	habitInput.keys(habit);

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
		tagSelect.click();
	}

	if(reset != ""){
		var resetSelect = $('.array-select');
		resetSelect.click();
		browser.pause(1000);
		resetSelect.$(`span=${reset}`).click();
	}
});

Then('I expect to see habit ticket with {string}', title => {
	var habitTicket = $('.habit > .tasks-list > .sortable-tasks > .task-wrapper > .task > :nth-child(1) > .task-content > .task-clickable-area > .d-flex > .task-title > p').getText();
	expect(habitTicket).to.include(title);
});
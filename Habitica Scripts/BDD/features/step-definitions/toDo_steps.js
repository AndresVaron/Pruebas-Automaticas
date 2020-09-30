var {Given} = require('cucumber');
var {When} = require('cucumber');
var {Then} = require('cucumber');
var {expect} = require('chai');

When(/^I fill ToDo info with (.*) and type enter to create$/ , (todoname) => {
 var todoInput = $('textarea[placeholder="Add a To Do"]');
 todoInput.click();
 todoInput.keys(todoname);
 todoInput.keys('\uE007');
});

When('I open a ToDo ticket', () =>{
	$('.todo > .tasks-list > .sortable-tasks > :nth-child(1) > .task > :nth-child(1) > .task-content').click();
	browser.pause(2000);
});

When(/^I fill ToDo ticket with (.*), (.*), (.*) and (.*)$/ , (todo, notes, difficulty, tag) => {
	var todoInput = $('input[placeholder="Add a title"]');
	todoInput.click();
	todoInput.keys(todo);

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
		$('label=Checklist').click({force: true});
	}
});

Then('I expect to see ToDo ticket with {string}', title => {
	var habitTicket = $('.todo > .tasks-list > .sortable-tasks > .task-wrapper > .task > :nth-child(1) > .task-content > .task-clickable-area > .d-flex > .task-title > p').getText();
	expect(habitTicket).to.include(title);
});
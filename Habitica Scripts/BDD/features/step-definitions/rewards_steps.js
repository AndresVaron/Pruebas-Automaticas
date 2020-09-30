var {Given} = require('cucumber');
var {When} = require('cucumber');
var {Then} = require('cucumber');
var {expect} = require('chai');

When(/^I fill rewards info with (.*) and type enter to create$/ , (reward) => {
 var rewardInput = $('textarea[placeholder="Add a Reward"]');
 rewardInput.click();
 rewardInput.keys(reward);
 rewardInput.keys('\uE007');
});

When('I open a reward ticket', () =>{
	$('.reward > .tasks-list > .sortable-tasks > :nth-child(1) > .task > :nth-child(1) > .task-content').click();
	browser.pause(2000);
});

When(/^I fill reward ticket with (.*), (.*), (.*) and (.*)$/ , (reward, notes, cost, tag) => {
	var todoInput = $('input[placeholder="Add a title"]');
	todoInput.click();
	todoInput.keys(reward);

	var notesInput = $('textarea[placeholder="Add notes"]');
	notesInput.click();
	notesInput.keys(notes);

	var costInput = $('input[placeholder="Enter a Value"]');
	costInput.click();
	costInput.keys(cost);

	if(tag != ""){
		var tagSelect = $('.multi-list');
		tagSelect.click();
		browser.pause(1000);
		$(`p=${tag}`).click();
		browser.pause(1000);
		$('label=Cost').click({force: true});
	}
});

Then('I expect to see reward ticket with {string}', title => {
	var habitTicket = $('.reward > .tasks-list > .sortable-tasks > .task-wrapper > .task > :nth-child(1) > .task-content > .task-clickable-area > .d-flex > .task-title > p').getText();
	expect(habitTicket).to.include(title);
});
var {Given} = require('cucumber');
var {When} = require('cucumber');
var {Then} = require('cucumber');
var {expect} = require('chai');

When('I go to market side', () =>{
	$('a=Shops').click();
	browser.pause(1000);
});

When('I select a reward', () =>{
	$('.drawer-title').click();
	browser.pause(1000)
	$('div[class*="shop_armor_warrior_1"]').click({force: true});
	browser.pause(1000);
});

When('I try to buy', () =>{
	$('button=Buy Now').click({force: true});
	browser.pause(1000);
});

Then('I expect to see the same screen', () => {
	var valida = $('#buy-modal').isExisting();
	expect(valida).to.be.true;
	$('a=Tasks').click({force: true});
});

Then('I expect to see the main screen', () => {
	var valida = $('#buy-modal').isExisting();
	expect(valida).to.be.false;
	$('a=Tasks').click({force: true});
});
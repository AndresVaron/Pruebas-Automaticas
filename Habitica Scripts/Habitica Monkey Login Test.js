
describe('Wikipedia under monkeys', function () {
    it('visits habitica login page and survives monkeys', function () {
        cy.visit('https://habitica.com/static/home')
        cy.wait(1000);
        cy.wait(3000)
        cy.get('.login-button').click();
        cy.wait(3000)
        randomEvent(10);
    })
})




function randomClick(monkeysLeft) {

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    var monkeysLeft = monkeysLeft;
    if (monkeysLeft > 0) {
        cy.get('a').then($links => {
            var randomLink = $links.get(getRandomInt(0, $links.length));
            if (!Cypress.dom.isHidden(randomLink)) {
                cy.wrap(randomLink).click({ force: true });
                monkeysLeft = monkeysLeft - 1;
            }
            cy.wait(500);
            randomClick(monkeysLeft);
        });
    }
}



function randomEvent(monkeysLeft) {

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    function linkEvent() {
        cy.log("EVENT: link event selected")
        cy.get('a').then($links => {
            var randomLink = $links.get(getRandomInt(0, $links.length));
            if (!Cypress.dom.isHidden(randomLink)) {
                cy.wait(500);
                cy.wrap(randomLink).click({ force: true });
            }
        });
    };

    function textFieldEvent() {
        cy.log("EVENT: textfield  event selected")
        cy.wait(3000);
        cy.get('input').then($inputs => {
            cy.log($inputs.length)
            var randomInput = $inputs.get(getRandomInt(0, $inputs.length));
            if (!Cypress.dom.isHidden(randomInput)) {
                cy.wait(1000);
                cy.wrap(randomInput).click({ force: true })
                cy.wait(1000);
                cy.wrap(randomInput).type("Filling random text field");
                cy.log('Write text correctly')
            }
        });

    };


    function buttonEvent() {
        cy.log("EVENT: button event selected")
        cy.get('button').then($buttons => {
            var randomButton = $buttons.get(getRandomInt(0, $buttons.length));
            if (!Cypress.dom.isHidden(randomButton)) {
                cy.wait(500);
                cy.wrap(randomButton).click({ force: true });

            }
        });

    };

    function main(monkeysLeft) {
        switch (getRandomInt(1, 3)) {
            case 1:
                linkEvent();
                break;
            case 2:
                textFieldEvent();
                break;
            case 3:
                buttonEvent();
                break;
        }

        if (monkeysLeft > 0) {
            monkeysLeft = monkeysLeft - 1;
            main(monkeysLeft);
        }

    };

    main(monkeysLeft);
}
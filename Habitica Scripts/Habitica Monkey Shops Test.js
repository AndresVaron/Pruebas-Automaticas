describe('Wikipedia under monkeys', function() {
    
    it('visits wikipedia and survives monkeys', function() {
        //cy.visit('https://es.wikipedia.org/wiki/Wikipedia:Portada');
        cy.visit('https://habitica.com/static/home');
        cy.wait(1000);
        cy.get('.login-button').click();
        cy.wait(3000)
        cy.get('#usernameInput').type('pa_test');
        cy.get('#passwordInput').type('fake@email.com');
        cy.get('.btn-info[type="submit"]').click()
        cy.wait(3000)
        cy.get(':nth-child(3) > .nav-link').click();
        cy.wait(2000)
        //randomClick(10);
        randomEvent(8);
    })
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

function randomClick(monkeysLeft) {
    var monkeysLeft = monkeysLeft;
    if(monkeysLeft > 0) {
        cy.get('body').then(($body) => {
                if($body.find('a').length){
                    return true
                }
                return false
            })
            .then((selector) => {
                if(selector){
                    cy.get('a').then($links => {
                        var randomLink = $links.get(getRandomInt(0, $links.length));
                        cy.log('Este es el random link antes', randomLink)
                        if(!Cypress.dom.isHidden(randomLink)) {
                            cy.log('Este es el random link', randomLink)
                            cy.wrap(randomLink).click({force: true});
                            monkeysLeft = monkeysLeft - 1;
                        }
                        cy.wait(500);
                        randomClick(monkeysLeft);
                    });
                }
                else{
                    cy.log('No se cuenta con atributos "a" en este DOM')    
                }
            })
    }   
}

function randomText(monkeysLeft) {
    var monkeysLeft = monkeysLeft;
    if(monkeysLeft > 0) {
        // cy.get('input[type="text"]').then($fields => {
            cy.get('body').then(($body) => {
                if($body.find('input[type=text]').length){
                    return "input"
                }
                return "false"
            })
            .then((selector) => {
                if(selector == "input"){
                        cy.get('input[type=text]').then($fields => {
                        var randomField = $fields.get(getRandomInt(0, $fields.length));
                        if(!Cypress.dom.isHidden(randomField)) {
                            cy.wrap(randomField).type('Hola mundo');
                            monkeysLeft = monkeysLeft - 1;
                        }
                        cy.wait(500);
                        randomText(monkeysLeft);
                    });    
                }
                else{
                    cy.log('No se cuenta con atributos input[type=text] en este DOM')
                }    
            })
            
    }   
}

function randomButton(monkeysLeft) {
    var monkeysLeft = monkeysLeft;
    if(monkeysLeft > 0) {
        cy.get('body').then(($body) => {
            if($body.find('button').length){
                return true
            }
            return false
        })
        .then((selector) => {
                if(selector){
                    cy.get('button').then($buttons => {
                        var randomButtons = $buttons.get(getRandomInt(0, $buttons.length));
                        if(!Cypress.dom.isHidden(randomButtons)) {
                            cy.wrap(randomButtons).click({force: true});
                            monkeysLeft = monkeysLeft - 1;
                        }
                        cy.wait(500);
                        randomButton(monkeysLeft);
                    });
                }
                else{
                    cy.log('No se cuenta con atributos button en este DOM')
                }
            })
    }   
}

function randomEvent(eventsNumber) {
    var events = eventsNumber;
    switch (getRandomInt(1, 4)) {
        case 1:
            randomClick(events);
            break;
        case 2:
            randomText(events);
            break;
        case 3:
            randomButton(events);
            break;
    }
}

context('Habitica Tests', () => {

  it('register a new challenge', () => {
    cy.visit('https://habitica.com/static/home')
    cy.wait(3000)
    cy.get('.login-button').click();
    cy.wait(3000)
    cy.get('#usernameInput').type('pa_test');
    cy.get('#passwordInput').type('fake@email.com');
    cy.get('.btn-info[type="submit"]').click()
    cy.wait(3000)
    cy.get(':nth-child(7) > .nav-link').click()
    cy.wait(3000)
    cy.get('.header-row > .col-md-4 > .btn').click()
    cy.wait(3000)
    cy.get('input[placeholder="What is your Challenge name?"]').type(' Desafio de Prueba')
    cy.get('input[placeholder="What short tag should be used to identify your Challenge?"]').type('DP Test')
    cy.get('.summary-textarea').type('Este es el resumen')
    cy.get('.description-textarea').type("Esta es la descripcion")
    cy.get(':nth-child(5) > .form-control').select('Public Challenges')
    cy.get('.category-select').click({ force: true })
    cy.wait(3000)
    cy.get('#challenge-modal-cat-creativity').click({ force: true })
    cy.wait(3000)
    cy.get('.category-box > .btn').click()
    cy.wait(3000)
    cy.get('.submit-button-wrapper > .btn').click({ force: true })
    cy.wait(3000)
    cy.get('.alert-warning').should('contain', ' You do not have enough gems to create a Tavern challenge ')
  })

  it('join a discovery challenge and review participant', () => {
    cy.visit('https://habitica.com/static/home')
    cy.wait(3000)
    cy.get('.login-button').click();
    cy.wait(3000)
    cy.get('#usernameInput').type('pa_test');
    cy.get('#passwordInput').type('fake@email.com');
    cy.get('.btn-info[type="submit"]').click()
    cy.wait(3000)
    cy.get(':nth-child(7) > .nav-link').click()
    cy.get('.nav > [href="/challenges/findChallenges"]').click()
    cy.get('[href="/challenges/0718155a-b8bd-426b-b987-ef66ac02694e"] > .challenge-title > p').click()
    cy.wait(3000)
    cy.get('.button-container > .btn').click()
    cy.get('.btn.dropdown-toggle.btn-secondary').click({ force: true })
    cy.get(':nth-child(6) > .dropdown-item').click()
    cy.get('.close').click()
    cy.get('.col-md-4 > .text-center > .btn').click()
    cy.get('.modal-body > div > .btn-danger').click()
    cy.wait(1000)
    cy.get('.desktop-only > .item-user > .habitica-menu-dropdown-toggle > :nth-child(1) > [aria-label="User"] > .top-menu-icon > svg').click({ force: true })
    cy.get('.desktop-only > .item-user > .dropdown-menu > .user-dropdown > :nth-child(9)').click()
  })
});
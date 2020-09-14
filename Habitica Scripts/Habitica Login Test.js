
context('Habitica Tests', () => {

  it('makes a succesful login ', () => {
    cy.visit('https://habitica.com/static/home')
    cy.wait(3000)
    cy.get('.login-button').click();
    cy.wait(3000)
    cy.get('#usernameInput').type('pa_test');
    cy.get('#passwordInput').type('fake@email.com');
    cy.get('.btn-info[type="submit"]').click()
    cy.wait(3000)
    cy.get('.svg-icon').should('be.visible')
  })

  it('logout session', () => {
    cy.wait(1000)
    cy.get('.desktop-only > .item-user > .habitica-menu-dropdown-toggle > :nth-child(1) > [aria-label="User"] > .top-menu-icon > svg').click({ force: true })
    cy.get('.desktop-only > .item-user > .dropdown-menu > .user-dropdown > :nth-child(9)').click()
  })

  it('makes a unsuccesful login bad password ', () => {
    cy.visit('https://habitica.com/static/home')
    cy.wait(3000)
    cy.get('.login-button').click();
    cy.wait(3000)
    cy.get('#usernameInput').type('pa_test');
    cy.get('#passwordInput').type('fake@email.comm');
    cy.get('.btn-info[type="submit"]').click()
    cy.wait(3000)
    cy.get('.text > div').should('contain', 'password is incorrect')
  })

  it('makes a unsuccesful login empty user and password ', () => {
    cy.visit('https://habitica.com/static/home')
    cy.wait(5000)
    cy.get('.login-button').click();
    cy.get('.btn-info[type="submit"]').click()
    cy.wait(3000)
    cy.get('.notification').should('contain', 'Missing')
  })

});
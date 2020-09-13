
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
    cy.get('.header-welcome').should('contain', ' Welcome back! ')
  })

});
context('Login Tests', () => {

  it('register a new habit', () => {
      cy.visit('https://habitica.com/static/home')
      cy.wait(3000)
      
      cy.get('.login-button').click();
      cy.wait(3000)
      cy.get('#usernameInput').type('pa_test').should('have.value', 'pa_test');
      cy.get('#passwordInput').type('fake@email.com');

      cy.get('.btn-info[type="submit"]').click()
      cy.wait(3000)
      cy.screenshot('prehabito')
      cy.get('.habit > .tasks-list > .quick-add').type('Prueba del habito');

      cy.get('.habit > .tasks-list > .quick-add').type('{enter}')

      cy.screenshot('poshabito')
      
    })
});
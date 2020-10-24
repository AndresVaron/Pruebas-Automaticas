context('Login Tests', () => {

  it('makes a wrong sign up attemp', () => {
    cy.visit('https://habitica.com/static/home')
    cy.screenshot('prelogin')
    cy.get('input[placeholder="Username"]').type('pa_test')
    cy.get('[type="email"]').type('onassottuse-0220@yopmail.com')
    cy.get('[placeholder="Password"]').type('fake@email.com')
    cy.get('[placeholder="Confirm Password"]').type('fake@email.com')
    cy.screenshot('posloginerror')
  })
});
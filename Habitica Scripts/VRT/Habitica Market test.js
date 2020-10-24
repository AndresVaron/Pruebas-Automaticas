context('Habitica Shops Tests', () => {

  it('makes a succesful login ', () => {
    cy.visit('https://habitica.com/static/home')
    cy.wait(1000)
    cy.screenshot()
    cy.get('.login-button').click();
    cy.wait(1000)
    cy.get('#usernameInput').type('pa_test');
    cy.get('#passwordInput').type('fake@email.com');
    cy.get('.btn-info[type="submit"]').click()
    cy.wait(1000)
    cy.get('.svg-icon').should('be.visible')
    cy.screenshot()
  })

  it('Go to market ', () => {
    cy.screenshot()
    cy.get(':nth-child(3) > .nav-link').click();
    cy.wait(2000)
    cy.get('.mb-4').should('contain', ' Market ')
    cy.screenshot()
  })

  it('make a succesful buy ', () => {
    cy.screenshot()
    cy.get('div[class*="shop_weapon_warrior"]').click();
    cy.wait(2000)
    cy.get('.inner-content > .btn').click({ force: true })
    cy.get(':nth-child(2) > .notification > .row > .text > div').should('contain', 'Not Enough Gold')
    cy.screenshot()
  })

  it('make a failed buy ', () => {
    cy.screenshot()
    cy.get('#buy-modal').click({ force: true })
    cy.get('div[class*="shop_weapon_warrior"]').click();
    cy.wait(2000)
    cy.get('.inner-content > .btn').click({ force: true })
    cy.get(':nth-child(2) > .notification > .row > .text > div').should('contain', 'Not Enough Gold')
    cy.screenshot()
  })
});
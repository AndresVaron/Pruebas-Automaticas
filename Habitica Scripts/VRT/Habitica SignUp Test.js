
context('Habitica Tests', () => {

  //Intento de registro con username existente
  it('makes a sign up attemp with username already taken', () => {
    cy.visit('https://habitica.com/static/home')
    cy.wait(3000)
    cy.screenshot()
    cy.get('input[placeholder="Username"]').type('pa_test')
    cy.get('[type="email"]').type('onassottuse-0220@yopmail.com')
    cy.get('[placeholder="Password"]').type('fake@email.com')
    cy.get('[placeholder="Confirm Password"]').type('fake@email.com')
    cy.get('.input-error').should('contain', ' Username already taken. ')
    cy.screenshot()
  })

  it('makes a sign up attemp successfully', () => {
    cy.visit('https://habitica.com/static/home')
    cy.wait(3000)
    cy.screenshot()
    cy.get('input[placeholder="Username"]').type('pa_test_3')
    cy.get('[type="email"]').type('onassottuse-0220@yopmail.com')
    cy.get('[placeholder="Password"]').type('fake@email.com')
    cy.get('[placeholder="Confirm Password"]').type('fake@email.com')
    cy.screenshot()
  })


  it('makes a sign up attemp with username over 20 characters', () => {
    cy.visit('https://habitica.com/static/home')
    cy.wait(3000)
    cy.screenshot()
    cy.get('input[placeholder="Username"]').type('pa_testtttttttttttttt')
    cy.get('.input-error').should('contain', ' Usernames must be between 1 and 20 characters. ')
    cy.screenshot()
  })

  it('makes a sign up attemp with password missmatch', () => {
    cy.visit('https://habitica.com/static/home')
    cy.wait(3000)
    cy.screenshot()
    cy.get('input[placeholder="Username"]').type('pa_test3')
    cy.get('[type="email"]').type('onassottuse-0220@yopmail.com')
    cy.get('[placeholder="Password"]').type('fake@email.com')
    cy.get('[placeholder="Confirm Password"]').type('fake@email.commmmm')
    cy.get('.input-error').should('contain', 'match password.')
    cy.screenshot()
  })

  it('makes a sign up attemp with password over 20 characters', () => {
    cy.visit('https://habitica.com/static/home')
    cy.wait(3000)
    cy.screenshot()
    cy.get('#usernameInput').type('pa_test_2');
    cy.get('[type="email"]').type('dadewa8179@brownal.net')
    cy.get('[placeholder="Password"]').type('estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910');
    cy.get('[placeholder="Confirm Password"]').type('estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910');
    cy.get('.btn-info[type="submit"]').click()
    cy.get('.row > .btn').click()
    cy.get('.next-arrow > svg > path').click()
    cy.get('.next-arrow > svg > path').click()
    cy.get('.introjs-tooltipbuttons > .btn').click()
    cy.screenshot()
  })

  it('delete an account', () => {
    cy.screenshot()
    cy.wait(3000)
    cy.get('.desktop-only > .item-user > .habitica-menu-dropdown-toggle > :nth-child(1) > [aria-label="User"] > .top-menu-icon > svg').click()
    cy.wait(3000)
    cy.get('.desktop-only > .item-user > .dropdown-menu > .user-dropdown > [href="/user/settings/site"]').click()
    cy.wait(3000)
    cy.get('.panel-body > :nth-child(3) > div > :nth-child(2)').click()
    cy.get('.col-6 > .form-control').type('estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910')
    cy.get('.modal-footer > .btn-danger').click()
    cy.screenshot()
  })
});
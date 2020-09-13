
context('Habitica Tests', () => {

  //Intento de registro con username existente
  it('makes a sign up attemp with username already taken', () => {
    cy.visit('https://habitica.com/static/home')
    cy.wait(3000)
    cy.get('input[placeholder="Username"]').type('pa_test')
    cy.get('[type="email"]').type('onassottuse-0220@yopmail.com')
    cy.get('[placeholder="Password"]').type('fake@email.com')
    cy.get('[placeholder="Confirm Password"]').type('fake@email.com')
    cy.get('.input-error').should('contain', ' Username already taken. ')
  })

  it('makes a sign up attemp successfully', () => {
    cy.visit('https://habitica.com/static/home')
    cy.wait(3000)
    cy.get('input[placeholder="Username"]').type('pa_test_3')
    cy.get('[type="email"]').type('onassottuse-0220@yopmail.com')
    cy.get('[placeholder="Password"]').type('fake@email.com')
    cy.get('[placeholder="Confirm Password"]').type('fake@email.com')

  })


  it('makes a sign up attemp with username over 20 characters', () => {
    cy.visit('https://habitica.com/static/home')
    cy.wait(3000)
    cy.get('input[placeholder="Username"]').type('pa_testtttttttttttttt')
    cy.get('.input-error').should('contain', ' Usernames must be between 1 and 20 characters. ')
  })

  it('makes a sign up attemp with password over 20 characters', () => {
    cy.visit('https://habitica.com/static/home')
    cy.wait(3000)
    cy.get('#usernameInput').type('pa_test_2');
    cy.get('[type="email"]').type('dadewa8179@brownal.net')
    cy.get('[placeholder="Password"]').type('estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910');
    cy.get('[placeholder="Confirm Password"]').type('estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910estepasswordessuperiora20caracteres12345678910');
    cy.get('.btn-info[type="submit"]').click()

    //cy.get('.input-error').should('contain', ' Usernames must be between 1 and 20 characters. ')
  })


});
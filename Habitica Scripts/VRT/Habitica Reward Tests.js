context('Habitica Rewards Tests', () => {

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

  it('register a new reward', () => {
    cy.screenshot()
      cy.get('textarea[placeholder="Add a Reward"]').type('El nuevo Reward {enter}');
      cy.get(':nth-child(1) > .task > :nth-child(1) > .task-content > .task-clickable-area > .d-flex > .task-title > p').should('contain', 'El nuevo Reward')
      cy.screenshot()
    })
  
  it('edit Reward task', () => {
    cy.screenshot()
      cy.get('.reward > .tasks-list > .sortable-tasks > :nth-child(1) > .task > :nth-child(1) > .task-content').click();
      cy.wait(1000)
      cy.get('.task-modal-header > :nth-child(2) > .form-control').type(' Editado...')
      cy.get('.mb-0 > .form-control').type('Esta es una nueva nota de la prueba Reward')
      cy.get('.input-group > .form-control').clear().type('1')
      cy.get('.multi-list').click()
      cy.get(':nth-child(4) > .dropdown-item > .label > p').click()
      cy.get('.task-modal-content').click({force: true})
      cy.get('.ml-auto > .btn').click();
      cy.wait(1000)
      cy.get(':nth-child(1) > .task > :nth-child(1) > .task-content > .task-clickable-area > .task-notes > p').should('contain', 'Esta es una nueva nota de la prueba Reward')
      cy.screenshot()
    })

    it('Make a successful buy reward', () => {
      cy.screenshot()
      cy.get(':nth-child(1) > .task > :nth-child(1) > .right-control').click()
      cy.get('.text > div').should('contain', 'You spent some Gold')
      cy.screenshot()
    }) 

  	it('Delete the Reward', () => {
      cy.screenshot()
  		cy.get('.reward > .tasks-list > .sortable-tasks > :nth-child(1) > .task > :nth-child(1) > .task-content').click();
      cy.wait(1000)
    	cy.get('.delete-text').click()
      cy.get('.column-title').should('contain', 'Rewards')
      cy.screenshot()
  	})

    it('Make a failed buy reward', () => {
      cy.screenshot()
      cy.get('.shop_armoire').click()
      cy.get('.text > div').should('contain', 'Not Enough Gold')
      cy.screenshot()
    })
});
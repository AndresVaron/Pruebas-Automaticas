context('Habitica Dailies Tests', () => {

  it('makes a succesful login ', () => {
      cy.visit('https://habitica.com/static/home')
      cy.wait(1000)
      cy.get('.login-button').click();
      cy.wait(1000)
      cy.get('#usernameInput').type('pa_test');
      cy.get('#passwordInput').type('fake@email.com');
      cy.get('.btn-info[type="submit"]').click()
      cy.wait(1000)
      cy.get('.svg-icon').should('be.visible')
    })

  it('register a new dailies task', () => {
      cy.get('.daily > .tasks-list > .quick-add').type('El nuevo Dailies');
      cy.get('.daily > .tasks-list > .quick-add').type('{enter}')
      cy.get('.daily > .tasks-list > .sortable-tasks > .task-wrapper > .task > :nth-child(1) > .task-content > .task-clickable-area > .d-flex > .task-title > p').should('contain', 'El nuevo Dailies')
    })
  
  it('edit habit', () => {
      cy.get('.daily > .tasks-list > .sortable-tasks > :nth-child(1) > .task > :nth-child(1) > .task-content').click();
      cy.wait(2000)
      cy.get('.task-modal-header > :nth-child(2) > .form-control').type(' Editado...')
      cy.get('.mb-0 > .form-control').type('Esta es una nueva nota de la prueba daily')
      cy.get('.difficulty-select').click()
      cy.get(':nth-child(3) > .dropdown-item > .difficulty-item > .label').click()
      cy.get('.multi-list').click()
      cy.get(':nth-child(4) > .dropdown-item > .label > p').click()
      cy.get('.task-modal-content').click({force: true})
      cy.get('.ml-auto > .btn').click();
      cy.get('.daily > .tasks-list > .sortable-tasks > .task-wrapper > .task > :nth-child(1) > .task-content > .task-clickable-area > .d-flex > .task-title > p').should('contain', 'El nuevo Dailies Editado...')
    })

  	it('Delete daily', () => {
  		cy.get('.daily > .tasks-list > .sortable-tasks > :nth-child(1) > .task > :nth-child(1) > .task-content').click();
      	cy.wait(1000)
      	cy.get('.delete-text').click()
      	cy.get('.column-title').should('contain', 'Dailies')
  	})

  	it('register second daily', () => {
      cy.get('.daily > .tasks-list > .quick-add').type('El segundo Dailies');
      cy.get('.daily > .tasks-list > .quick-add').type('{enter}')
      cy.get('.daily > .tasks-list > .sortable-tasks > .task-wrapper > .task > :nth-child(1) > .task-content > .task-clickable-area > .d-flex > .task-title > p').should('contain', 'El segundo Dailies')
    })

    it('get monay with daily', () => {
      cy.get('.task-control').click()
      cy.get(':nth-child(1) > .notification > .row > .text > div').should('contain', 'You gained some Gold')
    }) 

    it('Delete second daily', () => {
      cy.get('.daily > .tasks-list > .sortable-tasks > :nth-child(1) > .task > :nth-child(1) > .task-content').click();
        cy.wait(1000)
        cy.get('.delete-text').click()
        cy.get('.column-title').should('contain', 'Dailies')
    })
});
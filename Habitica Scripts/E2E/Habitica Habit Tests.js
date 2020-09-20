context('Habitica Habit Tests', () => {

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

  it('register a new habit', () => {
      cy.get('.habit > .tasks-list > .quick-add').type('El nuevo habito');
      cy.get('.habit > .tasks-list > .quick-add').type('{enter}')
      cy.get('.habit > .tasks-list > .sortable-tasks > .task-wrapper > .task > :nth-child(1) > .task-content > .task-clickable-area > .d-flex > .task-title > p').should('contain', 'El nuevo habito')
    })
  
  it('edit habit', () => {
      cy.get('.habit > .tasks-list > .sortable-tasks > .task-wrapper > .task > :nth-child(1) > .task-content > .task-clickable-area').click();
      cy.wait(2000)
      cy.get(':nth-child(2) > .form-control').type(' Editado...')
      cy.get('.mb-0 > .form-control').type('Esta es una nueva nota de la prueba')
      cy.get('.difficulty-select').click()
      cy.get(':nth-child(3) > .dropdown-item > .difficulty-item > .label').click()
      cy.get('.multi-list').click()
      cy.get(':nth-child(4) > .dropdown-item > .label').click()
      cy.get('#task-modal___BV_modal_body_').click({force: true})
      cy.get('.array-select').click()
      cy.get('.dropdown-menu > :nth-child(2) > .dropdown-item > .label').click()
      cy.get('.ml-auto > .btn').click();
      cy.get('.habit > .tasks-list > .sortable-tasks > .task-wrapper > .task > :nth-child(1) > .task-content > .task-clickable-area > .d-flex > .task-title > p').should('contain', 'El nuevo habito Editado...')
    })

  	it('Delete habit', () => {
  		cy.get('.habit > .tasks-list > .sortable-tasks > .task-wrapper > .task > :nth-child(1) > .task-content > .task-clickable-area').click();
      	cy.wait(1000)
      	cy.get('.delete-text').click()
      	cy.get('.column-title').should('contain', 'Habits')
  	})

  	it('register second habit', () => {
      cy.get('.habit > .tasks-list > .quick-add').type('Segundo habito');
      cy.get('.habit > .tasks-list > .quick-add').type('{enter}')
      cy.get('.habit > .tasks-list > .sortable-tasks > .task-wrapper > .task > :nth-child(1) > .task-content > .task-clickable-area > .d-flex > .task-title > p').should('contain', 'Segundo habito')
    })

    it('get monay with habit', () => {
      cy.get('.habit > .tasks-list > .sortable-tasks > .task-wrapper > .task > :nth-child(1) > .left-control > .task-control').click({force: true})
      cy.wait(1000)
      cy.get(':nth-child(1) > .notification > .row > .text > div').should('contain', 'You gained some Gold')
    }) 

    it('loss life with habit', () => {
      cy.get('.right-control > .task-control').click()
      cy.wait(1000)
      cy.get(':nth-child(3) > .notification > .row > .text > div').should('contain', 'You lost some Health')	
    })

    it('Delete second habit', () => {
  		cy.get('.habit > .tasks-list > .sortable-tasks > .task-wrapper > .task > :nth-child(1) > .task-content > .task-clickable-area').click();
      	cy.wait(1000)
      	cy.get('.delete-text').click()
      	cy.get('.column-title').should('contain', 'Habits')
  	})
});
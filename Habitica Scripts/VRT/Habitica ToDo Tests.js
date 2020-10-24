context('Habitica ToDo Tests', () => {

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

  it('register a new ToDo task', () => {
    cy.screenshot()
    cy.get('textarea[placeholder="Add a To Do"]').type('El nuevo ToDo {enter}');
    cy.get('.todo > .tasks-list > .sortable-tasks > .task-wrapper > .task > :nth-child(1) > .task-content > .task-clickable-area > .d-flex > .task-title > p').should('contain', 'El nuevo ToDo')
    cy.screenshot()
  })

  it('edit ToDo task', () => {
    cy.screenshot()
    cy.get('.todo > .tasks-list > .sortable-tasks > :nth-child(1) > .task > :nth-child(1) > .task-content').click();
    cy.wait(2000)
    cy.get('.task-modal-header > :nth-child(2) > .form-control').type(' Editado...')
    cy.get('.mb-0 > .form-control').type('Esta es una nueva nota de la prueba ToDo')
    cy.get('.difficulty-select').click()
    cy.get(':nth-child(3) > .dropdown-item > .difficulty-item > .label').click()
    cy.get('.multi-list').click()
    cy.get(':nth-child(4) > .dropdown-item > .label > p').click()
    cy.get('.task-modal-content').click({ force: true })
    cy.get('.ml-auto > .btn').click();
    cy.wait(1000)
    cy.get('.todo > .tasks-list > .sortable-tasks > .task-wrapper > .task > :nth-child(1) > .task-content > .task-clickable-area > .task-notes > p').should('contain', 'Esta es una nueva nota de la prueba ToDo')
    cy.screenshot()
  })

  it('Delete ToDo task', () => {
    cy.screenshot()
    cy.get('.todo > .tasks-list > .sortable-tasks > :nth-child(1) > .task > :nth-child(1) > .task-content').click();
    cy.wait(1000)
    cy.get('.delete-text').click()
    cy.get('textarea[placeholder="Add a To Do"]').should('be.visible')
    cy.screenshot()
  })

  it('register second ToDo task', () => {
    cy.screenshot()
    cy.get('textarea[placeholder="Add a To Do"]').type('El segundo ToDo {enter}');
    cy.get('.todo > .tasks-list > .sortable-tasks > .task-wrapper > .task > :nth-child(1) > .task-content > .task-clickable-area > .d-flex > .task-title > p').should('contain', 'El segundo ToDo')
    cy.screenshot()
  })

  it('get monay with daily', () => {
    cy.screenshot()
    cy.get('.task-control').click()
    cy.get(':nth-child(1) > .notification > .row > .text > div').should('contain', 'You gained some Gold')
    cy.screenshot()
  })

  it('Delete second ToDo', () => {
    cy.screenshot()
    cy.get('.todo > .tasks-list > .sortable-tasks > :nth-child(1) > .task > :nth-child(1) > .task-content').click();
    cy.wait(1000)
    cy.get('.delete-text').click()
    cy.get('textarea[placeholder="Add a To Do"]').should('be.visible')
    cy.screenshot()
  })
});
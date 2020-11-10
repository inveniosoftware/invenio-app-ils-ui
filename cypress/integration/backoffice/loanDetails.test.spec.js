describe('backoffice loan details page', () => {
  const loansSearchRoute = '/backoffice/loans';

  it('should redirect to login if librarian not logged in', () => {
    cy.shouldRedirectToLogin(loansSearchRoute);
  });

  it('should checkin ongoing loan', () => {
    cy.login({ email: 'librarian@test.ch', password: '123456' });
    cy.visit(loansSearchRoute + '?f=state%3AITEM_ON_LOAN');

    cy.get('.bo-document-search a.header')
      .first()
      .click();

    cy.get('.bo-details-header-status-labels').should(
      'contain',
      'Item on loan'
    );

    cy.get('button')
      .contains('checkin')
      .click();

    cy.get('.bo-details-header-status-labels').should(
      'contain',
      'Item returned'
    );
    cy.get('div#loan-metadata').should('contain', 'No actions available.');
  });

  it('should extend ongoing loan close to due date', () => {
    cy.login({ email: 'librarian@test.ch', password: '123456' });
    cy.visit(loansSearchRoute + '?f=returns.end_date%3AUpcoming%20return');

    cy.get('.bo-document-search a.header')
      .first()
      .click();

    cy.get('td')
      .contains('Extensions')
      .siblings()
      .then($ext => {
        const exts = parseInt($ext.text());

        cy.get('button')
          .contains('extend')
          .click()
          .then(() => {
            cy.get('td')
              .contains('Extensions')
              .siblings()
              .then($ext => {
                let newExts = parseInt($ext.text());
                expect(newExts).to.equal(exts + 1);
              });
          });
      });
  });
});

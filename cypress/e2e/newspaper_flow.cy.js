const url = 'https://app.papernest.com/onboarding?anonymous&anonymousId=test&id_text=1&destination=newspaper'

describe('Select newspaper page', () => {
  it('shows newspaper provider(s)', () => {
    cy.visit(url)
    
    cy.get('*[id^="newspaper-address_change.provider"]')
      .should('have.length.greaterThan', 1)
  })
})
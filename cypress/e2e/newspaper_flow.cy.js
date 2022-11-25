const providersUrl = 'https://app.papernest.com/onboarding?anonymous&anonymousId=test&id_text=1&destination=newspaper'
const subscriberPathname = '/mon-compte/presse/2'

const providersSelector = '*[id^="newspaper-address_change.provider-"]'
const subscriberNumberSelector = '*[id^="newspaper-address_change.reference"]'

describe('Flow: Newspaper Address Change', { defaultCommandTimeout: 10000 }, () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('jwt')
    })

    it('displays newspaper providers', () => {
      cy.get(providersSelector)
        .should('have.length.greaterThan', 1)
    })

    it("redirects to Numero d'abonné page on provider click", () => {
      cy.get(providersSelector)
        .first()
        .click()
      cy.location('pathname').should('eq', subscriberPathname)
    })
  })
})
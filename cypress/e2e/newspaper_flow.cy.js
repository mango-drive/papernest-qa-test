import { randomAlphaNumeric } from "../support/utils";



// Urls and pathnames
const providersUrl =
  "https://app.papernest.com/onboarding?anonymous&anonymousId=test&id_text=1&destination=newspaper";
const referencePathname = "/mon-compte/presse/2";
const addressPathname = "/mon-compte/presse/3"

// Selectors
const providersSelector = '*[id^="newspaper-address_change.provider-"]';
const referenceSelector = '*[id^="newspaper-address_change.reference"]';

// Storage variables for the purpose of confirmation testing
let selectedProviderName;

describe(
  "Flow: Newspaper Address Change",
  { defaultCommandTimeout: 10000 },
  () => {
    beforeEach(() => {
      Cypress.Cookies.preserveOnce("jwt");
    });

    afterEach(function () {
      if (this.currentTest.state === 'failed') {
        Cypress.runner.stop()
      }
    })
    describe("Newspaper page", () => {
      it("displays newspaper providers", () => {
        cy.visit(providersUrl);
        cy.wait(1000);
        cy.get(providersSelector).should("have.length.greaterThan", 1);
      });

      it("redirects to Numero d'abonné page on provider click", () => {
        // Select a random newspaper provider
        const selectedProvider = cy.get(providersSelector)
          .then(($providers) => {
            return cy.get(Cypress._.sample($providers));
          });

        // store the provider name for later tests
        selectedProvider.find('*[class^="text line"]').then((line) => {
          selectedProviderName = line.text();
        });

        selectedProvider.click();
        cy.location("pathname").should("eq", referencePathname);
      });
    });

    describe("Numero d'abonné page", () => {
      it("accepts a subscriber number and redirects to address page", () => {
        cy.get('#button_next').should('be.visible').and('have.class', 'disabled')

        cy.get(referenceSelector).type(randomAlphaNumeric(5));

        cy.get('#button_next').should('be.visible').and('not.have.class', 'disabled').click()
        cy.location("pathname").should("eq", addressPathname)
      });
    });
  }
);

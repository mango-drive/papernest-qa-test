import { randomAlphaNumeric } from "../support/utils";



// Urls and pathnames
const providersUrl =
  "https://app.papernest.com/onboarding?anonymous&anonymousId=test&id_text=1&destination=newspaper";
const referencePathname = "/mon-compte/presse/2";
const addressPathname = "/mon-compte/presse/3";
const userInfoPathname = "/mon-compte/presse/4";

// Selectors
const providersSel = '*[id^="newspaper-address_change.provider-"]';
const referenceSel = '*[id^="newspaper-address_change.reference"]';
const buttonNextSel = '#button_next';
const housingAddressSel = '*[id^="housing.address"]'
const addressDropdownSel = '*[class^="dropdown-suggestions ng-star-inserted"]'

// User variables for the purpose of confirmation testing
const userAddress = '157 Boulevard Macdonald 75019 Paris';
let selectedProviderName;

describe(
  "Flow: Newspaper Address Change",
  { defaultCommandTimeout: 5000 },
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
        cy.get(providersSel).should("have.length.greaterThan", 1);
      });

      it("redirects to Numero d'abonné page on provider click", () => {
        // Select a random newspaper provider
        const selectedProvider = cy.get(providersSel)
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
        cy.get(buttonNextSel).should('be.visible').and('have.class', 'disabled')

        cy.get(referenceSel).type(randomAlphaNumeric(5));

        cy.get(buttonNextSel).should('be.visible').and('not.have.class', 'disabled').click()
        cy.location("pathname").should("eq", addressPathname)
      });
    });

    describe("Address page", () => {
      it("accepts an address", () => {
        cy.get(buttonNextSel).should('be.visible').and('have.class', 'disabled')

        cy.get(housingAddressSel).should('not.have.class', 'checked').type(userAddress)

        cy.get(addressDropdownSel).contains(userAddress).click()

        cy.get(housingAddressSel).should('have.class', 'checked')

        cy.get(buttonNextSel).should('be.visible').and('not.have.class', 'disabled').click()
        cy.location("pathname").should("eq", userInfoPathname)
      })
    })
  }
);

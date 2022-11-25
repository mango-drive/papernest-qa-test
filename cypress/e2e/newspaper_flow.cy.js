import { randomAlphaNumeric, randomIntFromInterval } from "../support/utils";

const providersUrl =
  "https://app.papernest.com/onboarding?anonymous&anonymousId=test&id_text=1&destination=newspaper";
const referencePathname = "/mon-compte/presse/2";

const providersSelector = '*[id^="newspaper-address_change.provider-"]';
const referenceSelector = '*[id^="newspaper-address_change.reference"]';

describe(
  "Flow: Newspaper Address Change",
  { defaultCommandTimeout: 10000 },
  () => {
    beforeEach(() => {
      Cypress.Cookies.preserveOnce("jwt");
    });

    describe("Newspaper page", () => {
      it("displays newspaper providers", () => {
        cy.visit(providersUrl);
        cy.get(providersSelector).should("have.length.greaterThan", 1);
      });

      it("redirects to Numero d'abonné page on provider click", () => {
        cy.get(providersSelector).first().click();
        cy.location("pathname").should("eq", referencePathname);
      });
    });

    describe("Numero d'abonné page", () => {
      it("accepts a subscriber number and redirects to ", () => {
        cy.get(referenceSelector).type(randomAlphaNumeric(5));
      });
    });
  }
);

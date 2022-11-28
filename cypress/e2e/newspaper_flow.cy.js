import { create_user } from "../fixtures/newspaper_address_change_flow/user.js";
import * as paths from "../support/newspaper_address_change_flow/pathnames.js"

import {
  COMMON,
  PROVIDER_PAGE,
  REFERENCE_PAGE,
  HOUSING_ADDRESS_PAGE,
  DATE_PAGE,
  USER_INFO_PAGE,
  CONFIRMATION_PAGE,
} from "../support/newspaper_address_change_flow/selectors.js";

const dayjs = require("dayjs");
require("dayjs/locale/fr");

dayjs.locale("fr");

// User variables for the purpose of testing the confirmation page
const user = create_user()
console.log(user)

let selectedProviderName;
let selectedDate;

function withNextButtonTest(func) {
  cy.get(COMMON.nextButton).should("be.visible").and("have.class", "disabled");

  func();

  cy.get(COMMON.nextButton)
    .should("be.visible")
    .and("not.have.class", "disabled")
    .click();
}

describe(
  "Flow: Newspaper Address Change",
  { defaultCommandTimeout: 5000 },
  () => {
    beforeEach(() => {
      Cypress.Cookies.preserveOnce("jwt");
    });

    afterEach(function () {
      if (this.currentTest.state === "failed") {
        Cypress.runner.stop();
      }
    });

    describe("Newspaper page", () => {
      it("displays newspaper providers", () => {
        cy.visit(paths.providersUrl);
        cy.wait(1000);
        cy.get(PROVIDER_PAGE.providersList).should(
          "have.length.greaterThan",
          1
        );
      });

      it("redirects to Numero d'abonné page on provider click", () => {
        // Select a random newspaper provider
        const selectedProvider = cy
          .get(PROVIDER_PAGE.providersList)
          .then(($providers) => {
            return cy.get(Cypress._.sample($providers));
          });

        // store the provider name for later tests
        selectedProvider.find('*[class^="text line"]').then((line) => {
          selectedProviderName = line.text();
        });

        selectedProvider.click();
        cy.location("pathname").should("eq", paths.REFERENCE_PAGE);
      });
    });

    describe("Numero d'abonné page", () => {
      it("accepts a subscriber number and redirects to address page", () => {
        withNextButtonTest(() => {
          cy.wait(1000); // flaky tests due to input failure
          cy.get(REFERENCE_PAGE.referenceInput).type(user.newspaperReference);
        });

        cy.location("pathname").should("eq", paths.ADDRESS_PAGE);
      });
    });

    describe("Votre addresse page", () => {
      it("accepts an address and redirects to Vos informations page", () => {
        withNextButtonTest(() => {
          cy.get(HOUSING_ADDRESS_PAGE.addressInput)
            .should("not.have.class", "checked")
            .type(user.housingAddress);

          cy.get(HOUSING_ADDRESS_PAGE.addressDropdown)
            .contains(user.housingAddress)
            .click();

          cy.get(HOUSING_ADDRESS_PAGE.addressInput).should(
            "have.class",
            "checked"
          );
        });

        cy.location("pathname").should("eq", paths.USER_INFO_PAGE);
      });
    });

    describe("Vos informations page", () => {
      it("accepts user information and redirects to Date page", () => {
        cy.location("pathname").should("eq", paths.USER_INFO_PAGE);

        withNextButtonTest(() => {
          for (const [key, selector] of Object.entries(USER_INFO_PAGE)) {
            cy.get(selector)
              .should("not.have.class", "checked")
              .type(user[key])
              .should("have.class", "checked");
          }
        });

        cy.location("pathname").should("eq", paths.DATE_PAGE);
      });
    });

    describe("Date page", () => {
      it("accepts a date and redirects to Confirmation page", () => {
        cy.location("pathname").should("eq", paths.DATE_PAGE);

        cy.get(COMMON.nextButton)
          .should("be.visible")
          .and("have.class", "disabled");

        cy.get(DATE_PAGE.datepickerInput).should("be.visible").click();

        cy.get(DATE_PAGE.todayButton)
          .parent()
          .invoke("attr", "aria-label")
          .then((date) => {
            selectedDate = date;
          });

        cy.get(DATE_PAGE.todayButton).click();
        cy.location("pathname").should("eq", paths.CONFIRMATION_PAGE);
      });
    });

    describe("Confirmation page", () => {
      it("displays the correct information", () => {
        cy.location("pathname").should("eq", paths.CONFIRMATION_PAGE);

        let formattedDate = dayjs(selectedDate).format("dddd D MMMM YYYY");
        formattedDate =
          formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

        cy.get(CONFIRMATION_PAGE.date).contains(formattedDate);
        cy.get(CONFIRMATION_PAGE.titleContainer).contains(user.firstName);
        cy.get(CONFIRMATION_PAGE.providerName).contains(selectedProviderName);

        for (const [key, val] of Object.entries(user)) {
          if (key === "phoneNumber") continue;
          cy.get(CONFIRMATION_PAGE[key]).contains(val);
        }
      });
    });
  }
);

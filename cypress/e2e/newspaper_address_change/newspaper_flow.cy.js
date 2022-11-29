import { validationPopUp } from "../../fixtures/newspaper_address_change_flow/content";
import { create_user } from "../../fixtures/newspaper_address_change_flow/user";
import * as paths from "../../support/newspaper_address_change_flow/pathnames";
import * as sels from "../../support/newspaper_address_change_flow/selectors";
import { withCheckedTest, withNextButtonTest } from "./common";
import { testDisplaysCorrectInformation } from "./confirmation_page";
import { clickOnToday } from "./date_page";
import { testDisplaysNewspaperProviders } from "./providers_page";

const dayjs = require("dayjs");
require("dayjs/locale/fr");

dayjs.locale("fr");

let sizes = ["iphone-5", "iphone-8", "macbook-15"];

describe(
  "Flow: Newspaper Address Change",
  { defaultCommandTimeout: 5000 },
  () => {
    sizes.forEach(function (size) {
      const user = create_user();

      let selectedProviderName;
      let selectedDate;
      describe(`${size} tests`, () => {
        beforeEach(() => {
          Cypress.Cookies.preserveOnce("jwt");
          cy.viewport(size);
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
            testDisplaysNewspaperProviders();
          });

          it("redirects to Numero d'abonné page on provider click", () => {
            // Select a random newspaper provider
            const selectedProvider = cy
              .get(sels.PROVIDER_PAGE.providersList)
              .then(($providers) => {
                return cy.get(Cypress._.sample($providers));
              });

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
              cy.wait(2000); // flaky tests due to input failure
              cy.get(sels.REFERENCE_PAGE.referenceInput).type(
                user.newspaperReference
              );
            });

            cy.location("pathname").should("eq", paths.ADDRESS_PAGE);
          });
        });

        describe("Votre addresse page", () => {
          it("accepts an address and redirects to Vos informations page", () => {
            withNextButtonTest(() => {
              withCheckedTest(sels.HOUSING_ADDRESS_PAGE.addressInput, () => {
                cy.get(sels.HOUSING_ADDRESS_PAGE.addressInput).type(
                  user.housingAddress
                );
                cy.get(sels.HOUSING_ADDRESS_PAGE.addressDropdown)
                  .contains(user.housingAddress)
                  .click();
              });
            });

            cy.location("pathname").should("eq", paths.USER_INFO_PAGE);
          });
        });

        describe("Vos informations page", () => {
          it("accepts user information and redirects to Date page", () => {
            cy.location("pathname").should("eq", paths.USER_INFO_PAGE);

            withNextButtonTest(() => {
              for (const [key, selector] of Object.entries(
                sels.USER_INFO_PAGE
              )) {
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

            cy.get(sels.COMMON.nextButton)
              .should("be.visible")
              .and("have.class", "disabled");

            clickOnToday({ store: selectedDate });

            cy.location("pathname").should("eq", paths.CONFIRMATION_PAGE);
          });
        });

        describe("Confirmation page", () => {
          let formattedDate;
          it("displays the correct information", () => {
            cy.location("pathname").should("eq", paths.CONFIRMATION_PAGE);

            formattedDate = dayjs(selectedDate).format("dddd D MMMM YYYY");
            formattedDate =
              formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

            testDisplaysCorrectInformation({
              date: formattedDate,
              user: user,
              providerName: selectedProviderName,
            });
          });

          it("opens the validation popup", () => {
            cy.get("#button_validate_newspaper").click();
            cy.get(".header").contains(user.firstName);
            cy.get(".header").contains(validationPopUp.confirmationText);
          });

          it("closes the validation popup", () => {
            cy.get(".mat-dialog__close-button").click();
            cy.get(".filter").should("not.exist");
            testDisplaysCorrectInformation({
              date: formattedDate,
              user: user,
              providerName: selectedProviderName,
            });
          });
        });
      });
    });
  }
);

import { randomAlphaNumeric } from "../support/utils";
const dayjs = require('dayjs')
require('dayjs/locale/fr')

dayjs.locale('fr')

// Urls and pathnames
const providersUrl =
  "https://app.papernest.com/onboarding?anonymous&anonymousId=test&id_text=1&destination=newspaper";
const referencePathname = "/mon-compte/presse/2";
const addressPathname = "/mon-compte/presse/3";
const userInfoPathname = "/mon-compte/presse/4";
const datePathname = "/mon-compte/presse/5";
const confirmationPathname = "/mon-compte/presse/6"

// Selectors
const providersSel = '*[id^="newspaper-address_change.provider-"]';
const referenceSel = '[id="newspaper-address_change.reference"]';
const buttonNextSel = "#button_next";
const housingAddressSel = '[id="housing.address"]';
const addressDropdownSel = '[class="dropdown-suggestions ng-star-inserted"]';
const datePickerInputSel = 'input[id="newspaper-address_change.begin_date"]';
const todaySel = '[class="mat-calendar-body-cell-content mat-focus-indicator mat-calendar-body-today"]';


const USER_INFO_PAGE = {
  firstName: '[id="user.first_name"]',
  lastName: '[id="user.last_name"]',
  email: '[id="user.email"]',
  phoneNumber: '[id="user.phone_number"]',
};

const CONFIRMATION_PAGE = {
  titleContainer: 'h1[class="title"]',
  date: '*[id^="{newspaper-address_change.begin_date"]',
  providerName: '[id="{newspaper-address_change.provider_name}"]',
  newspaperReference: '[id="{newspaper-address_change.reference}"]',
  housingAddress: '[id="{housing.address}"]',
  email: '[id="{user.email}"]',
  firstName: '[id="{user.first_name}"]',
  lastName: '[id="{user.last_name}"]'
}


// User variables for the purpose of testing the confirmation page
let selectedProviderName;
const user = {
  firstName: "Sebastien",
  lastName: "Corrigan",
  email: randomAlphaNumeric(8) + ".test@papernest.com",
  housingAddress: "157 Boulevard Macdonald 75019 Paris",
  phoneNumber: "0600000000",
  newspaperReference: randomAlphaNumeric(5)
};
let selectedDate;

function withNextButtonTest(func) {
  cy.get(buttonNextSel).should("be.visible").and("have.class", "disabled");

  func();

  cy.get(buttonNextSel)
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
        cy.visit(providersUrl);
        cy.wait(1000);
        cy.get(providersSel).should("have.length.greaterThan", 1);
      });

      it("redirects to Numero d'abonné page on provider click", () => {
        // Select a random newspaper provider
        const selectedProvider = cy.get(providersSel).then(($providers) => {
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
        withNextButtonTest(() => {
          cy.wait(100) // flaky tests due to input failure
          cy.get(referenceSel).type(user.newspaperReference);
        });

        cy.location("pathname").should("eq", addressPathname);
      });
    });

    describe("Votre addresse page", () => {
      it("accepts an address and redirects to Vos informations page", () => {
        withNextButtonTest(() => {
          cy.get(housingAddressSel)
            .should("not.have.class", "checked")
            .type(user.housingAddress);

          cy.get(addressDropdownSel).contains(user.housingAddress).click();

          cy.get(housingAddressSel).should("have.class", "checked");
        });

        cy.location("pathname").should("eq", userInfoPathname);
      });
    });

    describe("Vos informations page", () => {
      it("accepts user information and redirects to Date page", () => {
        cy.location("pathname").should("eq", userInfoPathname);

        withNextButtonTest(() => {
          for (const [key, selector] of Object.entries(USER_INFO_PAGE)) {
            cy.get(selector)
              .should("not.have.class", "checked")
              .type(user[key])
              .should("have.class", "checked");
          }
        });

        cy.location("pathname").should("eq", datePathname);
      });
    });

    describe("Date page", () => {
      it("accepts a date and redirects to Confirmation page", () => {
        cy.location("pathname").should("eq", datePathname);

        cy.get(buttonNextSel)
          .should("be.visible")
          .and("have.class", "disabled");

        cy.get(datePickerInputSel).should('be.visible').click();

        cy.get(todaySel).parent().invoke('attr', 'aria-label').then((date) => {
          selectedDate = date
        })

        cy.get(todaySel).click();
        cy.location("pathname").should("eq", confirmationPathname)
      });
    });

    describe("Confirmation page", () => {
      it("displays the correct information", () => {
        cy.location("pathname").should("eq", confirmationPathname)

        let formattedDate = dayjs(selectedDate).format('dddd D MMMM YYYY')
        formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

        cy.get(CONFIRMATION_PAGE.date).contains(formattedDate)
        cy.get(CONFIRMATION_PAGE.titleContainer).contains(user.firstName)
        cy.get(CONFIRMATION_PAGE.providerName).contains(selectedProviderName)

        for(const [key, val] of Object.entries(user)) {
          if (key === 'phoneNumber') continue;
          cy.get(CONFIRMATION_PAGE[key]).contains(val)
        }

      })
    })
  }
);

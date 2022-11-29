import { COMMON } from "../../support/newspaper_address_change_flow/selectors";

export function withNextButtonTest({ currPage, nextPage }, func) {
  cy.location("pathname").should("eq", currPage);
  cy.get(COMMON.nextButton).should("be.visible").and("have.class", "disabled");

  func();

  cy.get(COMMON.nextButton)
    .should("be.visible")
    .and("not.have.class", "disabled")
    .click();

  cy.location("pathname").should("eq", nextPage);
}

export function withEnterTest({ currPage, nextPage }, func) {
  cy.location("pathname").should("eq", currPage);
  cy.get('body').type('{enter}')
  cy.location("pathname").should("eq", currPage);

  func();

  cy.location("pathname").should("eq", currPage);
  cy.get('body').type('{enter}')
  cy.location("pathname").should("eq", nextPage);
}

export function withCheckedTest(selector, func) {
  cy.get(selector).should("not.have.class", "checked");
  func();
  cy.get(selector).should("have.class", "checked");
}

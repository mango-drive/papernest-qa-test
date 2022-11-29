import { COMMON } from "../../support/newspaper_address_change_flow/selectors";

export function withNextButtonTest(func) {
  cy.get(COMMON.nextButton).should("be.visible").and("have.class", "disabled");

  func();

  cy.get(COMMON.nextButton)
    .should("be.visible")
    .and("not.have.class", "disabled")
    .click();
}

export function withCheckedTest(selector, func) {
  cy.get(selector).should("not.have.class", "checked");
  func();
  cy.get(selector).should("have.class", "checked");
}

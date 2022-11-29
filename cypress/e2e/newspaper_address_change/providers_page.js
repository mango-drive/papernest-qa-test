import { PROVIDER_PAGE } from "../../support/newspaper_address_change_flow/selectors";

export function testDisplaysNewspaperProviders() {
  cy.get(PROVIDER_PAGE.providersList).should("have.length.greaterThan", 1);
}



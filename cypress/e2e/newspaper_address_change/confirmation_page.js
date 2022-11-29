import { CONFIRMATION_PAGE } from "../../support/newspaper_address_change_flow/selectors";

export function testDisplaysCorrectInformation({date, user, providerName}) {
    cy.get(CONFIRMATION_PAGE.date).contains(date);
    cy.get(CONFIRMATION_PAGE.titleContainer).contains(user.firstName);
    cy.get(CONFIRMATION_PAGE.providerName).contains(providerName);

    for (const [key, val] of Object.entries(user)) {
        if (key === "phoneNumber") continue;
        cy.get(CONFIRMATION_PAGE[key]).contains(val);
    }
}
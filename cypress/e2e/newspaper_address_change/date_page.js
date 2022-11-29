import { DATE_PAGE } from "../../support/newspaper_address_change_flow/selectors";

export function clickOnToday(store) {
  clickOnDateSelector(DATE_PAGE.todayButton, store);
}

function clickOnDateSelector(dateSelector, { store }) {
  cy.get(DATE_PAGE.datepickerInput).should("be.visible").click();

  cy.get(dateSelector)
    .parent()
    .invoke("attr", "aria-label")
    .then((date) => {
      store = date;
    });

  cy.get(dateSelector).click();
}

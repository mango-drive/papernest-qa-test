export const COMMON = {
    nextButton: "#button_next"
}
export const PROVIDER_PAGE = {
  providersList: '*[id^="newspaper-address_change.provider-"]',
};

export const REFERENCE_PAGE = {
  referenceInput: '[id="newspaper-address_change.reference"]',
  nextButton: "#button_next",
};

export const HOUSING_ADDRESS_PAGE = {
  addressInput: '[id="housing.address"]',
  addressDropdown: '[class="dropdown-suggestions ng-star-inserted"]',
};

export const DATE_PAGE = {
  datepickerInput: 'input[id="newspaper-address_change.begin_date"]',
  todayButton:
    '[class="mat-calendar-body-cell-content mat-focus-indicator mat-calendar-body-today"]',
};

export const USER_INFO_PAGE = {
  firstName: '[id="user.first_name"]',
  lastName: '[id="user.last_name"]',
  email: '[id="user.email"]',
  phoneNumber: '[id="user.phone_number"]',
};

export const CONFIRMATION_PAGE = {
  titleContainer: 'h1[class="title"]',
  date: '*[id^="{newspaper-address_change.begin_date"]',
  providerName: '[id="{newspaper-address_change.provider_name}"]',
  newspaperReference: '[id="{newspaper-address_change.reference}"]',
  housingAddress: '[id="{housing.address}"]',
  email: '[id="{user.email}"]',
  firstName: '[id="{user.first_name}"]',
  lastName: '[id="{user.last_name}"]',
};

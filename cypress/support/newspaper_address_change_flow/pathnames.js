const basePathname = "/mon-compte/presse/";
const getPagePathname = (pageNum) => {
  return basePathname + pageNum;
};

export const providersUrl =
  "https://app.papernest.com/onboarding?anonymous&anonymousId=test&id_text=1&destination=newspaper";

export const REFERENCE_PAGE = getPagePathname(2);
export const ADDRESS_PAGE = getPagePathname(3);
export const USER_INFO_PAGE = getPagePathname(4);
export const DATE_PAGE = getPagePathname(5);
export const CONFIRMATION_PAGE = getPagePathname(6);

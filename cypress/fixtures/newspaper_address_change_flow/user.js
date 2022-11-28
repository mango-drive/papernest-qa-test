import { randomAlphaNumeric } from "../../support/utils";

export const create_user = () => {
  return {
    firstName: "Sebastien",
    lastName: "Corrigan",
    email: randomAlphaNumeric(8) + ".test@papernest.com",
    housingAddress: "157 Boulevard Macdonald 75019 Paris",
    phoneNumber: "0600000000",
    newspaperReference: randomAlphaNumeric(5),
  };
};

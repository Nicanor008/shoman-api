const Validator = require("validator");
const isEmpty = require("is-empty");

export function validateTrackInputs(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : "";
  if (Validator.isEmpty(data.name)) {
    errors.Username = "Track name is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

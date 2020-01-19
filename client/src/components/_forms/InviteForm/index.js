import React from "react";
import useFormValidation from "../../../hooks/useFormValidation";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../../../helpers/regex";
import * as PrimaryForm from "../PrimaryForm";

const INITIAL_VALUES = {
  email: ""
};

function OrchestraForm(props) {
  function validate(values) {
    const errors = {};
    if (!values.email) {
      errors.email = "Required Email";
    } else if (!EMAIL_REGEX.test(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  }

  function authenticate(values) {
    console.log("authenticate", values);
  }

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    isSubmitting
  } = useFormValidation(INITIAL_VALUES, validate, authenticate);

  return (
    <form onSubmit={handleSubmit}>
      <PrimaryForm.Field>
        <label htmlFor="email">Email</label>
        <PrimaryForm.Input
          type="text"
          name="email"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.email}
        />
        {errors.email && <PrimaryForm.Error>{errors.email}</PrimaryForm.Error>}
      </PrimaryForm.Field>
      <PrimaryForm.Button disabled={isSubmitting} type="submit">
        Submit
      </PrimaryForm.Button>
    </form>
  );
}

export default OrchestraForm;
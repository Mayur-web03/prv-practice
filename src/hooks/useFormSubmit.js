import { useState } from "react";
import { postJson } from "../utils/api";

/*
  Shared form behaviour: validate in the browser, POST to the API, and track
  status. Inputs are uncontrolled (read from FormData on submit), so typed
  values are never lost when errors appear.
*/
const useFormSubmit = ({ validate, endpoint }) => {
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success
  const [attempt, setAttempt] = useState(0); // changes on every failed submit
  const [result, setResult] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.currentTarget));
    const { errors: found, values } = validate({
      ...data,
      consent: data.consent === "on",
    });

    setServerError("");

    if (Object.keys(found).length > 0) {
      setErrors(found);
      setAttempt((n) => n + 1);
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      // `website` is a hidden spam trap; real visitors leave it empty
      const response = await postJson(endpoint, {
        ...values,
        website: data.website ?? "",
      });
      setResult(response);
      setStatus("success");
    } catch (error) {
      setStatus("idle");
      setErrors(error.fieldErrors ?? {});
      setServerError(error.message);
      setAttempt((n) => n + 1);
    }
  };

  return { errors, serverError, status, attempt, result, onSubmit };
};

export default useFormSubmit;
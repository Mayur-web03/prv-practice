import { Field, ConsentField, HoneypotField, FormAlert, SuccessPanel } from "../forms/Field";
import useFormSubmit from "../../hooks/useFormSubmit";
import { validateDealerApplication, BUSINESS_TYPES } from "../../../shared/validation.js";
import { INDIAN_STATES } from "../../../shared/indianStates.js";

const DealerApplicationForm = () => {
  const { errors, serverError, status, attempt, result, onSubmit } = useFormSubmit({
    validate: validateDealerApplication,
    endpoint: "/api/dealer-applications",
  });

  if (status === "success") {
    return (
      <SuccessPanel title="Thank you, your application has been received">
        <p>
          Our team will review it and contact you using the phone number and
          email you provided.
        </p>
        {result?.id && <p>Your reference number is DA-{result.id}.</p>}
      </SuccessPanel>
    );
  }

  const submitting = status === "submitting";

  return (
    <form className="form-card" onSubmit={onSubmit} noValidate aria-busy={submitting}>
      <FormAlert key={attempt} errors={errors} serverError={serverError} />

      <p className="form-note">Fields marked * are required.</p>

      <fieldset className="form-fieldset">
        <legend>Your details</legend>
        <div className="form-grid">
          <Field name="fullName" label="Full name" required autoComplete="name" error={errors.fullName} />
          <Field name="phone" label="Mobile number" required type="tel" inputMode="tel" autoComplete="tel"
            hint="10-digit Indian mobile number" error={errors.phone} />
          <Field name="email" label="Email" required type="email" autoComplete="email"
            className="field--full" error={errors.email} />
        </div>
      </fieldset>

      <fieldset className="form-fieldset">
        <legend>Your business</legend>
        <div className="form-grid">
          <Field name="businessName" label="Business or firm name" required autoComplete="organization"
            className="field--full" error={errors.businessName} />
          <Field name="businessType" label="Business type" required as="select"
            options={BUSINESS_TYPES} error={errors.businessType} />
          <Field name="yearsInBusiness" label="Years in business" inputMode="numeric" maxLength={3}
            error={errors.yearsInBusiness} />
          <Field name="gstin" label="GSTIN" maxLength={15} autoCapitalize="characters"
            hint="15 characters, if you have one" error={errors.gstin} />
          <Field name="existingBrands" label="Brands you currently sell" maxLength={200}
            error={errors.existingBrands} />
        </div>
      </fieldset>

      <fieldset className="form-fieldset">
        <legend>Where you are</legend>
        <div className="form-grid">
          <Field name="city" label="City" required autoComplete="address-level2" error={errors.city} />
          <Field name="state" label="State" required as="select" options={INDIAN_STATES}
            autoComplete="address-level1" placeholder="Select your state" error={errors.state} />
          <Field name="pincode" label="PIN code" required inputMode="numeric" maxLength={6}
            autoComplete="postal-code" error={errors.pincode} />
        </div>
      </fieldset>

      <fieldset className="form-fieldset">
        <legend>Anything else?</legend>
        <Field name="message" label="Message" as="textarea" maxLength={1000}
          hint="Tell us about your shop, area or plans." error={errors.message} />
      </fieldset>

      <HoneypotField />

      <ConsentField error={errors.consent}>
        I agree that PRV may contact me about this application using the details above.
      </ConsentField>

      <div className="form-actions">
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? "Sending…" : "Submit application"}
        </button>
      </div>
    </form>
  );
};

export default DealerApplicationForm;
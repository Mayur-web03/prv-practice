import { Field, ConsentField, HoneypotField, FormAlert, SuccessPanel } from "../forms/Field";
import useFormSubmit from "../../hooks/useFormSubmit";
import { validateEnquiry, ENQUIRY_TOPICS } from "../../../shared/validation.js";

// `product` (optional) is the product name when the visitor came from a product page.
const EnquiryForm = ({ product = "" }) => {
  const { errors, serverError, status, attempt, result, onSubmit } = useFormSubmit({
    validate: validateEnquiry,
    endpoint: "/api/enquiries",
  });

  if (status === "success") {
    return (
      <SuccessPanel title="Thank you, your message has been sent">
        <p>We will reply to the email address you provided.</p>
        {result?.id && <p>Your reference number is EN-{result.id}.</p>}
      </SuccessPanel>
    );
  }

  const submitting = status === "submitting";

  return (
    <form className="form-card" onSubmit={onSubmit} noValidate aria-busy={submitting}>
      <FormAlert key={attempt} errors={errors} serverError={serverError} />

      <p className="form-note">Fields marked * are required.</p>

      <div className="form-grid">
        <Field name="name" label="Your name" required autoComplete="name" error={errors.name} />
        <Field name="email" label="Email" required type="email" autoComplete="email" error={errors.email} />
        <Field name="phone" label="Mobile number" type="tel" inputMode="tel" autoComplete="tel"
          hint="10-digit Indian mobile number" error={errors.phone} />
        <Field name="topic" label="What is this about?" required as="select" options={ENQUIRY_TOPICS}
          defaultValue={product ? "product" : ""} placeholder="Choose a topic" error={errors.topic} />

        {product && (
          <div className="field field--full">
            <p className="field-hint">Enquiring about</p>
            <p><strong>{product}</strong></p>
            <input type="hidden" name="product" value={product} />
          </div>
        )}

        <Field name="message" label="Message" required as="textarea" maxLength={1000}
          className="field--full" error={errors.message} />
      </div>

      <HoneypotField />

      <div className="field--full" style={{ marginTop: "var(--space-5)" }}>
        <ConsentField error={errors.consent}>
          I agree that PRV may contact me about this enquiry using the details above.
        </ConsentField>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
};

export default EnquiryForm;
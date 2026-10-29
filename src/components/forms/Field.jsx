import "./forms.css";

// Moves keyboard focus to an element as soon as it appears (error or success boxes)
const focusOnMount = (element) => element?.focus();

const focusField = (event, name) => {
  event.preventDefault();
  document.getElementById(`f-${name}`)?.focus();
};

export const Field = ({
  name,
  label,
  required = false,
  hint,
  error,
  as = "input",
  type = "text",
  options = [],
  placeholder = "Select…",
  className = "",
  ...rest
}) => {
  const id = `f-${name}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const shared = {
    id,
    name,
    required,
    "aria-invalid": error ? "true" : undefined,
    "aria-describedby": describedBy,
    className: "field-control",
    ...rest,
  };

  let control;
  if (as === "select") {
    control = (
      <select {...shared}>
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const text = typeof option === "string" ? option : option.label;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
    );
  } else if (as === "textarea") {
    control = <textarea rows={5} {...shared} />;
  } else {
    control = <input type={type} {...shared} />;
  }

  return (
    <div className={`field${error ? " has-error" : ""} ${className}`.trim()}>
      <label htmlFor={id}>
        {label}
        {required ? (
          <span className="field-req" aria-hidden="true"> *</span>
        ) : (
          <span className="field-opt"> (optional)</span>
        )}
      </label>
      {control}
      {hint && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
};

export const ConsentField = ({ error, children }) => (
  <div className={`field${error ? " has-error" : ""}`}>
    <label className="check" htmlFor="f-consent">
      <input
        type="checkbox"
        id="f-consent"
        name="consent"
        required
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? "f-consent-error" : undefined}
      />
      <span>{children}</span>
    </label>
    {error && (
      <p id="f-consent-error" className="field-error">
        {error}
      </p>
    )}
  </div>
);

// Hidden spam trap. People never see it; bots fill it in.
export const HoneypotField = () => (
  <div className="visually-hidden" aria-hidden="true">
    <label htmlFor="f-website">Leave this field empty</label>
    <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
  </div>
);

// Summary shown above the form after a failed submit; receives focus.
// Render with a changing `key` so it is announced again on every failure.
export const FormAlert = ({ errors, serverError }) => {
  const entries = Object.entries(errors);
  if (entries.length === 0 && !serverError) return null;

  return (
    <div ref={focusOnMount} tabIndex={-1} role="alert" className="form-alert">
      <p className="form-alert-title">
        {serverError ||
          (entries.length === 1
            ? "Please fix 1 problem before sending:"
            : `Please fix ${entries.length} problems before sending:`)}
      </p>
      {entries.length > 0 && (
        <ul>
          {entries.map(([name, message]) => (
            <li key={name}>
              <a href={`#f-${name}`} onClick={(e) => focusField(e, name)}>
                {message}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const SuccessPanel = ({ title, children }) => (
  <div ref={focusOnMount} tabIndex={-1} role="status" className="form-success">
    <h3>{title}</h3>
    {children}
  </div>
);
/*
  Validation shared by the browser forms and the API.
  The browser uses it for instant feedback; the API uses it again because
  anything sent from a browser can be faked.
*/
import { INDIAN_STATES } from "./indianStates.js";

export const BUSINESS_TYPES = [
  { value: "retailer", label: "Retailer / showroom" },
  { value: "distributor", label: "Distributor / wholesaler" },
  { value: "contractor", label: "Contractor / plumber" },
  { value: "designer", label: "Architect / interior designer" },
  { value: "other", label: "Other" },
];

export const ENQUIRY_TOPICS = [
  { value: "product", label: "Product enquiry" },
  { value: "dealer", label: "Dealer enquiry" },
  { value: "general", label: "General question" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PINCODE_RE = /^[1-9]\d{5}$/;
const GSTIN_RE = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

// Single-line text: trimmed, inner whitespace collapsed
const line = (value) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";

// Multi-line text: trimmed only
const block = (value) => (typeof value === "string" ? value.trim() : "");

// Accepts 98765 43210, +91 98765 43210, 098765 43210 ... returns "+919876543210" or null
export const normalizePhone = (raw) => {
  let digits = line(raw).replace(/[\s\-().]/g, "");
  if (digits.startsWith("+91")) digits = digits.slice(3);
  else if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : null;
};

const checkLength = (errors, key, value, { min = 0, max, message }) => {
  if (value.length < min || value.length > max) errors[key] = message;
};

const checkEmail = (errors, values) => {
  const email = line(values.email).toLowerCase();
  if (!email) errors.email = "Enter your email address.";
  else if (email.length > 254 || !EMAIL_RE.test(email))
    errors.email = "Enter a valid email address, like name@example.com.";
  return email;
};

export const validateDealerApplication = (input = {}) => {
  const errors = {};

  const fullName = line(input.fullName);
  if (!fullName) errors.fullName = "Enter your full name.";
  else checkLength(errors, "fullName", fullName, { min: 2, max: 80, message: "Full name must be 2 to 80 characters." });

  const businessName = line(input.businessName);
  if (!businessName) errors.businessName = "Enter your business or firm name.";
  else checkLength(errors, "businessName", businessName, { min: 2, max: 120, message: "Business name must be 2 to 120 characters." });

  const email = checkEmail(errors, input);

  const phone = normalizePhone(input.phone);
  if (!line(input.phone)) errors.phone = "Enter your mobile number.";
  else if (!phone) errors.phone = "Enter a valid 10-digit Indian mobile number.";

  const city = line(input.city);
  if (!city) errors.city = "Enter your city.";
  else checkLength(errors, "city", city, { min: 2, max: 60, message: "City must be 2 to 60 characters." });

  const state = line(input.state);
  if (!state) errors.state = "Choose your state.";
  else if (!INDIAN_STATES.includes(state)) errors.state = "Choose a state from the list.";

  const pincode = line(input.pincode);
  if (!pincode) errors.pincode = "Enter your PIN code.";
  else if (!PINCODE_RE.test(pincode)) errors.pincode = "Enter a valid 6-digit PIN code.";

  const businessType = line(input.businessType);
  if (!businessType) errors.businessType = "Choose your business type.";
  else if (!BUSINESS_TYPES.some((t) => t.value === businessType))
    errors.businessType = "Choose a business type from the list.";

  let yearsInBusiness = null;
  const yearsRaw = line(String(input.yearsInBusiness ?? ""));
  if (yearsRaw) {
    if (!/^\d{1,3}$/.test(yearsRaw) || Number(yearsRaw) > 100)
      errors.yearsInBusiness = "Enter years in business as a whole number from 0 to 100.";
    else yearsInBusiness = Number(yearsRaw);
  }

  const gstin = line(input.gstin).toUpperCase();
  if (gstin && !GSTIN_RE.test(gstin))
    errors.gstin = "Enter a valid 15-character GSTIN, or leave it blank.";

  const existingBrands = line(input.existingBrands);
  if (existingBrands.length > 200)
    errors.existingBrands = "Keep the brands list under 200 characters.";

  const message = block(input.message);
  if (message.length > 1000) errors.message = "Keep your message under 1000 characters.";

  if (input.consent !== true)
    errors.consent = "Please agree to be contacted so we can process your application.";

  return {
    errors,
    values: {
      fullName, businessName, email, phone, city, state, pincode,
      businessType, yearsInBusiness, gstin, existingBrands, message,
      consent: input.consent === true,
    },
  };
};

export const validateEnquiry = (input = {}) => {
  const errors = {};

  const name = line(input.name);
  if (!name) errors.name = "Enter your name.";
  else checkLength(errors, "name", name, { min: 2, max: 80, message: "Name must be 2 to 80 characters." });

  const email = checkEmail(errors, input);

  // Phone is optional here
  let phone = null;
  if (line(input.phone)) {
    phone = normalizePhone(input.phone);
    if (!phone) errors.phone = "Enter a valid 10-digit Indian mobile number, or leave it blank.";
  }

  const topic = line(input.topic);
  if (!topic) errors.topic = "Choose what your message is about.";
  else if (!ENQUIRY_TOPICS.some((t) => t.value === topic))
    errors.topic = "Choose a topic from the list.";

  const product = line(input.product);
  if (product.length > 120) errors.product = "Product name is too long.";

  const message = block(input.message);
  if (!message) errors.message = "Write your message.";
  else checkLength(errors, "message", message, { min: 10, max: 1000, message: "Your message must be 10 to 1000 characters." });

  if (input.consent !== true)
    errors.consent = "Please agree to be contacted so we can reply to you.";

  return {
    errors,
    values: { name, email, phone, topic, product, message, consent: input.consent === true },
  };
};
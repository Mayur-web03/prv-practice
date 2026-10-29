import { useSearchParams } from "react-router-dom";
import "./Contact.css";
import EnquiryForm from "../components/contact/EnquiryForm";
import { contactDetails } from "../data/contact";
import { getProductBySlug } from "../data/product.js";

const detailRows = [
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  { key: "hours", label: "Hours" },
].filter((row) => contactDetails[row.key]);

const Contact = () => {
  const [params] = useSearchParams();
  const product = getProductBySlug(params.get("product") ?? "");

  return (
    <section className="section page-offset">
      <title>Contact | PRV Bath Fittings</title>

      <div className="container contact">
        <div className="contact-intro">
          <span className="eyebrow">Contact</span>
          <h1 className="contact-title">Get in touch</h1>
          <p className="section-lead">
            Send us a message and we will reply to the email address you give us.
          </p>

          {detailRows.length > 0 && (
            <dl className="contact-details">
              {detailRows.map((row) => (
                <div key={row.key}>
                  <dt>{row.label}</dt>
                  <dd>{contactDetails[row.key]}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <EnquiryForm key={product?.slug ?? "general"} product={product?.name ?? ""} />
      </div>
    </section>
  );
};

export default Contact;
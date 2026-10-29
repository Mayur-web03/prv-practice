import { useState } from "react";
import "./DealerList.css";
import dealers, { SAMPLE_DATA } from "../../data/dealers";

const cities = [...new Set(dealers.map((dealer) => dealer.city))].sort();

const DealerList = () => {
  const [city, setCity] = useState("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const visible = dealers.filter(
    (dealer) =>
      (city === "all" || dealer.city === city) &&
      (!q ||
        `${dealer.name} ${dealer.city} ${dealer.state} ${dealer.address}`
          .toLowerCase()
          .includes(q)),
  );

  return (
    <section className="section dealer-list-section" aria-labelledby="dealers-title">
      <div className="container">
        <h2 id="dealers-title" className="section-title">
          Our dealers
        </h2>

        {SAMPLE_DATA && (
          <p className="dealer-sample-note">
            Sample listing: these dealers are placeholders for preview.
          </p>
        )}

        <div className="dealer-filters">
          <div className="dealer-filter">
            <label htmlFor="dealer-city">City</label>
            <select
              id="dealer-city"
              className="field-control"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="all">All cities</option>
              {cities.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="dealer-filter">
            <label htmlFor="dealer-search">Search</label>
            <input
              id="dealer-search"
              type="search"
              className="field-control"
              placeholder="Name, city or area"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <p className="dealer-count" aria-live="polite">
          Showing {visible.length} of {dealers.length} dealers
        </p>

        {visible.length > 0 ? (
          <ul className="dealer-grid">
            {visible.map((dealer) => (
              <li key={dealer.id}>
                <article className="dealer-card">
                  <h3 className="dealer-name">{dealer.name}</h3>
                  <p className="dealer-location">
                    {dealer.city}, {dealer.state}
                  </p>
                  <address className="dealer-address">{dealer.address}</address>
                  <p className="dealer-links">
                    <a href={`tel:${dealer.phone.replace(/\s/g, "")}`}>{dealer.phone}</a>
                    <a href={`mailto:${dealer.email}`}>{dealer.email}</a>
                  </p>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <p className="dealer-empty">
            No dealers match your search. Try another city, or{" "}
            <a href="#become-a-dealer">apply to become a dealer</a>.
          </p>
        )}
      </div>
    </section>
  );
};

export default DealerList;
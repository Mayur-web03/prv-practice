
CREATE TABLE IF NOT EXISTS dealer_applications (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'new',
    full_name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    business_type TEXT NOT NULL,
    years_in_business INTEGER,
    gstin TEXT,
    existing_brands TEXT,
    message TEXT,
    consent BOOLEAN NOT NULL
);

CREATE INDEX IF NOT EXISTS dealer_applications_created_idx
ON dealer_applications (created_at DESC);

CREATE INDEX IF NOT EXISTS dealer_applications_email_idx
ON dealer_applications (email, created_at DESC);

CREATE TABLE IF NOT EXISTS enquiries (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'new',
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    topic TEXT NOT NULL,
    product TEXT,
    message TEXT NOT NULL,
    consent BOOLEAN NOT NULL
);

CREATE INDEX IF NOT EXISTS enquiries_created_idx
ON enquiries (created_at DESC);

CREATE INDEX IF NOT EXISTS enquiries_email_idx
ON enquiries (email, created_at DESC);

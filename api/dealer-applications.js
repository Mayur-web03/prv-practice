import { getSql } from "./_lib/db.js";
import { createHandler, MAX_PER_HOUR } from "./_lib/handler.js";
import { validateDealerApplication } from "../shared/validation.js";

export const save = async (v, sql = getSql()) => {
  const [{ count }] = await sql`
    select count(*)::int as count from dealer_applications
    where email = ${v.email} and created_at > now() - interval '1 hour'`;
  if (count >= MAX_PER_HOUR) return { throttled: true };

  const rows = await sql`
    insert into dealer_applications
      (full_name, business_name, email, phone, city, state, pincode,
       business_type, years_in_business, gstin, existing_brands, message, consent)
    values
      (${v.fullName}, ${v.businessName}, ${v.email}, ${v.phone}, ${v.city}, ${v.state}, ${v.pincode},
       ${v.businessType}, ${v.yearsInBusiness}, ${v.gstin || null}, ${v.existingBrands || null},
       ${v.message || null}, ${v.consent})
    returning id`;
  return { id: rows[0].id };
};

export default createHandler({ validate: validateDealerApplication, save: (v) => save(v) });
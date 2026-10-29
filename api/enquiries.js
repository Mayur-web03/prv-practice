import { getSql } from "./_lib/db.js";
import { createHandler, MAX_PER_HOUR } from "./_lib/handler.js";
import { validateEnquiry } from "../shared/validation.js";

export const save = async (v, sql = getSql()) => {
  const [{ count }] = await sql`
    select count(*)::int as count from enquiries
    where email = ${v.email} and created_at > now() - interval '1 hour'`;
  if (count >= MAX_PER_HOUR) return { throttled: true };

  const rows = await sql`
    insert into enquiries (name, email, phone, topic, product, message, consent)
    values (${v.name}, ${v.email}, ${v.phone}, ${v.topic}, ${v.product || null},
            ${v.message}, ${v.consent})
    returning id`;
  return { id: rows[0].id };
};

export default createHandler({ validate: validateEnquiry, save: (v) => save(v) });
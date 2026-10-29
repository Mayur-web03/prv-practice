/*
  Shared request handling for the form endpoints.
    validate(body) -> { values, errors }
    save(values)   -> { id } or { throttled: true }
*/
const parseBody = (body) => {
  if (body && typeof body === "object") return body;
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }
  return null;
};

export const createHandler = ({ validate, save }) => async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const body = parseBody(req.body);
  if (!body) return res.status(400).json({ error: "Invalid request." });

  // Honeypot: real visitors never see or fill this field. Pretend it worked.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return res.status(200).json({ ok: true });
  }

  const { values, errors } = validate(body);
  if (Object.keys(errors).length > 0) {
    return res
      .status(422)
      .json({ error: "Please check the highlighted fields.", fieldErrors: errors });
  }

  try {
    const result = await save(values);
    if (result.throttled) {
      return res
        .status(429)
        .json({ error: "You have sent several messages recently. Please try again in a little while." });
    }
    return res.status(201).json({ ok: true, id: result.id });
  } catch (error) {
    // Log the reason only, never the submitted personal details
    console.error("Form submission failed:", error?.message);
    return res
      .status(500)
      .json({ error: "Something went wrong on our side. Please try again shortly." });
  }
};

// At most this many submissions per email address per hour
export const MAX_PER_HOUR = 3;
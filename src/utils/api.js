export class ApiError extends Error {
  constructor(message, fieldErrors) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

// POSTs JSON and returns the parsed reply. Throws ApiError with a message
// that is safe to show to the visitor.
export const postJson = async (url, body) => {
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      "We couldn’t reach the server. Please check your connection and try again.",
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // not JSON (for example a hosting error page)
  }

  // `ok` must be explicitly true: some servers answer unknown URLs with the
  // site's HTML page and a 200 status, which must not look like success.
  if (!response.ok || data?.ok !== true) {
    throw new ApiError(
      data?.error ?? "We couldn’t send your message right now. Please try again shortly.",
      data?.fieldErrors,
    );
  }

  return data;
};
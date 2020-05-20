export function extractData(response: Response, requireOk = true) {
  if (!requireOk || response.ok) {
    let data;

    let contentType = response.headers.get("Content-Type");

    if (contentType && contentType.indexOf("application/json") > -1) {
      data = response.json();
    } else {
      data = response.text();
    }

    return data;
  }

  throw response
}

export function buildPost(body: any) {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  };
}

export function buildDelete() {
  return {
    method: "DELETE"
  };
}
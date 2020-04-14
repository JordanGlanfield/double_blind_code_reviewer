export function extractData(response: Response) {
  if (response.ok) {
    let data;

    let contentType = response.headers.get("Content-Type");

    if (contentType && contentType.indexOf("application/json") > -1) {
      data = response.json();
      console.log("Bants")
    } else {
      data = response.text();
    }

    console.log(data);

    return data;
  }

  throw response
}

export function buildPost(body: any) {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }
}
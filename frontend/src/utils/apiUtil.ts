export function extractData(response: Response) {
  if (response.ok) {
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
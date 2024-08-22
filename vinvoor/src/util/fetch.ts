const URLS: Record<string, string> = {
  BASE: import.meta.env.VITE_BASE_URL as string,
  API: import.meta.env.VITE_API_URL as string,
};

export const getApi = <T>(
  endpoint: string,
  convertData?: (data: unknown) => T,
) => _fetch<T>(`${URLS.API}/${endpoint}`, {}, convertData);

export const postApi = <T>(
  endpoint: string,
  body: Record<string, string | number | boolean> = {},
) =>
  _fetch<T>(`${URLS.API}/${endpoint}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: new Headers({ "content-type": "application/json" }),
  });

export const patchApi = <T>(
  endpoint: string,
  body: Record<string, string | number | boolean> = {},
) =>
  _fetch<T>(`${URLS.API}/${endpoint}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: new Headers({ "content-type": "application/json" }),
  });

export const deleteAPI = <T>(
  endpoint: string,
  body: Record<string, string | number | boolean> = {},
) =>
  _fetch<T>(`${URLS.API}/${endpoint}`, {
    method: "DELETE",
    body: JSON.stringify(body),
    headers: new Headers({ "content-type": "application/json" }),
  });

interface ResponseNot200Error extends Error {
  response: Response;
}

export const isResponseNot200Error = (
  error: unknown,
): error is ResponseNot200Error =>
  (error as ResponseNot200Error).response !== undefined;

const _fetch = async <T>(
  url: string,
  options: RequestInit = {},
  convertData?: (data: unknown) => T,
): Promise<T> =>
  fetch(url, { credentials: "include", ...options })
    .then(response => {
      if (!response.ok) {
        const error = new Error(
          "Fetch failed with status: " + response.status,
        ) as ResponseNot200Error;
        error.response = response;
        throw error;
      }

      const contentType = response.headers.get("content-type");

      return contentType?.includes("application/json")
        ? response.json()
        : response.text();
    })
    .then(data => (convertData ? convertData(data) : (data as T)));

const URLS: { [key: string]: string } = {
    BASE: import.meta.env.VITE_BASE_URL,
    API: import.meta.env.VITE_API_URL,
};

export const fetchApi = (endpoint: string) => {
    return _fetch(`${URLS.API}/${endpoint}`);
};

export const fetchBase = (endpoint: string) => {
    return _fetch(`${URLS.BASE}/${endpoint}`);
};

const _fetch = async (url: string) => {
    return fetch(url, { credentials: "include" }).then((response) =>
        response.json()
    );
};

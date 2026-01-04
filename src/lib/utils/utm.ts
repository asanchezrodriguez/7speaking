export function extractUTMParams(): Record<string, string> {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};

    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    utmKeys.forEach(key => {
        const value = params.get(key);
        if (value) {
            utm[key] = value;
        }
    });

    return utm;
}

export function buildStoreUrlWithUTM(baseUrl: string, utm: Record<string, string>): string {
    const url = new URL(baseUrl);

    Object.entries(utm).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });

    return url.toString();
}

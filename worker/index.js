const NO_INDEX_DIRECTIVE = "noindex, nofollow";

function withNoIndex(response) {
  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", NO_INDEX_DIRECTIVE);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return withNoIndex(response);
    }

    // Cloudflare Assets redirects /index.html to /, which would also redirect
    // the browser away from a client-side route such as /vacancies.
    const rootUrl = new URL(request.url);
    rootUrl.pathname = "/";
    rootUrl.search = "";
    return withNoIndex(await env.ASSETS.fetch(new Request(rootUrl, request)));
  },
};

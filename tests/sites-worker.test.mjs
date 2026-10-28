import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import worker from "../worker/index.js";

test("serves existing static assets without a fallback", async () => {
  const calls = [];
  const response = await worker.fetch(new Request("https://example.test/assets/app.js"), {
    ASSETS: {
      fetch: async (request) => {
        calls.push(new URL(request.url).pathname);
        return new Response("asset", { status: 200 });
      },
    },
  });

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
  assert.deepEqual(calls, ["/assets/app.js"]);
});

test("serves the app shell without redirecting a client-side route", async () => {
  const calls = [];
  const response = await worker.fetch(
    new Request("https://example.test/vacancies?source=share", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          calls.push(url.pathname + url.search);
          return new Response(url.pathname === "/" ? "app" : "missing", {
            status: url.pathname === "/" ? 200 : 404,
          });
        },
      },
    },
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("location"), null);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
  assert.deepEqual(calls, ["/vacancies?source=share", "/"]);
});

test("serves standalone vacancy detail URLs on direct load and reload", async () => {
  for (const path of ["/vacancies/1", "/vacancies/4/", "/vacancies/missing", "/blog", "/blog/atomic-people", "/blog/ecosystem/", "/blog/missing", "/ai", "/ai/", "/services", "/pentest", "/pentest/"]) {
    const calls = [];
    const response = await worker.fetch(new Request(`https://example.test${path}`, { headers: { accept: "text/html" } }), {
      ASSETS: { fetch: async (request) => {
        const pathname = new URL(request.url).pathname;
        calls.push(pathname);
        return new Response(pathname === "/" ? "app" : "missing", { status: pathname === "/" ? 200 : 404 });
      } },
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("location"), null);
    assert.deepEqual(calls, [path, "/"]);
  }
});

test("does not turn missing API or write requests into the app shell", async () => {
  for (const request of [
    new Request("https://example.test/api/missing", { headers: { accept: "application/json" } }),
    new Request("https://example.test/flow", { method: "POST", headers: { accept: "text/html" } }),
  ]) {
    let calls = 0;
    const response = await worker.fetch(request, {
      ASSETS: {
        fetch: async () => {
          calls += 1;
          return new Response("missing", { status: 404 });
        },
      },
    });

    assert.equal(response.status, 404);
    assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
    assert.equal(calls, 1);
  }
});

test("emits the files required by Sites packaging", async () => {
  await access(new URL("../dist/client/index.html", import.meta.url));
  await access(new URL("../dist/client/_headers", import.meta.url));
  await access(new URL("../dist/server/index.js", import.meta.url));
  await access(new URL("../dist/.openai/hosting.json", import.meta.url));

  const html = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");
  assert.match(html, /<meta name="robots" content="noindex, nofollow"\s*\/>/);

  const headers = await readFile(new URL("../dist/client/_headers", import.meta.url), "utf8");
  assert.match(headers, /\/\*\s+X-Robots-Tag: noindex, nofollow/);
});

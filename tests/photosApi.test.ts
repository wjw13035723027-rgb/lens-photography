import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("public photos API falls back to bundled photos when Vercel database env is missing", () => {
  const { TURSO_TOKEN, TURSO_URL, TURSO_REQUIRED, ...baseEnv } = process.env;
  void TURSO_TOKEN;
  void TURSO_URL;
  void TURSO_REQUIRED;

  const script = `
    const mod = await import("./src/app/api/photos/route.ts");
    const GET = mod.GET ?? mod.default?.GET;
    if (!GET) throw new Error("GET handler was not exported");
    const response = await GET(new Request("https://example.test/api/photos?category=kansai"));
    const body = await response.json();
    console.log(JSON.stringify({
      status: response.status,
      count: Array.isArray(body) ? body.length : -1,
      firstCategory: Array.isArray(body) && body[0] ? body[0].category : null
    }));
  `;

  const result = spawnSync(process.execPath, ["--import", "tsx", "-e", script], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...baseEnv,
      VERCEL: "1",
    },
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);

  const output = JSON.parse(result.stdout.trim()) as {
    status: number;
    count: number;
    firstCategory: string | null;
  };

  assert.equal(output.status, 200);
  assert.equal(output.count, 36);
  assert.equal(output.firstCategory, "kansai");
});

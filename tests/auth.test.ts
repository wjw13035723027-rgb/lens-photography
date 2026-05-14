import assert from "node:assert/strict";
import test from "node:test";

import {
  clearJwtSecretCacheForTests,
  getAuthUser,
  getJwtSecretForTests,
  getSafeUser,
  signToken,
} from "../src/lib/auth";

test("production JWT secret must be configured explicitly", () => {
  const env = process.env as Record<string, string | undefined>;
  const originalSecret = process.env.JWT_SECRET;
  const originalNodeEnv = process.env.NODE_ENV;

  delete process.env.JWT_SECRET;
  env.NODE_ENV = "production";
  clearJwtSecretCacheForTests();

  assert.throws(
    () => getJwtSecretForTests(),
    /JWT_SECRET must be set in production/,
  );

  if (originalSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalSecret;
  if (originalNodeEnv === undefined) delete env.NODE_ENV;
  else env.NODE_ENV = originalNodeEnv;
  clearJwtSecretCacheForTests();
});

test("safe user payload never exposes password", () => {
  const safe = getSafeUser({
    id: "user_1",
    name: "Lens",
    email: "lens@example.com",
    password: "hashed-secret",
    role: "admin",
  });

  assert.deepEqual(safe, {
    id: "user_1",
    name: "Lens",
    email: "lens@example.com",
    role: "admin",
  });
  assert.equal("password" in safe, false);
});

test("auth user can be read from the HttpOnly auth cookie", async () => {
  const originalSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "test-secret";
  clearJwtSecretCacheForTests();

  const token = await signToken({ userId: "user_1", role: "admin" });
  const request = new Request("https://example.test/api/admin/messages", {
    headers: { cookie: `theme=dark; auth-token=${token}` },
  });

  assert.deepEqual(await getAuthUser(request), { userId: "user_1", role: "admin" });

  if (originalSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalSecret;
  clearJwtSecretCacheForTests();
});

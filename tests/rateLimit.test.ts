import assert from "node:assert/strict";
import test from "node:test";

import { clearRateLimitForTests, isRateLimited } from "../src/lib/rateLimit";

test("rate limiter allows requests until the configured limit is exceeded", () => {
  clearRateLimitForTests();

  assert.equal(isRateLimited("login:127.0.0.1", { limit: 2, windowMs: 60_000 }), false);
  assert.equal(isRateLimited("login:127.0.0.1", { limit: 2, windowMs: 60_000 }), false);
  assert.equal(isRateLimited("login:127.0.0.1", { limit: 2, windowMs: 60_000 }), true);
});

test("rate limiter resets after the window expires", () => {
  clearRateLimitForTests();

  let now = 1_000;
  const getNow = () => now;

  assert.equal(isRateLimited("contact:127.0.0.1", { limit: 1, windowMs: 100, getNow }), false);
  assert.equal(isRateLimited("contact:127.0.0.1", { limit: 1, windowMs: 100, getNow }), true);

  now = 1_101;

  assert.equal(isRateLimited("contact:127.0.0.1", { limit: 1, windowMs: 100, getNow }), false);
});

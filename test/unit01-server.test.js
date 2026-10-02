import assert from "node:assert/strict";
import test from "node:test";
import { run } from "./helpers.js";

test("hello returns the greeting", async () => {
  const result = await run("{ hello }");

  assert.deepEqual(result, {
    data: {
      hello: "Xin chào GraphQL!",
    },
  });
});

test("unknown fields are rejected", async () => {
  const result = await run("{ khongTonTai }");

  assert.ok(result.errors);
});

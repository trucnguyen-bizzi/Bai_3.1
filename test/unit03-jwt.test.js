import assert from "node:assert/strict";
import test from "node:test";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserFromRequest, signToken } from "../src/auth.js";
import users from "../src/users.js";
import { as, run } from "./helpers.js";

test("login returns a token and the matching user", async () => {
  const result = await run(
    'mutation { login(username: "admin", password: "admin123") { token user { id username } } }',
  );

  assert.equal(result.data.login.token.split(".").length, 3);
  assert.deepEqual(result.data.login.user, {
    id: "1",
    username: "admin",
  });
});

test("invalid login credentials return the same unauthenticated error", async () => {
  const wrongPassword = await run(
    'mutation { login(username: "admin", password: "wrong") { token } }',
  );
  const wrongUsername = await run(
    'mutation { login(username: "missing", password: "wrong") { token } }',
  );

  assert.equal(wrongPassword.errors[0].extensions.code, "UNAUTHENTICATED");
  assert.equal(wrongUsername.errors[0].extensions.code, "UNAUTHENTICATED");
  assert.equal(wrongPassword.errors[0].message, wrongUsername.errors[0].message);
});

test("valid tokens resolve to their user", () => {
  const token = signToken(users[0]);
  const user = getUserFromRequest({
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  assert.equal(user.id, users[0].id);
  assert.equal(user.username, users[0].username);
});

test("expired tokens are rejected", () => {
  const token = signToken(users[0], "-10s");
  const user = getUserFromRequest({
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  assert.equal(user, null);
});

test("tokens signed with another secret are rejected", () => {
  const token = jwt.sign({ sub: users[0].id }, "another-secret", {
    algorithm: "HS256",
    expiresIn: "1h",
  });
  const user = getUserFromRequest({
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  assert.equal(user, null);
});

test("missing or malformed authorization headers are rejected", () => {
  assert.equal(getUserFromRequest({ headers: {} }), null);
  assert.equal(
    getUserFromRequest({
      headers: {
        authorization: "Token abc",
      },
    }),
    null,
  );
});

test("token payload contains only exp, iat, and sub", () => {
  const token = signToken(users[0]);
  const payload = jwt.decode(token);

  assert.deepEqual(Object.keys(payload).sort(), ["exp", "iat", "sub"]);
  assert.equal(payload.exp - payload.iat, 60 * 60);
});

test("users without authentication returns null data", async () => {
  const result = await run("{ users { id } }");

  assert.equal(result.errors[0].extensions.code, "UNAUTHENTICATED");
  assert.equal(result.data, null);
});

test("me without authentication returns null for the me field", async () => {
  const result = await run("{ me { id } }");

  assert.equal(result.errors[0].extensions.code, "UNAUTHENTICATED");
  assert.equal(result.data.me, null);
});

test("user without authentication returns null for the user field", async () => {
  const result = await run('{ user(id: "1") { id } }');

  assert.equal(result.errors[0].extensions.code, "UNAUTHENTICATED");
  assert.equal(result.data.user, null);
});

test("me returns the authenticated user", async () => {
  const result = await run("{ me { id username } }", {
    contextValue: as("an"),
  });

  assert.deepEqual(result.data.me, {
    id: "2",
    username: "an",
  });
});

test("hello remains public", async () => {
  const result = await run("{ hello }");

  assert.deepEqual(result.data, {
    hello: "Xin chào GraphQL!",
  });
});

test("stored passwords are bcrypt hashes", () => {
  assert.ok(bcrypt.compareSync("admin123", users[0].password));
  assert.ok(bcrypt.compareSync("123456", users[1].password));
  assert.ok(bcrypt.compareSync("123456", users[2].password));
});

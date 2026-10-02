import assert from "node:assert/strict";
import test from "node:test";
import { run } from "./helpers.js";

test("users returns all users", async () => {
  const result = await run("{ users { id username fullName } }");

  assert.equal(result.data.users.length, 3);
  assert.deepEqual(result.data.users[1], {
    id: "2",
    username: "an",
    fullName: "Nguyễn Văn An",
  });
});

test("user returns the matching user", async () => {
  const result = await run('{ user(id: "3") { username } }');

  assert.deepEqual(result.data.user, {
    username: "binh",
  });
});

test("user returns null when the user does not exist", async () => {
  const result = await run('{ user(id: "99") { username } }');

  assert.equal(result.data.user, null);
  assert.equal(result.errors, undefined);
});

test("users returns only the selected fields", async () => {
  const result = await run("{ users { fullName } }");

  assert.deepEqual(result.data.users[0], {
    fullName: "Quản Trị Viên",
  });
});

test("password is not available in the schema", async () => {
  const result = await run("{ users { password } }");

  assert.ok(result.errors);
});

import assert from "node:assert/strict";
import test from "node:test";
import { as, run } from "./helpers.js";

test("admin can view all fields for every user", async () => {
  const result = await run("{ users { id username fullName email phone role } }", {
    contextValue: as("admin"),
  });

  assert.equal(result.errors, undefined);
  assert.deepEqual(result.data.users, [
    {
      id: "1",
      username: "admin",
      fullName: "Quản Trị Viên",
      email: "admin@example.com",
      phone: "0900000001",
      role: "ADMIN",
    },
    {
      id: "2",
      username: "an",
      fullName: "Nguyễn Văn An",
      email: "an@example.com",
      phone: "0900000002",
      role: "USER",
    },
    {
      id: "3",
      username: "binh",
      fullName: "Trần Thị Bình",
      email: "binh@example.com",
      phone: "0900000003",
      role: "USER",
    },
  ]);
});

test("user can view public fields for every user", async () => {
  const result = await run("{ users { id username fullName } }", {
    contextValue: as("an"),
  });

  assert.equal(result.errors, undefined);
  assert.deepEqual(result.data.users, [
    {
      id: "1",
      username: "admin",
      fullName: "Quản Trị Viên",
    },
    {
      id: "2",
      username: "an",
      fullName: "Nguyễn Văn An",
    },
    {
      id: "3",
      username: "binh",
      fullName: "Trần Thị Bình",
    },
  ]);
});

test("user sees own private fields and forbidden fields of others", async () => {
  const result = await run("{ users { id email phone role } }", {
    contextValue: as("an"),
  });

  assert.deepEqual(result.data.users[0], {
    id: "1",
    email: null,
    phone: null,
    role: null,
  });
  assert.deepEqual(result.data.users[1], {
    id: "2",
    email: "an@example.com",
    phone: "0900000002",
    role: "USER",
  });
  assert.deepEqual(result.data.users[2], {
    id: "3",
    email: null,
    phone: null,
    role: null,
  });
  assert.equal(result.errors.length, 6);
  assert.ok(result.errors.every((error) => error.extensions.code === "FORBIDDEN"));
});

test("user field permissions apply when querying another user by id", async () => {
  const result = await run('{ user(id: "1") { email } }', {
    contextValue: as("binh"),
  });

  assert.equal(result.data.user.email, null);
  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].extensions.code, "FORBIDDEN");
});

test("admin can view private fields through user id", async () => {
  const result = await run('{ user(id: "3") { username email phone role } }', {
    contextValue: as("admin"),
  });

  assert.equal(result.errors, undefined);
  assert.deepEqual(result.data.user, {
    username: "binh",
    email: "binh@example.com",
    phone: "0900000003",
    role: "USER",
  });
});

test("user can view own private fields through me", async () => {
  const result = await run("{ me { username email phone role } }", {
    contextValue: as("binh"),
  });

  assert.equal(result.errors, undefined);
  assert.deepEqual(result.data.me, {
    username: "binh",
    email: "binh@example.com",
    phone: "0900000003",
    role: "USER",
  });
});

test("unauthenticated private field requests remain unauthenticated", async () => {
  const result = await run("{ users { email } }");

  assert.equal(result.data, null);
  assert.equal(result.errors[0].extensions.code, "UNAUTHENTICATED");
  assert.equal(
    result.errors.some((error) => error.extensions.code === "FORBIDDEN"),
    false,
  );
});

test("password is unavailable even to admins", async () => {
  const result = await run("{ users { password } }", {
    contextValue: as("admin"),
  });

  assert.ok(result.errors);
});

import { describe, expect, test } from "vitest";

import p from "./index";

test.each([
  undefined,
  null,
  true,
  420,
  "blaze it",
  { hello: "world" },
  [],
  new Date(),
  new Error(),
])("Should resolve any value correctly", async (value) => {
  const [res, err] = await p(Promise.resolve(value));
  expect(err).toBe(null);
  expect(res).toBe(value);
});

test.each([
  false,
  true,
  0,
  420,
  "",
  "blaze it",
  { hello: "world" },
  [],
  new Date(),
  new Error(),
])("Should reject non-nullish values correctly", async (value) => {
  const [res, err] = await p(Promise.reject(value));
  expect(err).toBe(value);
  expect(res).toBe(null);
});

test.each([undefined, null])(
  "Should reject nullish values as Error objects",
  async (value) => {
    const [res, err] = await p(Promise.reject(value));
    expect(err instanceof Error).toBe(true);
    expect(res).toBe(null);
  }
);

describe("Types should work as expected", () => {
  // Note: type errors will be handled for by tsc, NOT vitest

  test("Type of res should be same as resolved after err is checked", async () => {
    const [res, err] = await p(Promise.resolve(5));
    expect(err).toBe(null);
    if (err != null) {
      return;
    }
    expect(res.toFixed(2)).toBe("5.00"); // type of res should be same as resolved
  });

  test("Type of res can be null if err is not checked", async () => {
    const [res, err] = await p(Promise.resolve(5));
    expect(err).toBe(null);
    // @ts-expect-error
    expect(res.toFixed(2)).toBe("5.00"); // type error should be expected
    expect(res?.toFixed(2)).toBe("5.00"); // this is fine
  });
});

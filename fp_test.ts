import { pipe } from "fp-ts/lib/function";
import { assertEquals } from "https://deno.land/std@0.200.0/assert/mod.ts";
import { add1, multiply2 } from "./util/fp/math.ts";
import { getWaypointsFp } from "./util/fp/getWaypointsFp.ts";
import { Either, fold } from "fp-ts/lib/Either";
import { identity } from "fp-ts/lib/function";
import { assertObjectMatch } from "https://deno.land/std@0.200.0/assert/assert_object_match.ts";

// Deno.test("url test", () => {
//   const url = new URL("./foo.js", "https://deno.land/");
//   assertEquals(url.href, "https://deno.land/foo.js");
// });

Deno.test("👨‍🌾 can pipe add1 and multiply2", () => {
  assertEquals(pipe(1, add1, multiply2), 4);
});

/**
 * Extract value from either or throw (if left).
 */
const getRight = <A>(either: Either<Error, A>): A => {
  return fold<Error, A, A>((e) => {
    throw e;
  }, identity)(either);
};

Deno.test("👨‍🌾 handles getWaypointsFp", async () => {
  const thunk = getWaypointsFp();
  const resultEither = await thunk();
  const result = getRight(resultEither);

  assertObjectMatch(result, {
    data: [{ systemSymbol: "X1-JX88" }],
    meta: { total: 10, page: 1, limit: 10 },
  });
});

import { pipe } from "fp-ts/lib/function";
import { assertEquals } from "https://deno.land/std@0.200.0/assert/mod.ts";
import { add1, multiply2 } from "./util/fp/math.ts";
import { createGetPlanetsWithMoonsFp } from "./util/fp/getPlanetsWithMoonsFp.ts";
import { Either, fold } from "fp-ts/lib/Either";
import { identity } from "fp-ts/lib/function";
import { assertObjectMatch } from "https://deno.land/std@0.200.0/assert/assert_object_match.ts";
import { createGetPlanetsWithMoonsFpAlt } from "./util/fp/getPlanetsWithMoonFpAlt.ts";

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

Deno.test("👨‍🌾 can get PlanetsWithMoons (Fp)", async () => {
  const getWaypointsFp = createGetPlanetsWithMoonsFp(
    // "https://httpstat.us/500"
    "http://localhost:3000/waypointsForSystem.json"
  );
  const thunk = getWaypointsFp();
  const resultEither = await thunk();
  const result = getRight(resultEither);

  // old
  //   assertObjectMatch(result, {
  //     data: [{ systemSymbol: "X1-JX88" }],
  //     meta: { total: 10, page: 1, limit: 10 },
  //   });

  assertEquals(result.length, 3);

  //   console.log(result);

  assertObjectMatch(result[0], { symbol: "X1-QB20-78791D" });
  assertObjectMatch(result[1], { symbol: "X1-QB20-61050B" });
  assertEquals(result[1].moons.length, 3);
  assertObjectMatch(result[1].moons[0], { symbol: "X1-QB20-40572B" });
  assertObjectMatch(result[1].moons[1], { symbol: "X1-QB20-88193B" });
  assertObjectMatch(result[1].moons[2], { symbol: "X1-QB20-92514D" });
  assertObjectMatch(result[2], { symbol: "X1-QB20-57458X" });
});

Deno.test("👨‍🌾 can get PlanetsWithMoons ALT (Fp)", async () => {
  const getWaypointsFp = createGetPlanetsWithMoonsFpAlt(
    "http://localhost:3000/waypointsForSystem.json"
  );
  const thunk = getWaypointsFp();
  const resultEither = await thunk();
  const result = getRight(resultEither);
  // console.log(result);

  assertEquals(result.length, 3);
  /*
  //   console.log(result);

  assertObjectMatch(result[0], { symbol: "X1-QB20-78791D" });
  assertObjectMatch(result[1], { symbol: "X1-QB20-61050B" });
  assertEquals(result[1].moons.length, 3);
  assertObjectMatch(result[1].moons[0], { symbol: "X1-QB20-40572B" });
  assertObjectMatch(result[1].moons[1], { symbol: "X1-QB20-88193B" });
  assertObjectMatch(result[1].moons[2], { symbol: "X1-QB20-92514D" });
  assertObjectMatch(result[2], { symbol: "X1-QB20-57458X" });
  */
});

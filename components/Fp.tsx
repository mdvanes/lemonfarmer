import { pipe } from "fp-ts/lib/function";

function add1(num: number): number {
  return num + 1;
}

function multiply2(num: number): number {
  return num * 2;
}

function concat(
    a: number,
    transformer: (a: number) => string,
  ): [number, string] {
    return [a, transformer(a)]
  }
  

export const Fp = () => {
  return <div>fp {pipe(1, add1, multiply2)}</div>;
};

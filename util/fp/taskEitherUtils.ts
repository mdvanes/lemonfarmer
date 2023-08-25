import { Either, toError } from "fp-ts/lib/Either";
import {
  TaskEither,
  chain,
  fromEither,
  map,
  tryCatch,
} from "fp-ts/lib/TaskEither";
import { Lazy, flow } from "fp-ts/lib/function";

function fromThunk<A>(thunk: Lazy<Promise<A>>): TaskEither<Error, A> {
  return tryCatch(thunk, toError);
}

export function logValueWith(logger: (firstArg: any, ...args: any[]) => void) {
  return <A>(logString: String) =>
    map((obj: A) => {
      logger(logString, obj);
      return obj;
    });
}

function chainEither<A, B>(
  f: (a: A) => Either<Error, B>
): (ma: TaskEither<Error, A>) => TaskEither<Error, B> {
  return chain(flow(f, fromEither));
}

export default {
  fromThunk,
  logValueWith,
  chainEither,
};

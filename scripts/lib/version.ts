import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Fn from "effect/Function";
import * as Str from "effect/String";

export const version = Effect.gen(function*() {
  const fs = yield* FileSystem.FileSystem;
  return Fn.pipe(
    yield* fs.readFileString("VERSION", "utf8"),
    Str.trim,
    Str.replace(/^v/, ""),
  );
});

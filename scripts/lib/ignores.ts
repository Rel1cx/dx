import * as Arr from "effect/Array";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Fn from "effect/Function";
import { not, or } from "effect/Predicate";
import * as Str from "effect/String";

export const ignores = Effect.gen(function*() {
  const fs = yield* FileSystem.FileSystem;
  const content = yield* fs.readFileString(".gitignore", "utf8");
  return Fn.pipe(
    content,
    Str.split("\n"),
    Arr.filter(not(or(Str.startsWith("#"), Str.startsWith("!")))),
    Arr.map(Str.trim),
    Arr.filter(Str.isNonEmpty),
    Arr.map((s) => s.replace(/^\//, "")),
  );
});

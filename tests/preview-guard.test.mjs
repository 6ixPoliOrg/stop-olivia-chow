import test from "node:test";
import assert from "node:assert/strict";
import { isPreviewConfigured } from "../src/lib/preview-guard.ts";

test("a missing or malformed preview hash cannot unlock draft content", () => {
  assert.equal(isPreviewConfigured(undefined), false);
  assert.equal(isPreviewConfigured(""), false);
  assert.equal(isPreviewConfigured("not-a-hash"), false);
  assert.equal(isPreviewConfigured("a".repeat(64)), true);
});

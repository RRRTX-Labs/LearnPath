import { validateCatalog } from "../src/lib/content";

const errors = validateCatalog();
if (errors.length) {
  console.error("Content validation failed:");
  for (const error of errors) console.error(" -", error);
  process.exit(1);
}
console.log("Content OK.");

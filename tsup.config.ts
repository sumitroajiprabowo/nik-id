import { defineConfig } from "tsup";

export default defineConfig({
	entry: [
		"src/index.ts",
		"src/types.ts",
		"src/validate.ts",
		"src/parse.ts",
		"src/generate.ts",
	],
	format: ["esm", "cjs"],
	dts: true,
	splitting: false,
	sourcemap: false,
	clean: true,
});

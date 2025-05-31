import { basename, dirname, resolve } from "node:path";
import { cwd } from "node:process";
import { glob } from "glob";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		target: "esnext",
		outDir: resolve(cwd(), "dist"),
		rollupOptions: {
			input: (await glob("public/**/index.html")).reduce(
				(put: Record<string, string>, path: string) => {
					put[basename(dirname(path))] = path;
					return put;
				},
				{}
			)
		},
		sourcemap: true
	},
	server: {
		port: 3000
	},
	publicDir: resolve(cwd(), "static"),
	root: resolve(cwd(), "public"),
	appType: "spa"
});

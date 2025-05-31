import { Hono } from "hono";
import { serveStatic } from "hono/bun";

const app = new Hono();
const port = process.env.PORT ?? 3000;

app.use("*", serveStatic({ root: "./dist" }));

export default {
	port,
	fetch: app.fetch
};

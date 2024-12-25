import { Hono } from "hono";
import { githubRoutes } from "./portfolio/github";
import { cors } from "hono/cors";
import { updateYearsContributionsCount, updateTodaysContributions } from "./portfolio/lib";

export interface Env {
  kv_store: KVNamespace;
}

export type Bindings = {
  kv_store: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "/*",
  cors({
    origin: ["https://hemramk.vercel.app", "http://localhost:5173"],
    allowMethods: ["GET"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
  }),
);

app.get("/", (c) => {
  return c.text("Hello World!");
});

app.route("/github", githubRoutes);

app.get("/testkv", async (c) => {
  await c.env.kv_store.put("somewhere", "something");
  const data = await c.env.kv_store.get("somewhere") || "nothing here";
  return c.text(data);
});

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx);
  },
  async scheduled(env: Env, ctx: ExecutionContext) {
    let currYear = new Date().getFullYear().toString();
    ctx.waitUntil(updateTodaysContributions(env, currYear));
    ctx.waitUntil(updateYearsContributionsCount(env));
  },
};

import { Hono } from "hono";
import { githubRoutes } from "./portfolio/github";
import { cors } from "hono/cors";
import {
  updateTodaysContributions,
  updateYearsContributionsCount,
} from "./portfolio/lib";
import { workRoutes } from "./work/api";

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
    origin: [
      "https://hemramk.vercel.app",
      "http://localhost:5173",
      "http://localhost:5000",
      "http://localhost:5000/5503ef73250641a5b261fc48bd04ca8c/mts/billing/invoices",
    ],
    allowMethods: ["GET", "POST", "PUT"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "Referrer",
      "itron-userid",
      "itron-tenantid",
      "itron-correlationid",
      "itron-clientid",
    ],
    exposeHeaders: ["Content-Length"],
  }),
);

app.options("/*", (c) => {
  return c.text("preflight responser", 204);
});

app.get("/", (c) => {
  return c.text("Hello World!");
});

app.route("/github", githubRoutes);

app.route("/api", workRoutes);

app.get("/crontest", async (c) => {
  await c.env.kv_store.put("something", "something of a nigger");
  const data = (await c.env.kv_store.get("something")) || "nothing here";
  return c.text(data);
});

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx);
  },
  async scheduled(env: Env) {
    const executer = async () => {
      let currYear = new Date().getFullYear().toString();
      console.log("Curr Year: ", currYear);
      await updateTodaysContributions(env, currYear);
      await updateYearsContributionsCount(env);
    };
    executer();
  },
};

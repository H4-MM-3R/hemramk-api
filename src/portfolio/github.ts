import { Hono } from "hono";
import {
  fetchDataByYear,
  fetchYears,
} from "./lib";
import { Bindings } from "..";

export const githubRoutes = new Hono<{ Bindings: Bindings }>()
  .get("/years", async (c) => {
    return c.json(await fetchYears(c.env));
  })
  .get("/contributions/:year", async (c) => {
    return c.json(await fetchDataByYear(c.env, c.req.param("year")));
  })
  // .get("seed/years", async (c) => {
  //   await updateYearsContributionsCount(c.env);
  //   return c.json({ message: "updated years" });
  // })
  // .get("seed/contri/:year", async (c) => {
  //   await updateTodaysContributions(c.env, c.req.param("year"));
  //   return c.json({ message: "updated today's contributions" });
  // });

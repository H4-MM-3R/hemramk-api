import * as cheerio from "cheerio";
import _ from "lodash";
import { Env } from "..";

export async function getYears() {
  const data = await fetch("https://github.com/h4-mm-3r?tab=contributions", {
    headers: {
      "x-requested-with": "XMLHttpRequest",
    },
  });
  const body = await data.text();
  const $ = cheerio.load(body);
  return $(".js-year-link.filter-item")
    .get()
    .map((a) => {
      const $a = $(a);
      const href = $a.attr("href");
      const githubUrl = new URL(`https://github.com${href}`);
      githubUrl.searchParams.set("tab", "contributions");
      const formattedHref = `${githubUrl.pathname}${githubUrl.search}`;

      return {
        href: formattedHref,
        text: $a.text().trim(),
      };
    });
}

export async function getDataByYear(year: string) {
  const years = await getYears();
  const url = years[years.findIndex((y) => y.text === year)].href;
  const data = await fetch(`https://github.com${url}`, {
    headers: {
      "x-requested-with": "XMLHttpRequest",
    },
  });
  const $ = cheerio.load(await data.text());
  const $days = $(
    "table.ContributionCalendar-grid td.ContributionCalendar-day",
  );
  const contribText = $(".js-yearly-contributions h2")
    .text()
    .trim()
    .match(/^([0-9,]+)\s/);
  let contribCount: any;
  if (contribText) {
    [contribCount] = contribText;
    contribCount = parseInt(contribCount.replace(/,/g, ""), 10);
  }
  return {
    year,
    total: contribCount || 0,
    range: {
      start: $($days.get(0)).attr("data-date"),
      end: $($days.get($days.length - 1)).attr("data-date"),
    },
    contributions: (() => {
      const parseDay = (day: any) => {
        const dateData = $(day).attr("data-date") || "0";
        const levelData = $(day).attr("data-level") || "0";
        const date = dateData.split("-").map((d) => parseInt(d, 10));
        const color = levelData
        const value = {
          date: dateData,
          color,
        };
        return { date, value };
      };

      return $days.get().map((day) => parseDay(day).value);
    })(),
  };
}

export async function fetchYears(env: Env){
    const years = await env.kv_store.get("github-contributions-years") || "";
    return JSON.parse(years);
}

export async function fetchDataByYear(env: Env, year: string){
    const data = await env.kv_store.get(`github-contributions-data-${year}`) || "";
    return JSON.parse(data);
}

export async function updateTodaysContributions(env: Env, currYear: string) {
  let yearDataContributions = await getDataByYear(currYear);
  await env.kv_store.put(
    `github-contributions-data-${currYear}`,
    JSON.stringify(yearDataContributions),
  );
}

export async function updateYearsContributionsCount(env: Env) {
  let yearData = await getYears();
  await env.kv_store.put(
    "github-contributions-years",
    JSON.stringify(yearData),
  );
}

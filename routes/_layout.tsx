import { Head } from "$fresh/runtime.ts";
import { defineLayout } from "$fresh/server.ts";
import { Fp } from "../components/Fp.tsx";
import Lcars, { APP_TITLE_FANCY } from "../components/Lcars.tsx";
import { getMyAgentHq } from "../util/getCurrentSystemWaypoints.ts";

export default defineLayout(async (_req, { Component, route, params }) => {
  const hq = await getMyAgentHq();

  const systemName = (() => {
    if (route === "/systems") {
      return "All Systems";
    }
    if (params.symbol) {
      return `System ${params.symbol}`;
    }
    return `HQ System ${hq.join("-")}`;
  })();

  return (
    <>
      <Head>
        <title>{APP_TITLE_FANCY}</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👨‍🌾</text></svg>"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/global.css" />
        <link rel="stylesheet" href="/lcars.css" />
      </Head>

      <div class="mx-auto pt-4 pl-4 pr-4 h100">
        <div class="flex h100">
          <Lcars systemName={systemName}>
            <Component />
          </Lcars>
        </div>
      </div>
    </>
  );
});

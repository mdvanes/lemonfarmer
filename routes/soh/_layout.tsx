import { Head } from "$fresh/runtime.ts";
import { defineLayout, LayoutConfig } from "$fresh/server.ts";

export const config: LayoutConfig = {
  skipInheritedLayouts: true, // Skip already inherited layouts
};

export default defineLayout((_req, { Component, route, params }) => {
  return (
    <>
      <Head>
        <title>state of html</title>
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
        {/*<link rel="stylesheet" href="/global.css" />
        <link rel="stylesheet" href="/lcars.css" /> */}
        <link rel="stylesheet" href="/soh.css" />
      </Head>

      <Component />
    </>
  );
});

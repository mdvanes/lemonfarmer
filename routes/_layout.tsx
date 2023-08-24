import { Head } from "$fresh/runtime.ts";
import { LayoutProps } from "$fresh/server.ts";
import { Fp } from "../components/Fp.tsx";
import Lcars from "../components/Lcars.tsx";
import NavLink from "../islands/NavLink.tsx";

const APP_TITLE = "🍋 Lemon 👨‍🌾 Farmer";

export default function Layout({ Component, params, route }: LayoutProps) {
  const systemName = (() => {
    if (route === "/systems") {
      return "All Systems";
    }
    if (params.symbol) {
      return `System ${params.symbol}`;
    }

    return "System ???"; // TODO value should come from myAgent api _ see Async layouts with Define helper on https://fresh.deno.dev/docs/concepts/layouts _
  })();

  return (
    <>
      <Head>
        <title>{APP_TITLE}</title>
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
          href="https://fonts.googleapis.com/css2?family=family=Roboto+Condensed:wght@700"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/global.css" />
        <link rel="stylesheet" href="/lcars.css" />
      </Head>

      <div class="mx-auto p-4">
        <div class="flex pb-8">
          <Lcars systemName={systemName}>
            <>
              <Component />
              <Fp />
            </>
          </Lcars>
        </div>
      </div>
    </>
  );
}

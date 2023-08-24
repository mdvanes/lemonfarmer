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

    return "System ???"; // TODO value should come from myAgent api _ see Async layouts with Define helper on https://fresh.deno.dev/docs/concepts/layouts
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
        <link rel="stylesheet" href="/lcars.css" />
      </Head>

      <div class="mx-auto max-w-7xl pt-4">
        <div class="flex pb-8">
          <Lcars systemName={systemName}>
            <Component />
          </Lcars>
          {/* <div class="lcars">
            <div class="top">
              <div class="title">LEMON FARMER</div>
            </div>
            <div class="bottom">
              <div class="left">
                <ul>
                  <li>{systemName.toUpperCase()}</li>
                </ul>
              </div>
              <main>my main</main>
            </div>
          </div> */}
        </div>

        <div class="flex pb-8">
          <div class="flex-1">{APP_TITLE}</div>
          <div class="flex-none">{systemName}</div>
        </div>

        <Fp />

        <div class="actions">
          <NavLink />
          <a title="go to hq system" href="/">
            🚀
          </a>
        </div>

        {/* <Component /> */}
      </div>
    </>
  );
}

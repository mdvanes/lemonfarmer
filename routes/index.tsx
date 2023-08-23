import { Head } from "$fresh/runtime.ts";
// import Counter from "../islands/Counter.tsx";
import { Handlers, PageProps, Status } from "$fresh/server.ts";
import { useState } from "preact/hooks";
import { Fp } from "../components/Fp.tsx";
import StarChart from "../islands/StarChart.tsx";
import { ChartItem, Waypoint } from "../spacetrader.types.ts";
import {
  getCurrentSystemWaypoints,
  getMyAgentHq,
} from "../util/getCurrentSystemWaypoints.ts";
import NavLink from "../islands/NavLink.tsx";

interface Props {
  hq: [string, string];
  waypoints: readonly Waypoint[];
}

export const handler: Handlers<Props> = {
  async GET(_, ctx) {
    try {
      const hq = await getMyAgentHq();
      const waypoints = await getCurrentSystemWaypoints();
      return ctx.render({ hq, waypoints });
    } catch (err) {
      return new Response("Can't retrieve waypoints", {
        status: Status.NotFound,
      });
    }
  },
};

const APP_TITLE = "🍋 Lemon 👨‍🌾 Farmer";

export default function Home({ data: { hq, waypoints } }: PageProps<Props>) {
  // const count = useSignal(3);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Head>
        <title>{APP_TITLE}</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👨‍🌾</text></svg>"
        />
      </Head>
      <div class="mx-auto max-w-7xl pt-4">
        {/* <Counter count={count} /> */}
        {/* TODO Deduplicate this header & actions and Head - they are now in 3 places (here, /system/ & /system/slug) */}
        <div class="flex pb-8">
          <div class="flex-1">{APP_TITLE}</div>
          <div class="flex-none">System {waypoints[0].systemSymbol}</div>
        </div>

        <Fp />

        <div class="actions">
          <NavLink />
          <a title="go to hq system" href="/">
            🚀
          </a>
        </div>

        <StarChart
          items={waypoints.map(
            (item) =>
              ({
                name: item.symbol,
                x: item.x,
                y: item.y,
                type: item.type,
              } as ChartItem)
          )}
          hq={hq}
        />
      </div>
    </>
  );
}

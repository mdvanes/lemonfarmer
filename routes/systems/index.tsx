import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps, Status } from "$fresh/server.ts";
import StarChart from "../../islands/StarChart.tsx";
import { ChartItem, System, Waypoint } from "../../spacetrader.types.ts";
import {
  getCurrentSystemWaypoints,
  getMyAgentHq,
} from "../../util/getCurrentSystemWaypoints.ts";
import { getSystems } from "../../util/getSystems.ts";

interface Props {
  waypoints: readonly Waypoint[];
  hq: [string, string];
  allSystems: readonly System[];
}

export const handler: Handlers<Props> = {
  async GET(_, ctx) {
    try {
      const hq = await getMyAgentHq();
      const waypoints = await getCurrentSystemWaypoints();
      const allSystems = await getSystems();
      return ctx.render({ hq, waypoints, allSystems });
    } catch (err) {
      return new Response("Can't retrieve waypoints", {
        status: Status.NotFound,
      });
    }
  },
};

const APP_TITLE = "🍋 Lemon 👨‍🌾 Farmer";

export default function Home({
  data: { waypoints, hq, allSystems },
}: PageProps<Props>) {
  // const count = useSignal(3);

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
        <div class="flex pb-8">
          <div class="flex-1">{APP_TITLE}</div>
          <div class="flex-none">System {waypoints[0].systemSymbol}</div>
        </div>

        <div class="actions">
          <a href="/systems">◀️</a>
          <a href="/">🚀</a>
        </div>

        <StarChart
          items={allSystems.map(
            (item) =>
              ({
                name: item.symbol,
                x: item.x,
                y: item.y,
                type: item.type,
              } as ChartItem)
          )}
          hq={hq}
          centered={false}
        />
      </div>
    </>
  );
}

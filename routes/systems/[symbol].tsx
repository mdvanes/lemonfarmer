import { Handlers, PageProps, Status } from "$fresh/server.ts";
import StarChart from "../../islands/StarChart.tsx";
import { ChartItem, Waypoint } from "../../spacetrader.types.ts";
import {
  getMyAgentHq,
  getSystemWaypoints,
} from "../../util/getCurrentSystemWaypoints.ts";

interface Props {
  waypoints: readonly Waypoint[];
  hq: [string, string];
}

export const handler: Handlers<Props> = {
  async GET(_, ctx) {
    try {
      const hq = await getMyAgentHq();
      const waypoints = await getSystemWaypoints(ctx.params.symbol);
      return ctx.render({ hq, waypoints });
    } catch (err) {
      return new Response("Can't retrieve waypoints", {
        status: Status.NotFound,
      });
    }
  },
};

export default function Home({ data: { waypoints, hq } }: PageProps<Props>) {
  return (
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
  );
}

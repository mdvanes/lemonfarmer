import { Handlers, PageProps, Status } from "$fresh/server.ts";
import StarChart from "../../islands/StarChart.tsx";
import { ChartItem, System } from "../../spacetrader.types.ts";
import { getMyAgentHq } from "../../util/getCurrentSystemWaypoints.ts";
import { getSystems } from "../../util/getSystems.ts";

interface Props {
  hq: [string, string];
  allSystems: readonly System[];
}

export const handler: Handlers<Props> = {
  async GET(_, ctx) {
    try {
      const hq = await getMyAgentHq();
      const allSystems = await getSystems();
      return ctx.render({ hq, allSystems });
    } catch (err) {
      return new Response("Can't retrieve waypoints", {
        status: Status.NotFound,
      });
    }
  },
};

export default function Home({ data: { hq, allSystems } }: PageProps<Props>) {
  return (
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
  );
}

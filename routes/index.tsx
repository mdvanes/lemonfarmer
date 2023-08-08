import { Head } from "$fresh/runtime.ts";
// import Counter from "../islands/Counter.tsx";
import { Handlers, PageProps, Status } from "$fresh/server.ts";
import { config } from "dotenv/mod.ts";
import StarChart from "../islands/StarChart.tsx";
import { getCurrentSystemWaypoints } from "../util/getCurrentSystemWaypoints.ts";

const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config().TOKEN}`,
  },
};

interface Waypoint {
  symbol: string;
  systemSymbol: string;
  x: number;
  y: number;
  type: string;
}

interface Props {
  waypoints: readonly Waypoint[];
}

export const handler: Handlers<Props> = {
  async GET(_, ctx) {
    // const { username } = ctx.params;
    // const response1 = await fetch(
    //   //       "https://api.spacetraders.io/v2/systems/X1-YU85/waypoints/X1-YU85-99640B",
    //   "https://api.spacetraders.io/v2/my/agent",
    //   options
    // );
    // const myAgent: MyAgentResponse = await response1.json();
    // console.log(myAgent);

    // const response = await fetch(
    //   //       "https://api.spacetraders.io/v2/systems/X1-YU85/waypoints/X1-YU85-99640B",
    //   "https://api.spacetraders.io/v2/systems/X1-YU85/waypoints",
    //   options
    // );

    // if (response.status === 404) {
    //   return new Response("Start Location: Not Found", {
    //     status: Status.NotFound,
    //   });
    // }

    // // console.log(await response.json());

    // const waypoints: Waypoint[] = await response.json();
    // // console.log(waypoints);
    // return ctx.render(waypoints);

    try {
      const waypoints = await getCurrentSystemWaypoints();
      return ctx.render({ waypoints });
    } catch (err) {
      return new Response("Can't retrieve waypoints", {
        status: Status.NotFound,
      });
    }
  },
};

const APP_TITLE = "🍋 Lemon 👨‍🌾 Farmer";

export default function Home({ data: { waypoints } }: PageProps<Props>) {
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
        {/* <Counter count={count} /> */}
        <div class="flex pb-8">
          <div class="flex-1">{APP_TITLE}</div>
          <div class="flex-none">System {waypoints[0].systemSymbol}</div>
        </div>

        <StarChart
          // items={[
          //   { name: data.data.systemSymbol, x: data.data.x, y: data.data.y },
          // ]}
          items={waypoints.map((item) => ({
            name: item.symbol,
            x: item.x,
            y: item.y,
            type: item.type,
          }))}
        />
      </div>
    </>
  );
}

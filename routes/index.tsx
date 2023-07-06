import { Head } from "$fresh/runtime.ts";
import { useSignal } from "@preact/signals";
// import Counter from "../islands/Counter.tsx";
import { Handlers, PageProps, Status } from "$fresh/server.ts";
import { config } from "dotenv/mod.ts";
import StarChart from "../islands/StarChart.tsx";

const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config().TOKEN}`,
  },
};

interface Waypoint {
  data: {
    systemSymbol: string;
    x: number;
    y: number;
  };
}

export const handler: Handlers<Waypoint | null> = {
  async GET(_, ctx) {
    // const { username } = ctx.params;

    const response = await fetch(
      "https://api.spacetraders.io/v2/systems/X1-YU85/waypoints/X1-YU85-99640B",
      options
    );

    if (response.status === 404) {
      return new Response("Start Location: Not Found", {
        status: Status.NotFound,
      });
    }
    const waypoint: Waypoint = await response.json();
    return ctx.render(waypoint);
  },
};

export default function Home({ data }: PageProps<Waypoint>) {
  const count = useSignal(3);

  return (
    <>
      <Head>
        <title>Lemonfarmer 🍋👨‍🌾</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        {data.data.systemSymbol} 
        🍋👨‍🌾
        {/* <Counter count={count} /> */}
        <StarChart items={[{name: data.data.systemSymbol, x: data.data.x, y: data.data.y}]} />
      </div>
    </>
  );
}

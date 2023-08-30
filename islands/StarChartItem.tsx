import { ChartItem } from "../spacetrader.types.ts";

interface StarChartItemsProps {
  d: ChartItem;
  hq: [string, string];
  satelliteItems: ChartItem[];
  xScale: d3.ScaleLinear<number, number, never>;
  yScale: d3.ScaleLinear<number, number, never>;
}

const getMoonsLabel2 = (items: ChartItem[]) => {
  const nr = items.filter(
    (item) => item.type !== "NEBULA" && item.type === "MOON"
  ).length;

  // return nr > 0 ? `+ ${nr} moons 🌙` : "";
  return "🌙 ".repeat(nr);
};

const getMoonsLabel = (items: ChartItem[], x: number, y: number) => {
  const radius = 35;
  const moons = items.filter(
    (item) => item.type !== "NEBULA" && item.type === "MOON"
  );

  if (moons.length < 1) {
    return;
  }

  return (
    <g>
      <circle class="moons-orbit" cx={x + 10} cy={y - 10} r={radius} />
      {/* {moons.map((_m, i) => (
        <text x={x + 10} y={y - 35}>
          🌙
        </text>
      ))} */}
      {/* https://spin.atomicobject.com/2015/06/12/objects-around-svg-circle-d3-js/ */}
      {moons.map((_m, i) => {
        const moonOriginX = x + radius * Math.sin(0);
        const moonOriginY = y - radius * Math.cos(0);
        console.log(moonOriginX, x, moonOriginY, y);

        return (
          <text
            x={moonOriginX}
            y={moonOriginY}
            class="a-moon"
            // transform={`rotate(90, ${x}, ${y})`}
          >
            🌙
          </text>
        );
      })}
    </g>
  );
  // return nr > 0 ? `+ ${nr} moons 🌙` : "";
  // return "🌙 ".repeat(nr);
};

const getStationsLabel = (items: ChartItem[]) => {
  const nr = items.filter(
    (item) => item.type !== "NEBULA" && item.type === "ORBITAL_STATION"
  ).length;

  // return nr > 0 ? `+ ${nr} stations 🛰️` : "";
  return "🛰️ ".repeat(nr);
};

const getItemColor = (d: ChartItem) => {
  if (d.type === "NEBULA") {
    return "grey";
  }
  if (d.type === "BLUE_STAR") {
    return "#4583ff"; // blue
  }
  if (d.type === "RED_STAR") {
    return "red";
  }
  if (d.type === "ORANGE_STAR") {
    return "orange";
  }
  if (d.type === "WHITE_DWARF") {
    return "#a7a7a7"; // white
  }
  if (d.type === "HYPERGIANT") {
    return "#a0a51d"; // yellow
  }
  // if (d.type === "PLANET") {
  //   return "blue";
  // }
  // if (d.type === "JUMP_GATE") {
  //   return "purple";
  // }
  // if (d.type === "GAS_GIANT") {
  //   return "red";
  // }
  // if (d.type === "ASTEROID_FIELD") {
  //   return "green";
  // }
  return "white";
};

const createGetItemIcon =
  (
    xScale: d3.ScaleLinear<number, number, never>,
    yScale: d3.ScaleLinear<number, number, never>
  ) =>
  (d: ChartItem) => {
    const c = { x: xScale(d.x), y: yScale(d.y) };
    const cc = {
      cx: xScale(d.x),
      cy: yScale(d.y),
      onClick: () => location.assign(`/systems/${d.name}`),
    };
    if (d.type === "NEBULA") {
      return "orange";
    }
    if (d.type === "PLANET") {
      return <text {...c}>🪐</text>;
    }
    if (d.type === "JUMP_GATE") {
      return <text {...c}>🌉</text>;
    }
    if (d.type === "GAS_GIANT") {
      return <text {...c}>⭐</text>;
    }
    if (d.type === "ASTEROID_FIELD") {
      return <text {...c}>🌠</text>;
    }
    if (d.type === "HYPERGIANT") {
      return <circle {...cc} r="15" />;
    }
    if (["BLUE_STAR", "RED_STAR", "ORANGE_STAR"].includes(d.type)) {
      return <circle {...cc} r="5" />;
    }
    return <circle {...cc} r="2.5" />;
  };

const StarChartItem = ({
  d,
  satelliteItems,
  xScale,
  yScale,
  hq,
}: StarChartItemsProps) => {
  const getItemIcon = createGetItemIcon(xScale, yScale);

  return (
    <g class="chart-item" fill={getItemColor(d)} stroke={getItemColor(d)}>
      {getItemIcon(d)}
      {/* <circle cx={xScale(d.x)} cy={yScale(d.y)} r="2.5" /> */}
      <g className="chart-item-label">
        <text x={xScale(d.x + 3)} y={yScale(d.y - 3)}>
          {d.name === hq.join("-") || d.name === hq[0] ? "🚀" : ""}
          {d.name}
        </text>
        {getMoonsLabel(satelliteItems, xScale(d.x), yScale(d.y))}
        <text x={xScale(d.x + 3)} y={yScale(d.y + 4)}>
          {/* {getMoonsLabel(satelliteItems)}  */}
          {getStationsLabel(satelliteItems)}
        </text>
      </g>
    </g>
  );
};

export default StarChartItem;

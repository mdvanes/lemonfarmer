import { ChartItem } from "../spacetrader.types.ts";

interface StarChartItemsProps {
  d: ChartItem;
  hq: [string, string];
  satelliteItems: ChartItem[];
  xScale: d3.ScaleLinear<number, number, never>;
  yScale: d3.ScaleLinear<number, number, never>;
}

const getMoonsLabel = (items: ChartItem[], x: number, y: number) => {
  const radius = 45;
  const moons = items.filter(
    (item) => item.type !== "NEBULA" && item.type === "MOON"
  );

  if (moons.length < 1) {
    return;
  }

  const rotationFragment = 1 / moons.length;

  const cX = Math.floor(x + 10);
  const cY = Math.floor(y - 10);

  const moonOrbitRadius = radius + 7;
  const moonOriginX = x + moonOrbitRadius * Math.sin(0);
  const moonOriginY = y - moonOrbitRadius * Math.cos(0);

  return (
    <g class="moons-group" style={`transform-origin: ${cX}px ${cY}px`}>
      <circle class="moons-orbit" cx={cX} cy={cY} r={radius} />

      {moons.map((_m, i) => {
        return (
          <text
            x={moonOriginX}
            y={moonOriginY}
            class="a-moon"
            style={`transform: rotate(${
              rotationFragment * i
            }turn); transform-origin: ${cX}px ${cY}px`}
          >
            🌙
          </text>
        );
      })}
    </g>
  );
};

const getStationsLabel = (items: ChartItem[], x: number, y: number) => {
  const radius = 35;
  const stations = items.filter(
    (item) => item.type !== "NEBULA" && item.type === "ORBITAL_STATION"
  );

  if (stations.length < 1) {
    return;
  }

  const rotationFragment = 1 / stations.length;

  const cX = Math.floor(x + 10);
  const cY = Math.floor(y - 10);

  const moonOrbitRadius = radius + 7;
  const moonOriginX = x + moonOrbitRadius * Math.sin(0);
  const moonOriginY = y - moonOrbitRadius * Math.cos(0);

  return (
    <g
      class="moons-group stations-group"
      style={`transform-origin: ${cX}px ${cY}px`}
    >
      <circle class="moons-orbit" cx={cX} cy={cY} r={radius} />

      {stations.map((_m, i) => {
        return (
          <text
            x={moonOriginX}
            y={moonOriginY}
            class="a-moon"
            style={`transform: rotate(${
              rotationFragment * i
            }turn); transform-origin: ${cX}px ${cY}px`}
          >
            🛰️
          </text>
        );
      })}
    </g>
  );
};

// const getStationsLabel1 = (items: ChartItem[]) => {
//   const nr = items.filter(
//     (item) => item.type !== "NEBULA" && item.type === "ORBITAL_STATION"
//   ).length;

//   // return nr > 0 ? `+ ${nr} stations 🛰️` : "";
//   return "🛰️ ".repeat(nr);
// };

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
      <g className="chart-item-label">
        <text x={xScale(d.x + 3)} y={yScale(d.y - 3)}>
          {d.name === hq.join("-") || d.name === hq[0] ? "🚀" : ""}
          {d.name}
        </text>
        {getMoonsLabel(satelliteItems, xScale(d.x), yScale(d.y))}
        {getStationsLabel(satelliteItems, xScale(d.x), yScale(d.y))}
      </g>
    </g>
  );
};

export default StarChartItem;

import { ChartItem } from "../spacetrader.types.ts";

interface StarChartItemsProps {
  d: ChartItem;
  satelliteItems: ChartItem[];
  xScale: d3.ScaleLinear<number, number, never>;
  yScale: d3.ScaleLinear<number, number, never>;
}

const getMoonsLabel = (items: ChartItem[], d: ChartItem) => {
  const nr = items.filter((item) => item.type === "MOON").length;

  // return nr > 0 ? `+ ${nr} moons 🌙` : "";
  return "🌙 ".repeat(nr);
};

const getStationsLabel = (items: ChartItem[], d: ChartItem) => {
  const nr = items.filter((item) => item.type === "ORBITAL_STATION").length;

  // return nr > 0 ? `+ ${nr} stations 🛰️` : "";
  return "🛰️ ".repeat(nr);
};

const getItemColor = (d: ChartItem) => {
  if (d.type === "PLANET") {
    return "blue";
  }
  if (d.type === "JUMP_GATE") {
    return "purple";
  }
  if (d.type === "GAS_GIANT") {
    return "red";
  }
  if (d.type === "ASTEROID_FIELD") {
    return "green";
  }
  return "black";
};

const createGetItemIcon =
  (
    xScale: d3.ScaleLinear<number, number, never>,
    yScale: d3.ScaleLinear<number, number, never>
  ) =>
  (d: ChartItem) => {
    const c = { x: xScale(d.x), y: yScale(d.y) };
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
    return <circle cx={xScale(d.x)} cy={yScale(d.y)} r="2.5" />;
  };

const StarChartItem = ({
  d,
  satelliteItems,
  xScale,
  yScale,
}: StarChartItemsProps) => {
  const getItemIcon = createGetItemIcon(xScale, yScale);

  return (
    <g fill={getItemColor(d)} stroke={getItemColor(d)}>
      {getItemIcon(d)}
      {/* <circle cx={xScale(d.x)} cy={yScale(d.y)} r="2.5" /> */}
      <g className="chart-item-label">
        <text x={xScale(d.x + 3)} y={yScale(d.y - 3)}>
          {d.name}
        </text>
        <text x={xScale(d.x + 3)} y={yScale(d.y + 4)}>
          {getMoonsLabel(satelliteItems, d)}{" "}
          {getStationsLabel(satelliteItems, d)}
        </text>
      </g>
    </g>
  );
};

export default StarChartItem;

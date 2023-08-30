import { ChartItem } from "../spacetrader.types.ts";

export const isMoon = (item: ChartItem) =>
  item.type !== "NEBULA" && item.type === "MOON";
export const isStation = (item: ChartItem) =>
  item.type !== "NEBULA" && item.type === "ORBITAL_STATION";

const getAnimatedOrbitals =
  (radius: number, icon: string, items: ChartItem[], extraClass?: string) =>
  (x: number, y: number) => {
    if (items.length < 1) {
      return;
    }

    const rotationFragment = 1 / items.length;

    const cX = Math.floor(x + 10);
    const cY = Math.floor(y - 10);

    const moonOrbitRadius = radius + 7;
    const moonOriginX = x + moonOrbitRadius * Math.sin(0);
    const moonOriginY = y - moonOrbitRadius * Math.cos(0);

    return (
      <g
        class={`moons-group ${extraClass}`}
        style={`transform-origin: ${cX}px ${cY}px`}
      >
        <circle class="moons-orbit" cx={cX} cy={cY} r={radius} />

        {items.map((_m, i) => {
          return (
            <text
              x={moonOriginX}
              y={moonOriginY}
              class="a-moon"
              style={`transform: rotate(${
                rotationFragment * i
              }turn); transform-origin: ${cX}px ${cY}px`}
            >
              {icon}
            </text>
          );
        })}
      </g>
    );
  };

export const getAnimatedMoons = (items: ChartItem[], x: number, y: number) => {
  return getAnimatedOrbitals(45, "🌙", items.filter(isMoon))(x, y);
};

export const getAnimatedStations = (
  items: ChartItem[],
  x: number,
  y: number
) => {
  return getAnimatedOrbitals(
    35,
    "🛰️",
    items.filter(isStation),
    "stations-group"
  )(x, y);
};

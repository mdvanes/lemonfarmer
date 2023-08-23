import * as d3 from "d3";
import { Ref, useEffect, useRef } from "preact/hooks";
import { Head } from "$fresh/runtime.ts";
import { ChartItem } from "../spacetrader.types.ts";
import StarChartItem from "./StarChartItem.tsx";

const width = 1280;
const height = 640;
// const marginTop = 20;
// const marginRight = 20;
// const marginBottom = 30;
// const marginLeft = 40;

type ZoomEventTransform = {
  rescaleX: (
    _xScale: d3.ScaleLinear<number, number, never>
  ) => d3.AxisScale<d3.NumberValue>;
  rescaleY: (
    _yScale: d3.ScaleLinear<number, number, never>
  ) => d3.AxisScale<d3.NumberValue>;
};

interface Props {
  items: ChartItem[];
  centered?: boolean;
}

const styleTicks = () => {
  d3.selectAll("g.tick")
    .filter((d) => d === 0)
    .style("stroke-width", 2)
    .select("line")
    .style("stroke-opacity", 1);
};

const createUpdateXAxis =
  (gxRef: Ref<SVGGElement>, xScale: d3.ScaleLinear<number, number, never>) =>
  (transform?: ZoomEventTransform): void => {
    const newAxis = d3
      .axisBottom(xScale)
      .ticks(((width + 2) / (height + 2)) * 10)
      .tickSize(height)
      .tickPadding(8 - height);

    if (newAxis && gxRef.current) {
      if (transform) {
        newAxis.scale(transform.rescaleX(xScale));
      }
      d3.select(gxRef.current).call(newAxis);

      styleTicks();
    }
  };

const createUpdateYAxis =
  (gyRef: Ref<SVGGElement>, yScale: d3.ScaleLinear<number, number, never>) =>
  (transform?: ZoomEventTransform): void => {
    const newAxis = d3
      .axisRight(yScale)
      .ticks(10)
      .tickSize(width)
      .tickPadding(8 - width);

    if (newAxis && gyRef.current) {
      if (transform) {
        newAxis.scale(transform.rescaleY(yScale));
      }
      d3.select(gyRef.current).call(newAxis);

      styleTicks();
    }
  };

function filter(event: MouseEvent) {
  event.preventDefault();
  return (!event.ctrlKey || event.type === "wheel") && !event.button;
}

// Get absolute max value for items[].x or items[].y
const maxItemProp = (items: ChartItem[], itemProp: "x" | "y"): number => {
  const minMax = d3.extent(items.map((item) => item[itemProp]));
  const absMinMax = minMax.map((x) => (x ? Math.abs(x) : 0));
  return Math.max(...absMinMax);
};

const domainForAxis = (
  items: ChartItem[],
  axis: "x" | "y",
  centered: boolean
): [number, number] => {
  const MARGIN = 50;

  const minMax = d3.extent(items.map((item) => item[axis]));

  if (centered) {
    const absMinMax = minMax.map((x) => (x ? Math.abs(x) : 0));
    const max = Math.max(...absMinMax);
    return [-1 * max - MARGIN, max + MARGIN];
  }

  const [min, max] = minMax.map((x) => (x ? x : 0));
  const relativeMargin = (max - min) / 10;
  return [min - relativeMargin, max + relativeMargin];
};

const getSatelliteItems = (items: ChartItem[], d: ChartItem): ChartItem[] => {
  return items.filter((item) => item.x === d.x && item.y === d.y);
};

const StarChart = ({ items, centered = true }: Props) => {
  // console.log(items);
  const gxRef = useRef<SVGGElement>(null);
  const gyRef = useRef<SVGGElement>(null);
  const dataPointsRef = useRef<SVGGElement>(null);
  const viewRef = useRef<SVGRectElement>(null);

  const minMax = d3.extent(items.map((item) => item.x));
  const maxX = maxItemProp(items, "x");
  const maxY = maxItemProp(items, "y");

  // const domainX = minMax || [-1 * maxX - 50, maxX + 50];
  const domainX = domainForAxis(items, "x", centered);
  const domainY = domainForAxis(items, "y", centered);

  const xScale = d3
    .scaleLinear()
    .domain(domainX)
    // .domain(!xMinMax[0] || !xMinMax[1] ? [0, 0] : xMinMax)
    // .domain([-1 * width - 1, width + 1])
    // .domain([-1 * width - 1, width + 1])
    // .range(!xMinMax[0] || !xMinMax[1] ? [0, 0] : xMinMax);
    .range([-1, width + 1]);
  const updateXAxis = createUpdateXAxis(gxRef, xScale);

  const yScale = d3
    .scaleLinear()
    .domain(domainY)
    // .domain(!yMinMax[0] || !yMinMax[1] ? [0, 0] : yMinMax)
    // .domain([-1 * height - 1, height + 1])
    // .range(!yMinMax[0] || !yMinMax[1] ? [0, 0] : yMinMax);
    .range([-1, height + 1]);
  const updateYAxis = createUpdateYAxis(gyRef, yScale);

  // const calcX = d3.scaleLinear(
  //   [0, data.length - 1],
  //   [marginLeft, width - marginRight]
  // );
  // const dataMinMax = d3.extent(data);
  // const dataMinMaxNonNullable =
  //   !dataMinMax[0] || !dataMinMax[1] ? [0, 1] : dataMinMax;
  // const y = d3.scaleLinear(dataMinMaxNonNullable, [
  //   height - marginBottom,
  //   marginTop,
  // ]);
  // const line = d3.line((d, i) => calcX(i), yScale);

  useEffect((): void => {
    updateXAxis();
  }, [gxRef, xScale]);

  useEffect(() => {
    updateYAxis();
  }, [gyRef, yScale]);

  useEffect(() => {
    // console.log("viewRef useEffect");

    if (viewRef.current) {
      const zoom = d3
        .zoom<SVGRectElement, unknown>()
        // Max zoom out / in factor
        // .scaleExtent([-5, 40])
        .scaleExtent([1, 40])
        // .translateExtent([
        //   // Max zoomed out canvas size
        //   [-1 * (width + 90), -1 * (height + 100)],
        //   [width + 90, height + 100],
        // ])
        .filter(filter)
        .on("zoom", ({ transform }) => {
          if (gxRef && gyRef && viewRef) {
            d3.select(viewRef.current).attr("transform", transform);
            d3.select(dataPointsRef.current).attr("transform", transform);
            updateXAxis(transform);
            updateYAxis(transform);
          }
        });
      d3.select(viewRef.current).call(zoom);
    }
  }, [gxRef, gyRef, viewRef]);

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/star-chart.css" />
      </Head>
      <svg width={width} height={height} className="star-chart">
        {/* <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0.0%" stop-color="#2c7bb6"></stop>
          <stop offset="12.5%" stop-color="#00a6ca"></stop>
          <stop offset="25.0%" stop-color="#00ccbc"></stop>
          <stop offset="37.5%" stop-color="#90eb9d"></stop>
          <stop offset="50.0%" stop-color="#ffff8c"></stop>
          <stop offset="62.5%" stop-color="#f9d057"></stop>
          <stop offset="75.0%" stop-color="#f29e2e"></stop>
          <stop offset="87.5%" stop-color="#e76818"></stop>
          <stop offset="100.0%" stop-color="#d7191c"></stop>
        </linearGradient> */}
        <rect
          className="view"
          x={0}
          y={0}
          width={width}
          height={height}
          // x={0}
          // y={- (width / 2)}
          // width={width * 2}
          // height={height * 2}
          ref={viewRef}
        ></rect>

        <g ref={gxRef} className="axis axis--x" />
        <g ref={gyRef} className="axis axis--y" />

        {/* TODO start line */}
        {/* <path
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          d={line(data)?.toString()}
        /> */}
        {/* TODO end line */}
        {/* TODO start data points */}
        {/* <g fill="white" stroke="currentColor" stroke-width="1.5">
          {data.map((d, i) => (
            <circle key={i} cx={calcX(i)} cy={yScale(d)} r="2.5" />
          ))}
        </g> */}
        {/* TODO end data points */}

        <g
          ref={dataPointsRef}
          fill="white"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            d={d3.line((d, i) => xScale(0), yScale).toString()}
          />
          {items
            .filter(
              (item) =>
                item.type !== "NEBULA" &&
                item.type !== "MOON" &&
                item.type !== "ORBITAL_STATION"
            )
            .map((d, i) => (
              <StarChartItem
                key={i}
                d={d}
                satelliteItems={getSatelliteItems(items, d)}
                xScale={xScale}
                yScale={yScale}
              />
            ))}
        </g>
      </svg>
    </>
  );
};

export default StarChart;

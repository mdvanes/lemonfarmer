import { useEffect } from "preact/hooks";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import * as d3 from "d3";
import { Fp } from "../components/Fp.tsx";

function LinePlot({
  // data1,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 20,
}) {
  // const zoom = d3.zoom()
  // .scaleExtent([0.5, 32])
  // .on("zoom", zoomed);

  const data = d3.ticks(-2, 2, 200).map(Math.sin);
  const x = d3.scaleLinear(
    [0, data.length - 1],
    [marginLeft, width - marginRight]
  );
  // const y = d3.scaleLinear(d3.extent(data), [height - marginBottom, marginTop]);
  const y = d3.scaleLinear([0, 1.2], [height - marginBottom, marginTop]);
  const line = d3.line((d, i) => x(i), y);
  return (
    <svg width={width} height={height}>
      <path
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        d={line(data) ?? ""}
      />
      <g fill="white" stroke="currentColor" stroke-width="1.5">
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
        ))}
      </g>
    </svg>
  );
}

interface Props {
  items: {
    name: string;
    x: number;
    y: number;
    type: string;
  }[];
}

const X_OFFSET = 640;
const Y_OFFSET = 320;
const SCALE = 5;

const mapSpaceToCtxCoords = <T extends { x: number; y: number }>(
  item: T
): T => {
  return {
    ...item,
    x: item.x * SCALE + X_OFFSET,
    y: item.y * SCALE + Y_OFFSET,
  };
};

const drawGrid = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();

  // vertical 0
  ctx.moveTo(X_OFFSET, 0);
  ctx.lineTo(X_OFFSET, 2 * Y_OFFSET);
  ctx.stroke();

  // horizontal 0
  ctx.moveTo(0, Y_OFFSET);
  ctx.lineTo(2 * X_OFFSET, Y_OFFSET);
  ctx.stroke();

  ctx.lineWidth = 0.25;

  const tickInterval = 20;

  // vertical ticks
  Array(Math.floor((2 * X_OFFSET) / tickInterval))
    .fill(0)
    .forEach((_, i) => {
      ctx.moveTo(i * tickInterval, 0);
      ctx.lineTo(i * tickInterval, 2 * Y_OFFSET);
      ctx.stroke();
    });

  // horizontal ticks
  Array(Math.floor((2 * Y_OFFSET) / tickInterval))
    .fill(0)
    .forEach((_, i) => {
      ctx.moveTo(0, i * tickInterval);
      ctx.lineTo(2 * X_OFFSET, i * tickInterval);
      ctx.stroke();
    });
};

export default function StarChart({ items }: Props) {
  const drawStarChart = () => {
    const canvas = document.getElementById("starchart");
    if (!canvas) {
      return;
    }

    const ctx = (canvas as HTMLCanvasElement).getContext("2d");
    if (!ctx) {
      return;
    }

    drawGrid(ctx);

    items.map(mapSpaceToCtxCoords).forEach(({ name, type, x, y }) => {
      const isMe = name === "X1-YU85-99640B";
      ctx.fillStyle = isMe ? "red" : "black";
      ctx.fillRect(x, y, 5, 5);
      ctx.fillText(`${name} (${type})`, x, y + (isMe ? 10 : 0));
    });
  };

  useEffect(() => {
    drawStarChart();
  }, []);

  return (
    <>
      <Fp />
      <canvas
        id="starchart"
        width={2 * X_OFFSET}
        height={2 * Y_OFFSET}
      ></canvas>
    </>
    // <LinePlot />
    // https://observablehq.com/@d3/zoomable-scatterplot
    // <TransformWrapper>
    //   <TransformComponent>
    //     <>
    //       <div style={{ width: 100, height: 100, backgroundColor: "red" }} />
    //     </>
    //   </TransformComponent>
    // </TransformWrapper>
    // https://joshuatz.com/posts/2020/fixing-jsx-types-between-preact-and-react-libraries/
    // https://www.npmjs.com/package/react-zoom-pan-pinch
    // https://codesandbox.io/s/react-typescript-zoom-pan-html-canvas-p3itj?file=/src/Canvas.tsx:4151-4190
  );
}

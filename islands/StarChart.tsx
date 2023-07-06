import { useEffect } from "preact/hooks";

interface Props {
  items: {
    name: string;
    x: number;
    y: number;
  }[];
}

const X_OFFSET = 150;
const Y_OFFSET = 150;

const mapSpaceToCtxCoords = <T extends { x: number; y: number }>(
  item: T
): T => {
  return {
    ...item,
    x: item.x + X_OFFSET,
    y: item.y + Y_OFFSET,
  };
};

const drawGrid = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();

  // vertical 0
  ctx.moveTo(X_OFFSET, 0);
  ctx.lineTo(X_OFFSET, 2 * X_OFFSET);
  ctx.stroke();

  // horizontal 0
  ctx.moveTo(0, Y_OFFSET);
  ctx.lineTo(2 * Y_OFFSET, Y_OFFSET);
  ctx.stroke();

  ctx.lineWidth = 0.25;

  // vertical ticks
  Array(Math.floor((2 * X_OFFSET) / 10))
    .fill(0)
    .forEach((_, i) => {
      ctx.moveTo(i * 10, 0);
      ctx.lineTo(i * 10, 2 * X_OFFSET);
      ctx.stroke();
    });

  // horizontal ticks
  Array(Math.floor((2 * X_OFFSET) / 10))
    .fill(0)
    .forEach((_, i) => {
      ctx.moveTo(0, i * 10);
      ctx.lineTo(2 * Y_OFFSET, i * 10);
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

    items.map(mapSpaceToCtxCoords).forEach(({ name, x, y }) => {
      ctx.fillStyle = "red";
      ctx.fillRect(x, y, 5, 5);
      ctx.fillText(name, x, y);
    });
  };

  useEffect(() => {
    drawStarChart();
  }, []);

  return (
    <canvas id="starchart" width={2 * X_OFFSET} height={2 * Y_OFFSET}></canvas>
  );
}

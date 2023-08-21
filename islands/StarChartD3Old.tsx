import * as d3 from "d3";
import { useEffect, useRef } from "preact/hooks";

const width = 640;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

const StarChartD3Old = () => {
  const data: number[] = [1, 2, 5];
  const gx = useRef(null);
  const gy = useRef(null);
  const x = d3.scaleLinear(
    [0, data.length - 1],
    [marginLeft, width - marginRight]
  );
  const dataMinMax = d3.extent(data);
  const dataMinMaxNonNullable =
    !dataMinMax[0] || !dataMinMax[1] ? [0, 1] : dataMinMax;
  const y = d3.scaleLinear(dataMinMaxNonNullable, [
    height - marginBottom,
    marginTop,
  ]);
  const line = d3.line((d, i) => x(i), y);

  useEffect((): void => {
    const newAxis = d3.axisBottom(x);
    if (newAxis) {
      d3.select(gx.current).call(newAxis as any);
    }
  }, [gx, x]);
  
  useEffect(() => {
    const newAxis = d3.axisLeft(y);
    if (newAxis) {
      d3.select(gy.current).call(newAxis as any);
    }
  }, [gy, y]);

  return (
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <path
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        d={line(data)?.toString()}
      />
      <g fill="white" stroke="currentColor" stroke-width="1.5">
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
        ))}
      </g>
    </svg>
  );
};

export default StarChartD3Old;

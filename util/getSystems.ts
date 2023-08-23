import { System, SystemsResponse } from "../spacetrader.types.ts";
import { options } from "./fetchOptions.ts";

export const getSystems = async (): Promise<readonly System[]> => {
  const response = await fetch(
    `https://api.spacetraders.io/v2/systems`,
    options
  );

  if (response.status === 404) {
    throw new Error("No systems found");
  }

  const systems: SystemsResponse = await response.json();
  return systems.data;
};

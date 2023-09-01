import { UnsafeWaypointsResponse, Waypoint } from "../../spacetrader.types.ts";
import { Either, left, right } from "fp-ts/lib/Either";

export const validateWaypointResponse = (response: {
  status: number;
  payload: UnsafeWaypointsResponse;
}): Either<Error, UnsafeWaypointsResponse> => {
  // debugLog("validateWaypointResponse", response.status);
  return response.status >= 200 && response.status < 400
    ? right(response.payload)
    : left(Error("System not found"));
};

export const mapWaypointResponseToWaypoints = (
  response: UnsafeWaypointsResponse
): Waypoint[] => {
  return response.data;
};

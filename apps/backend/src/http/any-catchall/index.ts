// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import asap from "@architect/asap";
import { APIGatewayProxyEventV2 } from "aws-lambda";

import { handlingErrors } from "../../utils/handlingErrors";

const catchallHandler = async (event: APIGatewayProxyEventV2) => {
  // Log when catchall is hit to help debug routing issues
  console.warn("Catchall handler hit", {
    method: event.requestContext.http.method,
    path: event.rawPath,
    routeKey: event.requestContext.routeKey,
  });

  return asap({
    spa: true,
  })(event);
};

export const handler = handlingErrors(catchallHandler);

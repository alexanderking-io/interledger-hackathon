import { createClient } from "tigerbeetle-node";

import type {
  Get,
  UniversalMiddleware,
} from "@universal-middleware/core";
import { tigerBeetle } from "./utils/tigerbeetle";

declare global {
  namespace Universal {
    interface Context {
      tigerBeetle: ReturnType<typeof createClient>;
    }
  }
}

// Add `tigerBeetle` to the Context
export const tigerBeetleMiddleware: Get<[], UniversalMiddleware> = () => async (_request, context, _runtime) => {
  return {
    ...context,
    tigerBeetle: tigerBeetle,
  };
};

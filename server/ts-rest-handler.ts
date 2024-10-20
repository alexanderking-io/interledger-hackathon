import {
  fetchRequestHandler,
  tsr,
} from "@ts-rest/serverless/fetch";
// TODO: stop using universal-middleware and directly integrate server middlewares instead. (Bati generates boilerplates that use universal-middleware https://github.com/magne4000/universal-middleware to make Bati's internal logic easier. This is temporary and will be removed soon.)
import {
  Get,
  UniversalHandler,
} from "@universal-middleware/core";

import { dbSqlite } from "../database/drizzle/db";
import { completePayment, initiatePayment, recurringPayment } from "./interledger/main";
import * as todoQueries from "../database/drizzle/queries/todos";
import { contract } from "../ts-rest/contract";

/**
 * ts-rest route
 *
 * @link {@see https://ts-rest.com/docs/serverless/fetch-runtimes/}
 **/
const router = tsr.platformContext<{ db: ReturnType<typeof dbSqlite> }>().router(contract, {
  demo: async () => {
    return {
      status: 200,
      body: {
        demo: true,
      },
    };
  },
  createTodo: async ({ body }, _ctx) => {
    await todoQueries.insertTodo(_ctx.db, body.text);
    return {
      status: 200,
      body: {
        status: "Ok",
      },
    };
  },
  initiatePaymentRoute: async (req: { query: { serviceType : string} }) => {
    let userWalletUrl = "https://ilp.rafiki.money/testingusd";
    var res = await initiatePayment(userWalletUrl, req.query.serviceType);

    return {
      status: 200,
      body: {
        status: "Ok",
        res: res,
      },
    };
  },
  completePaymentRoute: async (req: { query: { interact_ref?: string } }) => {
    
    if (!('interact_ref' in req.query)) {
      return {
        status: 400,
        body: {
          status: "Bad Request",
        },
      };
    }
    var res = await completePayment(req.query.interact_ref!);

    if (!('failed' in res)) {
      return {
        status: 400,
        body: {
          status: "Bad Request",
        },
      };
    }

    return {
      status: 200,
      body: {
        status: "Ok",
        success: res.failed == false,
      },
    };
  },
  recurringPaymentRoute: async (req: { query: { serviceType?: string } }) => {

    let res = await recurringPayment(req.query.serviceType!);

    return {
      status: 200,
      body: {
        status: "Ok",
        success: res !== undefined,
        res: res,
      },
    };

  },
});

export const tsRestHandler: Get<[], UniversalHandler> = () => async (request, ctx, runtime) =>
  fetchRequestHandler({
    request: new Request(request.url, request),
    contract,
    router,
    options: {},
    platformContext: {
      ...ctx,
      ...runtime,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  });

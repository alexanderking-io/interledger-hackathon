import { createClient } from "tigerbeetle-node";

export const tigerBeetle = createClient({
  cluster_id: 0n,
  replica_addresses: [process.env.TB_ADDRESS || "3001"],
});

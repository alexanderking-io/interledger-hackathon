import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/head-tags
  title: "Table AJ - Team 41",
  description: "Demo showcasing Vike",

  passToClient: ["user"],
  extends: vikeReact,
} satisfies Config;

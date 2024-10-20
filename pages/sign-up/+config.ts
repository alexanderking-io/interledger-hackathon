import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

import Layout from "@/layouts/LayoutUnauthenticated";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/Layout
  Layout,

  // https://vike.dev/head-tags
  title: "Table AJ - Team 41",
  description: "Demo showcasing Vike",

  passToClient: ["user"],
  extends: vikeReact,
} satisfies Config;

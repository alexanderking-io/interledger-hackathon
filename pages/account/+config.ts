import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

import Layout from "@/layouts/LayoutUnauthenticated";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/Layout
  Layout,

  // https://vike.dev/head-tags
  title: "Account Create",
  description: "Transfa",

  passToClient: ["user"],
  extends: vikeReact,
} satisfies Config;

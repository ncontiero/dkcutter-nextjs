import type { NextConfig } from "next";
import "./src/env";

{% if dkcutter.useReactCompiler or dkcutter.useReactCompiler == "true" -%}
const nextConfig: NextConfig = {
  reactCompiler: true,
};
{%- else %}const nextConfig: NextConfig = {};{% endif %}

export default nextConfig;
